/**
 * Context Compact - OpenClaw Workspace Skill
 *
 * 4-layer progressive context compression system:
 * Layer 1: Time-based Microcompact
 * Layer 2: Session Memory Compact
 * Layer 3: Auto Compact Trigger
 * Layer 4: Full AI Summarization
 */

import { estimateMessageTokens, type Message } from './tokenEstimation.js';
import { timeBasedMicrocompact, DEFAULT_TIME_BASED_CONFIG, type TimeBasedConfig } from './timeBasedMicrocompact.js';
import { trySessionMemoryCompact, DEFAULT_SM_COMPACT_CONFIG, type SessionMemoryCompactConfig } from './sessionMemoryCompact.js';
import {
  autoCompactIfNeeded,
  calculateTokenWarningState,
  getAutoCompactThreshold,
  DEFAULT_AUTO_COMPACT_CONFIG,
  type AutoCompactConfig,
  type WarningState,
} from './autoCompact.js';
import { fullCompact, fullCompactWithFocus, DEFAULT_FULL_COMPACT_CONFIG, type FullCompactConfig } from './fullCompact.js';

// Re-export types
export type { Message, TimeBasedConfig, SessionMemoryCompactConfig, AutoCompactConfig, FullCompactConfig, WarningState };

// Default configuration
export const DEFAULT_CONFIG = {
  timeBased: DEFAULT_TIME_BASED_CONFIG,
  sessionMemory: DEFAULT_SM_COMPACT_CONFIG,
  autoCompact: DEFAULT_AUTO_COMPACT_CONFIG,
  fullCompact: DEFAULT_FULL_COMPACT_CONFIG,
};

export interface CompactOptions {
  agentId?: string;
  layer?: number; // 1-4, or 0 for auto
  focus?: string; // For Layer 4, what to focus summary on
  dryRun?: boolean;
}

export interface CompactResult {
  success: boolean;
  messages: Message[];
  layer: number;
  summary?: string;
  compactedCount?: number;
  warning?: WarningState;
  error?: string;
}

/**
 * Main entry point: compact conversation context.
 *
 * Usage:
 *   const result = await compactContext(messages, { agentId: 'main' });
 */
export async function compactContext(
  messages: Message[],
  options: CompactOptions = {}
): Promise<CompactResult> {
  const {
    agentId = 'main',
    layer = 0, // 0 = auto-select based on conditions
    focus,
    dryRun = false,
  } = options;

  const cfg = DEFAULT_CONFIG;

  try {
    let resultMessages = [...messages];
    let triggeredLayer = 0;
    let summary = '';
    let compactedCount = 0;

    if (dryRun) {
      const tokens = estimateMessageTokens(resultMessages);
      const warning = calculateTokenWarningState(tokens, cfg.autoCompact);
      return {
        success: true,
        messages: resultMessages,
        layer: 0,
        warning,
      };
    }

    // Layer 1: Time-based (always tried first for auto)
    if (layer === 0 || layer === 1) {
      const timeResult = timeBasedMicrocompact(resultMessages, cfg.timeBased);
      if (timeResult.triggered) {
        resultMessages = timeResult.messages;
        triggeredLayer = 1;
        compactedCount = timeResult.cleared.length;

        const tokens = estimateMessageTokens(resultMessages);
        const warning = calculateTokenWarningState(tokens, cfg.autoCompact);

        return {
          success: true,
          messages: resultMessages,
          layer: triggeredLayer,
          compactedCount,
          warning,
        };
      }
    }

    // Layer 2: Session Memory
    if (layer === 0 || layer === 2) {
      const smResult = await trySessionMemoryCompact(
        resultMessages,
        agentId,
        cfg.sessionMemory
      );
      if (smResult.triggered) {
        resultMessages = smResult.messages;
        triggeredLayer = 2;
        summary = smResult.boundary?.summary || '';

        const tokens = estimateMessageTokens(resultMessages);
        const warning = calculateTokenWarningState(tokens, cfg.autoCompact);

        return {
          success: true,
          messages: resultMessages,
          layer: triggeredLayer,
          summary,
          compactedCount: smResult.boundary ? messages.length - resultMessages.length : 0,
          warning,
        };
      }
    }

    // Layer 4: Full AI Summarization (Layer 3 is just a trigger, actual work is here)
    if (layer === 0 || layer === 4 || layer === 3) {
      const fullResult = focus
        ? await fullCompactWithFocus(resultMessages, focus, cfg.fullCompact)
        : await fullCompact(resultMessages, cfg.fullCompact);

      if (fullResult.triggered) {
        resultMessages = fullResult.messages;
        triggeredLayer = 4;
        summary = fullResult.summary;
        compactedCount = fullResult.compactedCount;

        const tokens = estimateMessageTokens(resultMessages);
        const warning = calculateTokenWarningState(tokens, cfg.autoCompact);

        return {
          success: true,
          messages: resultMessages,
          layer: triggeredLayer,
          summary,
          compactedCount,
          warning,
        };
      }
    }

    // No compression triggered
    const tokens = estimateMessageTokens(resultMessages);
    const warning = calculateTokenWarningState(tokens, cfg.autoCompact);

    return {
      success: true,
      messages: resultMessages,
      layer: 0,
      warning,
    };
  } catch (error) {
    return {
      success: false,
      messages,
      layer: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Get token statistics for messages.
 */
export function getTokenStats(messages: Message[]) {
  const tokens = estimateMessageTokens(messages);
  const warning = calculateTokenWarningState(tokens, DEFAULT_CONFIG.autoCompact);
  const threshold = getAutoCompactThreshold(DEFAULT_CONFIG.autoCompact);

  return {
    totalTokens: tokens,
    threshold,
    warning,
    messageCount: messages.length,
  };
}

/**
 * Check if auto compact should trigger.
 */
export async function checkAutoCompact(
  messages: Message[],
  agentId: string
) {
  return autoCompactIfNeeded(
    messages,
    agentId,
    DEFAULT_CONFIG.autoCompact,
    DEFAULT_CONFIG.timeBased,
    DEFAULT_CONFIG.sessionMemory
  );
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2] || 'status';

  switch (command) {
    case 'status': {
      console.log('Context Compact Skill loaded successfully');
      console.log('Use /compact in OpenClaw to trigger compression');
      break;
    }
    case 'help': {
      console.log(`
Context Compact - 4-layer Context Compression for OpenClaw

Usage:
  /compact           - Run auto-selected compression
  /compact layer 1   - Force time-based microcompact
  /compact layer 2   - Force session memory compact
  /compact layer 4   - Force full AI summarization
  /compact status     - Show token statistics
  /compact help       - Show this help

Layers:
  1 - Time-based Microcompact (clears old tool results)
  2 - Session Memory Compact (uses memory as summary)
  3 - Auto Trigger (monitors and triggers appropriate layer)
  4 - Full AI Summarization (AI-powered summary)

Configuration:
  Edit .openclaw/skills/context-compact/src/index.ts to adjust thresholds
`);
      break;
    }
    default:
      console.log(`Unknown command: ${command}`);
      console.log('Use "help" for usage information');
  }
}
