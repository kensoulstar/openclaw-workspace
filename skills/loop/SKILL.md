---
name: loop
description: 循环执行技能，按指定间隔重复运行提示或斜杠命令。用于定时任务、状态轮询、持续监控等场景。
---

# Loop Skill

按指定间隔重复运行任务。

## 基本语法

```
/loop [间隔] <任务>

间隔格式: Ns, Nm, Nh, Nd (如 5m, 30m, 2h, 1d)
默认间隔: 10m（10分钟）
```

## 使用示例

```
/loop 5m /babysit-prs              # 每5分钟检查PR
/loop 30m check the deploy         # 每30分钟检查部署
/loop 1h /standup 1                # 每小时执行站会
/loop check the deploy             # 默认10分钟检查
/loop check the deploy every 20m   # 每20分钟检查
```

## 间隔解析规则

1. **前导标记**：如果第一个空格分隔的标记匹配 `\d+[smhd]$`，则为间隔
   - `5m /babysit-prs` → 间隔 `5m`，任务 `/babysit-prs`

2. **末尾 "every" 子句**：否则检查末尾的 `every N<unit>`
   - `check the deploy every 20m` → 间隔 `20m`，任务 `check the deploy`

3. **默认**：无指定则使用 `10m`

## 转换为 Cron 表达式

| 间隔 | Cron 表达式 | 说明 |
|------|-------------|------|
| `Nm` (N≤59) | `*/N * * * *` | 每 N 分钟 |
| `Nm` (N≥60) | `0 */H * * *` | 四舍五入到小时 |
| `Nh` (N≤23) | `0 */N * * *` | 每 N 小时 |
| `Nd` | `0 0 */N * *` | 每 N 天 |
| `Ns` | 视为 `ceil(N/60)m` | 最小1分钟 |

**注意**：如果间隔不能整除（如 `7m`、`90m`），选择最接近的整除间隔并告知用户。

## 使用场景

### 1. 状态轮询
```
/loop 5m check the deploy status
```

### 2. 持续监控
```
/loop 10m monitor system resources
```

### 3. 定时报告
```
/loop 1h generate usage report
```

### 4. 自动维护
```
/loop 30m cleanup temporary files
```

## 工作流程

1. **解析输入** - 提取间隔和任务
2. **验证任务** - 确认任务非空
3. **计算 Cron** - 转换为 cron 表达式
4. **创建定时任务** - 使用 cron 工具调度
5. **立即执行** - 同时立即执行一次任务
6. **确认设置** - 告知用户定时任务的 Cron 表达式

## 注意事项

- 定时任务默认在 **7 天后过期**
- 可以使用 `/cron delete` 取消
- 最小时间粒度为 **1 分钟**
- 斜杠命令（如 `/babysit-prs`）原样传递

## 生命周期

```
创建 → 首次执行 → 循环执行 → 过期/手动删除
```

## 使用示例

```
用户: 每5分钟检查一次部署状态
Agent:
1. 解析: 间隔=5m, 任务="check the deploy status"
2. 转换为 cron: */5 * * * *
3. 创建定时任务
4. 立即执行一次检查
5. 告知用户已设置
```
