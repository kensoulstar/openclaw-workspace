---
name: batch
description: 并行工作编排技能，将大型任务分解为5-30个独立单元并行执行。当用户要求进行大规模代码迁移、重构、批量重命名等跨多文件操作时使用。
---

# Batch Skill

将大型任务分解为独立单元，并行执行。

## 核心概念

**Batch** 适合的场景：
- 跨多个文件的重构（如 React → Vue）
- 批量替换模式（如 lodash → 原生）
- 大规模迁移（如添加类型注解）
- 任何可以分解为独立单元的工作

## 工作流程

### Phase 1: 研究与规划（计划模式）

1. **理解范围** - 启动子 Agent 研究变更涉及的范围
2. **分解单元** - 将工作分解为 5-30 个自包含单元
   - 每个单元必须可独立实现
   - 每个单元可独立合并
   - 单元大小尽量均匀
3. **确定验证方式** - 找到验证变更的方法（单元测试、e2e测试等）
4. **编写计划** - 在计划文件中记录所有发现

### Phase 2: 并行执行（获得批准后）

为每个工作单元启动一个后台 Agent：
- 使用 `isolation: worktree` 确保隔离
- 使用 `run_in_background: true` 后台运行
- 所有 Agent 并行启动

### Phase 3: 跟踪进度

维护状态表：
```
| # | 单元 | 状态 | PR |
|---|------|--------|----|
| 1 | xxx | running | — |
| 2 | xxx | done | PR链接 |
```

完成后报告最终统计（如 "22/24 单元已完成 PR"）

## 使用示例

```
/batch migrate from react to vue
/batch replace all uses of lodash with native equivalents
/batch add type annotations to all untyped function parameters
```

## 注意事项

- 需要 Git 仓库支持（依赖 worktree 隔离）
- 适用于可分解的机械性变更
- 不适合需要顺序依赖的复杂逻辑
