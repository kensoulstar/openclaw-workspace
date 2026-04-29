/**
 * Layer 3: Auto Compact Trigger
 *
 * Monitors token usage and automatically triggers compression
 * when approaching context window limits.
 */

import { estimateMessageTokens } from './tokenEstimation.js';
import { trySessionMemoryCompact, type SessionMemoryCompactResult } from './sessionMemoryCompact.js';
import { timeBasedMicrocompact, type TimeBasedConfig } from './timeBasedMicrocompact.js';

export interface AutoCompactConfig {
  // Context window size for the model (in tokens)
  contextWindow: number;
  // Reserve this many tokens for output
  reservedOutputTokens: number;
  // Trigger auto compact at this percentage of effective window
  thresholdPercent: number;
  // Show warning at this percentage
  warningPercent: number;
  // Buffer tokens for autocompact trigger
  autocompactBufferTokens: number;
}

export const DEFAULT_AUTO_COMPACT_CONFIG: AutoCompactConfig = {
  contextWindow: 100_000, // MiniMax context window
  reservedOutputTokens: 20_000,
  thresholdPercent: 0.85,
  warningPercent: 0.70,
  autocompactBufferTokens: 13_000,
};

export type WarningLevel = 'none' | 'warning' | 'error' | 'critical';

export interface TokenWarningState {
  level: WarningLevel;
  percentUsed: number;
  tokensUsed: number;
  tokensRemaining: number;
  effectiveWindow: number;
}

/**
 * Calculate effective context window (minus reserved output).
 */
export function getEffectiveContextWindow(config: AutoCompactConfig): number {
  return config.contextWindow - config.reservedOutputTokens;
}

/**
 * Get auto compact threshold in tokens.
 */
export function getAutoCompactThreshold(config: AutoCompactConfig): number {
  const effective = getEffectiveContextWindow(config);
  return effective - config.autocompactBufferTokens;
}

/**
 * Calculate current token warning state.
 */
export function calculateTokenWarningState(
  tokenUsage: number,
  config: AutoCompactConfig = DEFAULT_AUTO_COMPACT_CONFIG
): TokenWarningState {
  const effectiveWindow = getEffectiveContextWindow(config);
  const percentUsed = tokenUsage / effectiveWindow;
  const tokensRemaining = effectiveWindow - tokenUsage;

  let level: WarningLevel = 'none';
  if (percentUsed >= config.thresholdPercent) {
    level = 'critical';
  } else if (percentUsed >= config.warningPercent) {
    level = 'warning';
  }

  return {
    level,
    percentUsed: Math.round(percentUsed * 100),
    tokensUsed: tokenUsage,
    tokensRemaining,
    effectiveWindow,
  };
}

/**
 * Main auto compact orchestrator.
 * Tries compression layers in order until one succeeds.
 */
export async function autoCompactIfNeeded(
  messages: Message[],
  agentId: string,
  autoConfig: AutoCompactConfig = DEFAULT_AUTO_COMPACT_CONFIG,
  timeBasedConfig?: TimeBasedConfig,
  sessionMemoryConfig?: SessionMemoryCompactConfig
): Promise<{
  messages: Message[];
  didCompact: boolean;
  layer: number;
  warning: TokenWarningState;
}> {
  const messages_ = messages;
  const tokenUsage = estimateMessageTokens(messages_);
  const warning = calculateTokenWarningState(tokenUsage, autoConfig);

  // If not above threshold, just return current state
  if (warning.level === 'none') {
    return {
      messages: messages_,
      didCompact: false,
      layer: 0,
      warning,
    };
  }

  // Try Layer 1: Time-based microcompact first (lightest)
  if (timeBasedConfig) {
    const timeResult = timeBasedMicrocompact(messages_, timeBasedConfig);
    if (timeResult.triggered) {
      return {
        messages: timeResult.messages,
        didCompact: true,
        layer: 1,
        warning,
      };
    }
  }

  // Try Layer 2: Session memory compact (medium)
  const smResult = await trySessionMemoryCompact(
    messages_,
    agentId,
    sessionMemoryConfig
  );
  if (smResult.triggered) {
    return {
      messages: smResult.messages,
      didCompact: true,
      layer: 2,
      warning,
    };
  }

  // Layer 3 (this layer) is a trigger, not a compressor
  // Actual compression will be done by Layer 4
  return {
    messages: messages_,
    didCompact: false,
    layer: 3,
    warning,
  };
}

// Re-export for convenience
import type { Message } from './tokenEstimation.js';
import type { SessionMemoryCompactConfig } from './sessionMemoryCompact.js';
