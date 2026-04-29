---
name: updateConfig
description: 配置更新技能，用于修改OpenClaw配置。自动化行为（如"每当X时自动执行"）需要通过hooks实现，不是记忆。
---

# UpdateConfig Skill

修改 OpenClaw 配置。

## 何时需要 Hooks

如果用户想要在某个**事件**发生时自动执行操作，需要配置 **hook**，而不是依赖记忆。

**需要 Hooks 的场景**：
- "编译前问我保留什么" → PreCompact hook
- "写入文件后运行格式化" → PostToolUse hook
- "运行 bash 命令时记录日志" → PreToolUse hook
- "代码变更后总是运行测试" → PostToolUse hook

## 关键原则

### 1. 读取后再写

**始终先读取现有配置**，合并新设置，不要替换整个文件。

### 2. 模糊时询问

使用 AskUserQuestion 澄清：
- 修改哪个配置文件（全局/项目/本地）
- 是添加到现有数组还是替换
- 具体值是什么

### 3. 权限控制

**允许的工具**：
- `Read` - 读取配置文件
- `Write`/`Edit` - 修改配置文件

## 工作流程

1. **澄清意图** - 确认用户需求
2. **读取现有文件** - 使用 Read 工具
3. **合并配置** - 保留现有设置，添加新设置
4. **编辑文件** - 使用 Edit 工具
5. **确认变更** - 告知用户做了什么

## 常见配置类型

### 1. 权限配置

```json
{
  "permissions": {
    "allow": ["Bash(git:*)", "Bash(npm:*)"],
    "deny": ["Bash(rm:*)"],
    "defaultMode": "plan"
  }
}
```

### 2. Hook 配置

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "prettier --write $FILE"
      }]
    }]
  }
}
```

### 3. 环境变量

```json
{
  "env": {
    "DEBUG": "true",
    "LOG_LEVEL": "info"
  }
}
```

## 常见错误

| 错误 | 原因 | 解决 |
|------|------|------|
| 替换而非合并 | 直接覆盖文件 | 先读取，再合并 |
| JSON 无效 | 语法错误 | 验证后保存 |
| Hook 不运行 | 配置文件路径错误 | 检查文件位置 |

## 使用示例

```
用户: 允许 npm 命令不提示
Agent:
1. 读取现有权限配置
2. 添加 Bash(npm:*) 到 allow
3. 合并现有权限
4. 保存更新
```

```
用户: 代码保存后自动格式化
Agent:
1. 确认使用哪个格式化工具
2. 创建 PostToolUse hook
3. 配置 formatter 命令
4. 验证 hook 生效
```
