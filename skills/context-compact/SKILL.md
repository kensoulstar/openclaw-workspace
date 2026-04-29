---
name: context-compact
version: 1.0.0
description: "4-layer progressive context compression system for OpenClaw. Automatically manages conversation history to prevent context overflow."
author: OpenClaw Community
keywords: [context, compression, memory, session, compaction, context-window]
metadata:
  clawdbot:
    emoji: "🗜️"
    requires:
      env: []
      plugins: []
---

# Context Compact 🗜️

**4-layer progressive context compression system for OpenClaw.**

Automatically manages conversation history to prevent context overflow, reduce API costs, and maintain AI response quality over long sessions.

## Architecture

```
Layer 1: Time-based Microcompact (lightest)
  └─ Clears tool results older than X minutes

Layer 2: Session Memory Compact
  └─ Uses embedded memory as summary (no API call)

Layer 3: Auto Compact Trigger
  └─ Monitors token count, triggers compression automatically

Layer 4: Full AI Summarization (heaviest)
  └─ AI-powered summarization of conversation history
```

## Usage

### Automatic Mode

Context compression runs automatically when:
- Tool results are older than 60 minutes (configurable)
- Session token count exceeds 85% of context window

### Manual Commands

```bash
# Manual full compaction
/compact

# Check compaction status
/compact status

# Force specific layer
/compact layer 1  # Time-based only
/compact layer 4  # Full AI summarization

# View token statistics
/compact stats

# Help
/compact help
```

## Configuration

Add to `openclaw.json`:

```json
{
  "skills": {
    "context-compact": {
      "enabled": true,
      "timeBased": {
        "gapThresholdMinutes": 60,
        "keepRecent": 3
      },
      "sessionMemory": {
        "minTokens": 10000,
        "maxTokens": 40000
      },
      "autoCompact": {
        "thresholdPercent": 0.85,
        "warningPercent": 0.70
      },
      "fullCompact": {
        "windowMessages": 50
      }
    }
  }
}
```

## Layer Details

### Layer 1: Time-based Microcompact

**Trigger**: Tool results older than `gapThresholdMinutes`

**Action**: Replace old tool results with `[Old content cleared]`

**Config**:
- `gapThresholdMinutes`: Time gap threshold (default: 60)
- `keepRecent`: Number of recent tool results to keep (default: 3)

### Layer 2: Session Memory Compact

**Trigger**: Session memory contains sufficient summary

**Action**: Replace early messages with session memory reference

**Config**:
- `minTokens`: Minimum tokens before considering (default: 10000)
- `maxTokens`: Maximum tokens to keep (default: 40000)

### Layer 3: Auto Compact Trigger

**Trigger**: Token count exceeds threshold

**Action**: Automatically runs Layer 2, falls back to Layer 4

**Config**:
- `thresholdPercent`: Trigger at X% of context window (default: 0.85)
- `warningPercent`: Show warning at X% (default: 0.70)

### Layer 4: Full AI Summarization

**Trigger**: Manual `/compact` or Layer 3 fallback

**Action**: AI generates natural language summary of conversation

**Config**:
- `windowMessages`: Keep last N messages (default: 50)
- `model`: Model to use for summarization

## Token Estimation

Token count is estimated using a conservative 4/3 padding factor. Different content types:

| Content Type | Token Estimate |
|-------------|----------------|
| Plain text | ~4 chars per token |
| Tool result text | ~4 chars per token |
| Image/Document | 2000 tokens fixed |

## Example Workflow

1. User has a long debugging session
2. After 60 minutes of inactivity, Layer 1 clears old tool results
3. As conversation grows, Layer 3 monitors token count
4. At 85% threshold, Layer 2 attempts session memory compression
5. If session memory is insufficient, Layer 4 generates AI summary
6. Session continues with condensed context

## Safety

- **No data loss**: Compression preserves summaries; original content is referenced
- **Atomic operations**: Session JSONL is rewritten atomically
- **Reversible**: Session memory compression is reversible
- **Transparent**: AI knows when compression occurred via boundary markers
