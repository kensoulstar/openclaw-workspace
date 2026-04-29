/**
 * Layer 2: Session Memory Compact
 *
 * Uses pre-extracted session memory content as summarization
 * instead of calling an AI model.
 *
 * This is reversible - the session memory can be re-read if needed.
 */

import { type Message, estimateMessageTokens } from './tokenEstimation.js';

export interface SessionMemoryCompactConfig {
  minTokens: number;
  maxTokens: number;
  minTextBlockMessages: number;
}

export const DEFAULT_SM_COMPACT_CONFIG: SessionMemoryCompactConfig = {
  minTokens: 10_000,
  maxTokens: 40_000,
  minTextBlockMessages: 5,
};

export interface CompactionBoundary {
  type: 'compact_boundary';
  id: string;
  summary: string;
  preservedContent: string;
  timestamp: string;
}

export interface SessionMemoryCompactResult {
  messages: Message[];
  boundary?: CompactionBoundary;
  triggered: boolean;
  reason?: string;
}

/**
 * Mock session memory reader.
 * In real implementation, this would read from .openclaw/memory/*.sqlite
 */
export async function getSessionMemoryContent(agentId: string): Promise<string | null> {
  // TODO: Implement actual SQLite reading from .openclaw/memory/{agentId}.sqlite
  // For now, return null to indicate no session memory available
  return null;
}

/**
 * Count messages with text blocks.
 */
function countTextBlockMessages(messages: Message[]): number {
  let count = 0;
  for (const msg of messages) {
    const content = msg.message?.content || msg.content;
    if (Array.isArray(content) && content.some((b) => b.type === 'text')) {
      count++;
    }
  }
  return count;
}

/**
 * Calculate the starting index for messages to keep.
 * Ensures we meet both minTokens and minTextBlockMessages.
 */
function calculateMessagesToKeepIndex(
  messages: Message[],
  sessionMemoryContent: string,
  config: SessionMemoryCompactConfig
): number {
  const summaryTokens = estimateMessageTokens([
    {
      id: 'summary',
      type: 'user',
      message: { content: [{ type: 'text', text: sessionMemoryContent }] },
    },
  ]);

  // Target is to fit within maxTokens, keeping at least minTextBlockMessages
  const targetTokens = Math.min(
    config.maxTokens - summaryTokens,
    config.maxTokens
  );

  // Work backwards from the most recent message
  let accumulatedTokens = 0;
  let textBlockCount = 0;

  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    const tokens = estimateMessageTokens([msg]);
    accumulatedTokens += tokens;

    const content = msg.message?.content || msg.content;
    if (Array.isArray(content) && content.some((b) => b.type === 'text')) {
      textBlockCount++;
    }

    // Stop if we've met both thresholds
    if (
      accumulatedTokens >= targetTokens &&
      textBlockCount >= config.minTextBlockMessages
    ) {
      return i;
    }

    // Also stop if accumulated exceeds maxTokens (hard cap)
    if (accumulatedTokens > config.maxTokens) {
      return i + 1;
    }
  }

  return 0;
}

/**
 * Attempt session memory compact.
 *
 * Returns null if session memory is not available or insufficient.
 */
export async function trySessionMemoryCompact(
  messages: Message[],
  agentId: string,
  config: SessionMemoryCompactConfig = DEFAULT_SM_COMPACT_CONFIG
): Promise<SessionMemoryCompactResult> {
  // Check if session is large enough to warrant compression
  const totalTokens = estimateMessageTokens(messages);
  if (totalTokens < config.minTokens) {
    return {
      messages,
      triggered: false,
      reason: `Total tokens (${totalTokens}) below minimum (${config.minTokens})`,
    };
  }

  // Get session memory content from SQLite
  const sessionMemoryContent = await getSessionMemoryContent(agentId);
  if (!sessionMemoryContent || sessionMemoryContent.trim().length === 0) {
    return {
      messages,
      triggered: false,
      reason: 'Session memory content not available',
    };
  }

  // Find where to split the messages
  const startIndex = calculateMessagesToKeepIndex(
    messages,
    sessionMemoryContent,
    config
  );

  if (startIndex === 0) {
    return {
      messages,
      triggered: false,
      reason: 'No messages to compact',
    };
  }

  // Create boundary marker
  const boundary: CompactionBoundary = {
    type: 'compact_boundary',
    id: `compact-${Date.now()}`,
    summary: sessionMemoryContent,
    preservedContent: `Compacted ${startIndex} messages. Session memory available above.`,
    timestamp: new Date().toISOString(),
  };

  // Build new message list:
  // [boundary, ...recentMessages]
  const recentMessages = messages.slice(startIndex);

  // Create boundary as a system message
  const boundaryMessage: Message = {
    id: boundary.id,
    type: 'system',
    timestamp: boundary.timestamp,
    message: {
      content: [
        {
          type: 'text',
          text: `[Context Compact] Earlier conversation (${startIndex} messages) summarized in session memory:\n\n${sessionMemoryContent}`,
        },
      ],
    },
  };

  return {
    messages: [boundaryMessage, ...recentMessages],
    boundary,
    triggered: true,
  };
}
