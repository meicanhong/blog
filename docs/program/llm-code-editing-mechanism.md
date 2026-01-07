---
title: AI 写代码为什么不改错地方？揭秘 LLM 的代码编辑机制
date: 2026-01-07
tags:
- ai-generation
---

# AI 写代码为什么不改错地方？揭秘 LLM 的代码编辑机制

Claude Code 到底是怎么改代码的？LLM 输出的是纯文本，它怎么知道从第几行开始改？怎么定位到具体位置？要是写错了行、改错了位置怎么办？

这背后其实有一套严谨的机制。今天就来拆解 LLM 代码编辑的工作原理。

## 一、代码不是"边想边写"的

很多人以为 LLM 写代码像人类程序员一样，打一行、保存一行。实际上完全不是这样。

**LLM 写代码要经历三个阶段：**

```
用户请求 → LLM 内部生成完整代码 → 调用工具一次性写入
```

第一阶段你看不到——LLM 在内部把完整代码想好了，包括函数签名、逻辑、边界处理全部搞定。第二阶段决定用什么工具：新建文件用 `Write`，修改现有文件用 `Edit`。第三阶段才调用工具，一次性把完整的代码塞进去。

为什么不能边生成边写入？

1. **工具调用需要完整参数**：LLM 是按 token 生成内容的，但 `Write(file, content)` 这种工具调用，`content` 必须是完整的字符串，不能分几次传
2. **原子性更好**：一次性写入要么成功要么失败，不会写到一半崩了
3. **可验证性**：写完可以跑测试验证，边写边验证反而困难

实际输出流是这样的：

```
reasoning: "我需要写一个快速排序..."
text: "好的，我来帮你写"
tool-call: Write("src/sort.ts", `完整的代码，不是一部分`)
```

而不是你想的那样分多次追加——那样根本行不通。

## 二、Edit 工具如何确保改对地方？

修改现有代码时，系统用的是 `Edit` 工具：

```typescript
Edit(
  file_path: "src/app.ts",
  old_string: "function add(a, b) { return a + b }",
  new_string: "function add(a: number, b: number) { return a + b }"
)
```

工作原理：**精确字符串匹配 + 唯一性检查**。

系统会读取文件，精确搜索 `old_string`，找到唯一匹配才替换。找不到？报错。找到多个重复？也报错。

### 三层保护机制

**保护 1：找不到就报错**

```javascript
// 文件内容
function add(a, b) { return a + b }

// Edit 的 old_string
function subtract(a, b) { return a - b }  // ❌ 找不到
```

结果：直接报错 `oldString not found in content`，LLM 收到错误后会重新读取文件，找到正确的内容再试。

**保护 2：找到多个重复也报错**

```javascript
// 文件里有两个 add 函数
function add(a, b) { return a + b }
function add(x, y) { return x + y }

// Edit 的 old_string
function add(a, b) { return a + b }  // ❌ 不唯一
```

结果：报错 `oldString found multiple times`，要求 LLM 提供更多上下文来唯一标识。

**正确的做法是扩大上下文：**

```javascript
old_string = `
  // 数学工具函数
  function add(a, b) {
    return a + b
  }
  function subtract(a, b) { ... }
`
```

这样就算有多个 `add` 函数，也只有"数学工具函数"下面的那个能匹配上。

**保护 3：必须先读取文件**

Edit 工具强制要求先调用 `Read` 工具读取文件，否则直接拒绝执行。这确保了：

- LLM 知道文件的当前状态，不靠可能过时的记忆
- 使用文件的实际内容，包括精确的空格和缩进

### 大段代码替换怎么办？

替换一个 50 行的函数时，只用函数签名肯定不够。策略是用足够大的上下文块：

```javascript
// ❌ 不好：太小，可能重复
old_string: "function processUser(user) { ... }"

// ✅ 好：包含上下文，确保唯一
old_string = `
// 用户处理模块
export class UserService {
  function processUser(user) {
    // 50 行代码
  }
}
`
```

LLM 的操作流程：

1. `Read("src/api.ts")` —— 读取完整文件
2. 在内部思考："我要修改 `getUser` 函数，它在第 20-70 行，我需要包含上下文来确保唯一"
3. `Edit("src/api.ts", old_string=50行, new_string=50行)` —— 精确匹配和替换
4. 系统找到唯一匹配，替换成功

### 如果 LLM 搞错了？

```
LLM: Edit(..., old_string = "function add()", ...)

系统: ❌ "oldString not found"

LLM: 收到错误反馈
      ↓
     重新思考
      ↓
    "可能是我记错了内容"
      ↓
    再次 Read("src/app.ts")
      ↓
   看到实际内容
      ↓
   用正确的内容重试
```

系统不会悄悄改错地方，而是直接报错，让 LLM 自己修正。

## 三、关键洞察

这套机制的核心设计理念：**宁可报错也不要改错**。

| 问题               | 答案                                    |
| ------------------ | --------------------------------------- |
| 代码生成方式       | LLM 先完整生成，再一次性调用工具写入    |
| 为什么不边生成边写 | 工具需要完整参数，且原子性更好          |
| 替换准确性         | 精确字符串匹配 + 唯一性检查             |
| 大段代码替换       | 通过扩大上下文确保唯一标识              |
| 多层保护           | 1. 必须先读 2. 找不到报错 3. 重复报错   |
| 错误处理           | LLM 收到错误后重试，重新读取文件        |

## 总结

用 AI 改代码，最怕的就是"改错了地方但系统没告诉你"。这套设计通过三层保护机制——强制预读、精确匹配、唯一性检查——确保了要么改对，要么报错，绝不悄悄改错。

这种设计哲学在其他工具系统里也值得借鉴：**让错误显性化，而不是隐性传播**。宁可多一次重试，也不要把问题留到运行时才暴露。
