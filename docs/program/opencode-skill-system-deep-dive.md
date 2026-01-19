---
title: OpenCode Skill 系统深度解析：从工具注册到 AI 执行的完整链路
date: 2026-01-19
tags:
- ai-generation
---

# OpenCode Skill 系统深度解析：从工具注册到 AI 执行的完整链路

前几天在探索 OpenCode 项目时，我注意到一个有趣的问题：这个项目支持 skills 吗？随着一层层代码的追踪，我发现了一个设计精巧的系统——Skill 不是什么特殊的魔法，而是作为普通的 Tool 深度集成到 Agent 架构中。

这篇文章记录了我对 OpenCode Skill 系统的完整探索过程，从最初的疑问到对整个架构的深入理解。

## 问题起源

一切始于一个简单的问题：OpenCode 支持 skills 吗？

通过搜索代码库，我很快发现了完整的 Skill 系统：

```
packages/opencode/src/skill/skill.ts    - Skill 扫描、解析和状态管理
packages/opencode/src/tool/skill.ts      - Skill 工具，将 skills 暴露给 AI
packages/opencode/src/cli/cmd/debug/skill.ts  - 调试命令
packages/opencode/test/skill/skill.test.ts    - 测试
```

项目会扫描两个位置：
- `.opencode/skill/` 或 `.opencode/skills/` —— OpenCode 原生格式
- `.claude/skills/` —— Claude Code 兼容格式

每个 skill 需要一个 `SKILL.md` 文件，包含 frontmatter（name、description）和内容。

## 深入探索：Skill 如何在 Agent Runtime 中发挥作用？

理解 Skill 的存在只是开始。真正有趣的问题是：当 Agent 运行时，这些 Skill 是如何发挥作用的？

### 第一步：Skill 作为 Tool 注册

打开 `packages/opencode/src/tool/registry.ts`，我看到 SkillTool 被添加到全局工具列表中：

```typescript
// packages/opencode/src/tool/registry.ts:111
return [
  InvalidTool,
  QuestionTool,
  BashTool,
  ReadTool,
  // ... 其他工具
  SkillTool,  // ← Skill 工具位置
  ...custom,
]
```

**关键发现**：Skill 不是独立的系统组件，而是作为普通工具注册。

### 第二步：工具解析与权限过滤

在 Agent 运行时，`ToolRegistry.tools()` 被调用，SkillTool.init() 执行，根据 agent 权限过滤 skills：

```typescript
// packages/opencode/src/session/prompt.ts:688-691
// ToolRegistry.tools() 被调用
// SkillTool.init() 执行，根据 agent 权限过滤 skills
```

这意味着不同的 agent 可以看到不同的技能列表——权限系统在工具层面就做了控制。

### 第三步：动态生成工具描述

SkillTool 会动态生成包含可用技能列表的描述：

```typescript
// packages/opencode/src/tool/skill.ts:16-39
// 生成包含可用技能列表的 description
// AI 能看到所有可访问的 skill 及其描述
```

比如描述可能是这样的：

```
"Load a skill to get detailed instructions for a specific task.
Skills provide specialized knowledge and step-by-step guidance.
Use this when a task matches an available skill's description."

<available_skills>
  <skill>
    <name>commit</name>
    <description>Create git commits</description>
  </skill>
  <skill>
    <name>code-review</name>
    <description>Review code changes</description>
  </skill>
</available_skills>
```

### 第四步：AI 调用后的完整流程

当 AI 决定使用某个 Skill 时，完整的执行流程是这样的：

```
1. AI 调用 skill 工具
   ↓
2. 权限检查 (PermissionNext.ask)
   ↓
3. 读取 SKILL.md 内容
   ↓
4. 返回 skill 的完整内容给 AI
   ↓
5. 内容进入对话历史
   ↓
6. AI 阅读并遵循指令继续执行
```

**关键洞察**：Skill 是一次性指令注入，不是持久模式切换。返回的 skill 内容会直接进入对话历史，AI 阅读后会自主遵循 skill 中的指令。

## Agent 如何挑选 Tool/Skills？

这是一个有趣的问题：如果有个 Tool 和 Skill 的能力重叠，Agent 会优先选哪个？

通过分析代码，我发现了几个影响选择的因素：

### 1. 描述质量

没有硬编码的优先级。选择完全依赖 AI 模型对描述的理解。

假设有 "commit" skill 和 "git-commit" tool 能力重叠：

```markdown
# Skill: "Create git commits following best practices"
# Tool: "Create git commits"
```

AI 可能选择 Skill，因为：
- 描述更具体（"best practices"）
- 承诺提供 "specialized knowledge"

但如果 Tool 描述更好：

```markdown
# Skill: "Git operations"  # 太模糊
# Tool: "Create commits with conventional format"  # 具体
```

AI 可能选择 Tool。

### 2. 列表顺序的影响

工具列表的顺序有轻微影响，但现代 AI 模型通常能理解全部工具，不会只看前面的。

### 3. 设计权衡

| 方面     | Skill                   | Tool            |
| -------- | ----------------------- | --------------- |
| 描述位置 | 动态生成 (skill.ts:24-39) | 代码硬编码      |
| 描述丰富度 | 包含完整技能列表         | 通常简短        |
| 更新成本 | 修改 SKILL.md            | 需要改代码      |
| AI 偏好  | 承诺"详细指令"可能更吸引 | 依赖描述质量    |

## 标准化的 Tool Call 流程

Skill 执行会经过标准化的 tool call 流程吗？

答案是：**完全标准化**。

### AI SDK 包装层

```typescript
// packages/opencode/src/session/prompt.ts:688-729
tools["skill"] = tool({
  id: "skill",
  description: "Load a skill...",
  inputSchema: jsonSchema(...),
  async execute(args, options) { ... },
  toModelOutput(result) { ... }
})
```

### SessionProcessor 事件处理

```typescript
// packages/opencode/src/session/processor.ts:126-194
case "tool-call": {
  // 创建 ToolPart，状态: running
  await Session.updatePart({
    type: "tool",
    tool: "skill",
    state: { status: "running", input: {name:"commit"} }
  })
}

case "tool-result": {
  await Session.updatePart({
    state: { status: "completed", output: "..." }
  })
}
```

Skill 与其他工具（Bash、Read、Edit）走的是完全一致的执行路径。

## Execute 的统一与差异

最后，我探索了 Skill 的 execute 实现。是统一实现吗？

答案：**架构层面统一，实现层面各异**。

### 通用层（统一）

```typescript
// packages/opencode/src/tool/tool.ts:47-87
Tool.define(id, init) {
  // 包装原始 execute 方法
  toolInfo.execute = async (args, ctx) => {
    // 1. 统一参数验证
    toolInfo.parameters.parse(args)

    // 2. 调用原始 execute
    const result = await execute(args, ctx)

    // 3. 统一输出截断
    const truncated = await Truncate.output(result.output, {}, initCtx?.agent)
    return { ...result, output: truncated.content, metadata: {...} }
  }
}
```

### 各工具实现层（各异）

| 工具      | execute 实现特点                          |
| --------- | ----------------------------------------- |
| BashTool  | 执行命令、解析参数、权限检查              |
| ReadTool  | 路径解析、外部目录检查、文件读取          |
| SkillTool | 获取 skill、权限检查、解析 SKILL.md       |

这是典型的**模板方法模式**：
- 通用层定义骨架（验证 → 执行 → 截断）
- 各工具实现核心业务逻辑

## 总结

通过这次探索，我对 OpenCode Skill 系统有了完整的理解：

1. **非侵入式设计**：Skill 只是普通工具，通过工具系统调用
2. **按需加载**：只在 AI 调用时才读取 SKILL.md 文件内容
3. **权限感知**：不同 agent 根据权限看到不同的技能列表
4. **兼容性**：支持 Claude Code 的 `.claude/skills/` 格式
5. **标准化流程**：完全通过 AI SDK 的 tool() 机制执行
6. **两层架构**：通用层处理验证+截断，各工具实现业务逻辑

最让我印象深刻的是 Skill 的"一次性指令注入"设计——它不是切换到一个特殊的"skill 模式"，而是将指令作为文本返回给 AI，让 AI 自主理解和遵循。这种设计既保持了系统的简洁性，又赋予了 AI 足够的灵活性。

如果你也在设计类似的 AI Agent 系统，OpenCode 的 Skill 系统值得作为参考案例研究。
