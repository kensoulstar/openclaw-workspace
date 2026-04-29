/**
 * Layer 1: Time-based Microcompact
 *
 * Clears old tool results when they've been idle for too long.
 * Lightest-weight compression - no API calls, no AI summarization.
 */

import {
  type Message,
  collectCompactableToolIds,
  getLastAssistantMessage,
  minutesSince,
  roughTokenCountEstimation,
} from './tokenEstimation.js';

export const TIME_BASED_MC_CLEARED_MESSAGE = '[Old tool result content cleared]';

// Default compactable tool types
export const DEFAULT_COMPACTABLE_TOOLS = new Set<string>([
  'file_read',
  'file_edit',
  'file_write',
  'bash',
  'shell',
  'grep',
  'glob',
  'web_search',
  'web_fetch',
  'read',
  'edit',
  'write',
]);

export interface TimeBasedConfig {
  gapThresholdMinutes: number;
  keepRecent: number;
  compactableTools?: Set<string>;
}

export const DEFAULT_TIME_BASED_CONFIG: TimeBasedConfig = {
  gapThresholdMinutes: 60,
  keepRecent: 3,
};

export interface TimeBasedResult {
  messages: Message[];
  cleared: string[];
  triggered: boolean;
  gapMinutes?: number;
}

/**
 * Check if time-based microcompact should trigger.
 *
 * Returns { gapMinutes, config } if trigger fires, null otherwise.
 */
export function evaluateTimeBasedTrigger(
  messages: Message[],
  config: TimeBasedConfig
): { gapMinutes: number; config: TimeBasedConfig } | null {
  const lastAssistant = getLastAssistantMessage(messages);

  if (!lastAssistant || !lastAssistant.timestamp) {
    return null;
  }

  const gapMinutes = minutesSince(lastAssistant.timestamp);

  if (!Number.isFinite(gapMinutes) || gapMinutes < config.gapThresholdMinutes) {
    return null;
  }

  return { gapMinutes, config };
}

/**
 * Perform time-based microcompact.
 *
 * Clears tool results older than the threshold, keeping only the most recent K.
 */
export function timeBasedMicrocompact(
  messages: Message[],
  config: TimeBasedConfig = DEFAULT_TIME_BASED_CONFIG
): TimeBasedResult {
  const trigger = evaluateTimeBasedTrigger(messages, config);

  if (!trigger) {
    return { messages, cleared: [], triggered: false };
  }

  const { gapMinutes } = trigger;
  const compactableTools = config.compactableTools || DEFAULT_COMPACTABLE_TOOLS;

  // Collect all compactable tool IDs in order
  const compactableIds = collectCompactableToolIds(messages, compactableTools);

  if (compactableIds.length === 0) {
    return { messages, cleared: [], triggered: false };
  }

  // Keep the most recent K, clear the rest
  const keepRecent = Math.max(1, config.keepRecent);
  const keepSet = new Set(compactableIds.slice(-keepRecent));
  const clearSet = new Set(
    compactableIds.filter((id) => !keepSet.has(id))
  );

  if (clearSet.size === 0) {
    return { messages, cleared: [], triggered: false };
  }

  // Replace tool results in clearSet with placeholder text
  let tokensSaved = 0;
  const result: Message[] = messages.map((message) => {
    if (message.type !== 'user') {
      return message;
    }

    const content = message.message?.content;

    if (!Array.isArray(content)) {
      return message;
    }

    let touched = false;
    const newContent = content.map((block) => {
      if (block.type === 'tool_result' && clearSet.has(block.tool_use_id)) {
        if (block.content !== TIME_BASED_MC_CLEARED_MESSAGE) {
          // Estimate tokens saved
          const contentStr = typeof block.content === 'string'
            ? block.content
            : JSON.stringify(block.content);
          tokensSaved += roughTokenCountEstimation(contentStr);
        }
        touched = true;
        return { ...block, content: TIME_BASED_MC_CLEARED_MESSAGE };
      }
      return block;
    });

    if (!touched) {
      return message;
    }

    return {
      ...message,
      message: { ...message.message, content: newContent },
    };
  });

  return {
    messages: result,
    cleared: Array.from(clearSet),
    triggered: true,
    gapMinutes,
  };
}
