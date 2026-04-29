/**
 * Token Estimation Utilities for OpenClaw Context Compression
 *
 * Provides rough token counting for messages and tool results.
 * Uses conservative 4/3 padding factor since we're estimating.
 */

// Approximate chars per token for plain text
const CHARS_PER_TOKEN = 4;

// Fixed token cost for images/documents
const IMAGE_TOKEN_SIZE = 2000;

// Padding factor to make estimates conservative
const PADDING_FACTOR = 4 / 3;

export interface MessageContentBlock {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system' | 'custom';
  role?: string;
  timestamp?: string;
  message?: {
    content?: MessageContentBlock[];
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: MessageContentBlock[] | any;
}

/**
 * Rough token count estimation for a string.
 * Uses ~4 chars per token with conservative padding.
 */
export function roughTokenCountEstimation(text: string): number {
  if (!text || typeof text !== 'string') {
    return 0;
  }
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

/**
 * Calculate token count for a tool result block.
 */
export function calculateToolResultTokens(block: MessageContentBlock): number {
  const content = block.content;

  if (!content) {
    return 0;
  }

  if (typeof content === 'string') {
    return roughTokenCountEstimation(content);
  }

  if (Array.isArray(content)) {
    return content.reduce((sum, item) => {
      if (item.type === 'text') {
        return sum + roughTokenCountEstimation(item.text || '');
      } else if (item.type === 'image' || item.type === 'document') {
        return sum + IMAGE_TOKEN_SIZE;
      }
      return sum;
    }, 0);
  }

  return 0;
}

/**
 * Estimate token count for a single message.
 */
function estimateMessageTokenInternal(message: Message): number {
  // Skip non-user/assistant messages
  if (message.type !== 'user' && message.type !== 'assistant') {
    return 0;
  }

  // Get content array
  const content = message.message?.content || message.content;

  if (!Array.isArray(content)) {
    return 0;
  }

  let totalTokens = 0;

  for (const block of content) {
    if (block.type === 'text') {
      totalTokens += roughTokenCountEstimation(block.text || '');
    } else if (block.type === 'tool_result') {
      totalTokens += calculateToolResultTokens(block);
    } else if (block.type === 'image' || block.type === 'document') {
      totalTokens += IMAGE_TOKEN_SIZE;
    } else if (block.type === 'thinking') {
      // Count only the thinking text, not the JSON wrapper
      totalTokens += roughTokenCountEstimation(block.thinking || '');
    } else if (block.type === 'redacted_thinking') {
      totalTokens += roughTokenCountEstimation(block.data || '');
    } else if (block.type === 'tool_use') {
      // Count name + input
      const name = block.name || '';
      const input = JSON.stringify(block.input || {});
      totalTokens += roughTokenCountEstimation(name + input);
    } else {
      // Other block types - serialize and estimate
      totalTokens += roughTokenCountEstimation(JSON.stringify(block));
    }
  }

  return totalTokens;
}

/**
 * Estimate token count for an array of messages.
 * Applies 4/3 padding factor for conservative estimation.
 */
export function estimateMessageTokens(messages: Message[]): number {
  let totalTokens = 0;

  for (const message of messages) {
    totalTokens += estimateMessageTokenInternal(message);
  }

  // Apply conservative padding factor
  return Math.ceil(totalTokens * PADDING_FACTOR);
}

/**
 * Check if a message has tool results.
 */
export function hasToolResults(message: Message): boolean {
  const content = message.message?.content || message.content;

  if (!Array.isArray(content)) {
    return false;
  }

  return content.some((block) => block.type === 'tool_result');
}

/**
 * Extract tool_use IDs from an assistant message.
 */
export function extractToolUseIds(message: Message): string[] {
  const content = message.message?.content || message.content;
  const ids: string[] = [];

  if (!Array.isArray(content)) {
    return ids;
  }

  for (const block of content) {
    if (block.type === 'tool_use' && block.id) {
      ids.push(block.id);
    }
  }

  return ids;
}

/**
 * Collect all compactable tool result IDs from messages.
 * Returns tool IDs in encounter order.
 */
export function collectCompactableToolIds(
  messages: Message[],
  compactableTools: Set<string>
): string[] {
  const ids: string[] = [];

  for (const message of messages) {
    if (message.type !== 'assistant') {
      continue;
    }

    const content = message.message?.content || message.content;

    if (!Array.isArray(content)) {
      continue;
    }

    for (const block of content) {
      if (block.type === 'tool_use' && compactableTools.has(block.name) && block.id) {
        ids.push(block.id);
      }
    }
  }

  return ids;
}

/**
 * Get the last assistant message from an array of messages.
 */
export function getLastAssistantMessage(messages: Message[]): Message | undefined {
  // Find in reverse order for efficiency
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].type === 'assistant') {
      return messages[i];
    }
  }
  return undefined;
}

/**
 * Calculate minutes since a timestamp.
 */
export function minutesSince(timestamp: string): number {
  const then = new Date(timestamp).getTime();
  const now = Date.now();
  return (now - then) / 60_000;
}
