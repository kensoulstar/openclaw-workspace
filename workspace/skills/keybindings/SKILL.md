---
name: keybindings
description: 快捷键管理技能，用于自定义键盘快捷键、重绑定按键、添加组合键绑定。
---

# Keybindings Skill

自定义 OpenClaw 的键盘快捷键。

## 文件位置

| 文件 | 范围 | 说明 |
|------|------|------|
| `~/.openclaw/keybindings.json` | 全局 | 个人偏好 |
| `.openclaw/keybindings.json` | 项目 | 项目级快捷键 |

## 文件格式

```json
{
  "$schema": "https://www.schemastore.org/openclaw-keybindings.json",
  "bindings": [
    {
      "context": "Chat",
      "bindings": {
        "ctrl+e": "chat:externalEditor"
      }
    }
  ]
}
```

## 按键语法

### 修饰符
- `ctrl` (别名: `control`)
- `alt` (别名: `opt`, `option`)
- `shift`
- `meta` (别名: `cmd`, `command`)

### 特殊键
`escape`/`esc`, `enter`/`return`, `tab`, `space`, `backspace`, `delete`, `up`, `down`, `left`, `right`

### 组合键
用空格分隔，如 `ctrl+k ctrl+s`

### 示例
- `ctrl+shift+p`
- `alt+enter`
- `ctrl+k ctrl+n`

## 常用快捷键操作

### 1. 重绑定按键

将 `ctrl+g` 改为 `ctrl+e`：

```json
{
  "context": "Chat",
  "bindings": {
    "ctrl+g": null,
    "ctrl+e": "chat:externalEditor"
  }
}
```

### 2. 解绑快捷键

将某个键设为 `null` 即可解除绑定：

```json
{
  "context": "Chat",
  "bindings": {
    "ctrl+s": null
  }
}
```

### 3. 添加组合键

```json
{
  "context": "Global",
  "bindings": {
    "ctrl+k ctrl+t": "app:toggleTodos"
  }
}
```

## 工作流程

1. **读取现有配置** - 检查是否已有 keybindings.json
2. **了解用户需求** - 要绑定什么操作
3. **验证快捷键** - 检查是否与系统保留键冲突
4. **合并修改** - 保留现有绑定，添加新绑定
5. **验证配置** - 确保 JSON 格式正确

## 冲突检查

### 不可重绑的快捷键
- Ctrl+C (终端中断)
- Ctrl+Z (挂起)
- Ctrl+D (退出)

### 终端保留
- Ctrl+S (XON/XOFF 流量控制)
- Ctrl+Q (恢复输出)

### 常见工具冲突
- tmux: `Ctrl+b`
- screen: `Ctrl+a`
- vim: 多种

## 常见问题

| 问题 | 原因 | 解决 |
|------|------|------|
| 快捷键无效 | JSON 语法错误 | 验证 JSON |
| 未知上下文 | 上下文名称错误 | 使用有效上下文名 |
| 冲突警告 | 与系统快捷键冲突 | 选择其他按键 |

## 使用示例

```
用户: 重新绑定 ctrl+s
Agent:
1. 读取现有配置
2. 询问新绑定到哪个操作
3. 检查是否冲突
4. 合并到配置文件
```
