---
name: claudeApi
description: Claude API构建技能，帮助构建基于Claude API的应用程序。适用于代码导入anthropic SDK、或用户要求使用Claude API/SDK的场景。
---

# ClaudeApi Skill

帮助构建基于 Claude API 的应用程序。

## 触发条件

**使用此 Skill 当**：
- 代码导入了 `anthropic` 或 `@anthropic-ai/sdk`
- 用户要求使用 Claude API
- 用户要求使用 Anthropic SDK
- 用户要求构建 Agent SDK 应用

**不使用此 Skill 当**：
- 代码导入 `openai` 或其他 AI SDK
- 一般编程任务
- ML/数据科学任务

## 常见应用场景

### 1. 简单对话

适用于单次文本分类、摘要、提取、问答：

```python
import anthropic

client = anthropic.Anthropic()
message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude"}
    ]
)
```

### 2. 流式响应

适用于聊天 UI 或实时显示响应：

```python
import anthropic

client = anthropic.Anthropic()
with client.messages.stream(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude"}
    ]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

### 3. 工具使用 (Function Calling)

适用于需要调用外部工具的场景：

```python
import anthropic

client = anthropic.Anthropic()
message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What's the weather?"}
    ],
    tools=[{"name": "get_weather", "description": "...", "input_schema": {...}}]
)
```

### 4. 提示缓存

适用于长上下文或重复内容的优化：

```python
import anthropic

client = anthropic.Anthropic()
message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello"}
    ],
    system=[{"type": "text", "content": "System prompt", "cache_control": {"type": "ephemeral"}}]
)
```

## SDK 安装

```bash
pip install anthropic    # Python
npm install @anthropic-ai/sdk    # JavaScript/TypeScript
```

## 错误处理

```python
import anthropic

try:
    message = client.messages.create(...)
except anthropic.RateLimitError:
    # 处理速率限制
    pass
except anthropic.APIError as e:
    # 处理 API 错误
    pass
```

## 最佳实践

1. **选择合适的模型**
   - `claude-opus-4-20250514`: 最强能力，复杂任务
   - `claude-sonnet-4-20250514`: 平衡性能与速度
   - `claude-haiku-4-20250514`: 快速响应，简单任务

2. **优化 Token 使用**
   - 设置合理的 `max_tokens`
   - 使用提示缓存减少重复内容
   - 及时清理会话历史

3. **错误处理**
   - 实现重试机制
   - 处理速率限制
   - 验证输入参数

## 使用示例

```
用户: 帮我用 Claude API 写一个聊天机器人
Agent:
1. 了解需求（流式/非流式、是否需要工具）
2. 提供代码模板
3. 解释关键参数
4. 提供错误处理示例
```
