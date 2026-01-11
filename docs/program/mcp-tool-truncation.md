---
title: MCP Tool Proxy - 我如何在代理层解决上下文爆炸问题
date: 2025-11-27
---

# MCP Tool Proxy - 我如何在代理层解决上下文爆炸问题

我在做一个 multi-agent 系统（这比我想象的要难得多）。其中一个 agent 会调用 MCP 工具，然后问题来了。

## 问题：Tool Call Result 是个黑盒

MCP (Model Context Protocol) 工具的输出大小是**完全不固定**的。

有时候很正常：
```json
// 调用天气 API
{
  "temp": 25,
  "condition": "sunny"
}
// 几十个字节，没问题
```

但有时候...灾难来了：

```bash
# Agent 调用 bash 工具列出所有文件
find . -type f
# 返回 5000 行文件名 = ~200KB

# Agent 读取一个日志文件
cat /var/log/app.log
# 返回 10MB 日志 = ~2.5M tokens

# Agent 安装依赖
npm install
# 返回 10,000 行安装日志 = ~500KB
```

**两个致命问题：**

1. **爆上下文**：2.5M tokens 直接超过模型限制（请求失败）
2. **污染 context**：即使没爆，塞进 10MB 的垃圾数据（后续推理都变慢了）

我一开始不知道怎么办（这种感觉就像你精心准备的晚餐被狗吃了）。

## 天真的方案（我试过，都失败了）

### 方案 1：在 agent 端限制

```typescript
// Agent 收到结果后截断
async function callTool(tool, args) {
  const result = await mcpClient.call(tool, args)
  return result.slice(0, 10000)  // 只保留前 10K 字符
}
```

**问题**：agent 永远不知道是不是完整数据（可能关键信息在后面被截断了）。

### 方案 2：在 MCP server 端限制

```typescript
// MCP server 返回时截断
server.on("tool:result", (result) => {
  if (result.size > THRESHOLD) {
    return truncate(result)  // 直接截断
  }
})
```

**问题**：每个 MCP server 都要改（不现实，而且你控制不了第三方的 server）。

### 方案 3：让 agent 自己处理

```typescript
// Agent 调用前预估大小
if (estimatedSize(args) > THRESHOLD) {
  return usePagination(args)  // 分页获取
}
```

**问题**：预估大小很难（你不知道 `find` 会返回多少文件）。

## 正确方案：MCP Tool Proxy（代理层拦截）

我意识到需要一个**中间层**（就像 nginx 之于 web 服务器）：

```
Agent ←→ MCP Tool Proxy ←→ MCP Servers
           (拦截 + 截断)
```

**核心思想：**

1. Proxy 拦截所有 tool call result（在返回给 agent 之前）
2. 判断大小（按 tokens 计算，不只是字节）
3. 超过阈值 → 返回预览 + 保存完整数据
4. Agent 需要时 → 通过 sandbox MCP 获取

让我给你看代码（这花了我一周时间才想明白）。

## Step 1: Proxy 架构（拦截层）

```typescript
// mcp-proxy/src/truncation.ts
import { tokenize } from "gpt-tokenizer"  // 计算 token 数量

interface ProxyConfig {
  maxTokens?: number      // 默认: 10000 tokens
  storageDir?: string     // 完整数据保存路径
}

interface TruncatedResult {
  content: string          // 预览内容
  truncated: boolean       // 是否被截断
  metadata?: {
    fullSize: number       // 完整大小（tokens）
    previewSize: number    // 预览大小（tokens）
    storageKey: string     // 完整数据的 key
  }
}

// Proxy 核心拦截逻辑
async function interceptToolResult(
  result: string,
  config: ProxyConfig = {}
): Promise<TruncatedResult> {

  const maxTokens = config.maxTokens ?? 10000
  const storage = new ResultStorage(config.storageDir)

  // 1. 计算 token 数量（不是字符数！）
  const fullTokens = tokenize(result).length

  // 2. 快速路径：小输出直接返回
  if (fullTokens <= maxTokens) {
    return { content: result, truncated: false }
  }

  // 3. 慢路径：截断 + 保存
  const previewContent = truncateToTokens(result, maxTokens)
  const storageKey = await storage.save(result)  // 保存完整数据

  // 4. 返回元数据（agent 用这个来决定是否需要完整数据）
  return {
    content: previewContent,
    truncated: true,
    metadata: {
      fullSize: fullTokens,
      previewSize: maxTokens,
      storageKey,
      retrievalHint: `输出已截断 (${formatNumber(fullTokens)} tokens → ${formatNumber(maxTokens)} tokens)\n完整数据已保存至: ${storageKey}\n\n使用以下方式获取完整数据:\n1. 通过 bash: cat /mnt/data/${storageKey}\n2. 通过 sandbox 写代码过滤数据`
    }
  }
}
```

看到了吗？关键点：

1. **按 token 计算**（不是字节，因为模型按 token 计费）
2. **快速路径**（小输出零开销）
3. **元数据返回**（agent 知道有更多数据可用）

## Step 2: Token 级截断（核心算法）

```typescript
// mcp-proxy/src/truncation.ts
import { tokenize } from "gpt-tokenizer"

function truncateToTokens(text: string, maxTokens: number): string {
  const tokens = tokenize(text)

  // 快速路径：不需要截断
  if (tokens.length <= maxTokens) {
    return text
  }

  // 截断到 maxTokens（保留前 N 个 tokens）
  const truncatedTokens = tokens.slice(0, maxTokens)

  // 这里的技巧：tokens → 文本不是简单的 slice
  // 我们需要找到最后一个完整的 token 边界
  const previewText = detokenize(truncatedTokens)

  // 计算实际截断了多少
  const removed = tokens.length - maxTokens
  const percentage = ((removed / tokens.length) * 100).toFixed(1)

  // 构建提示信息
  const hint = `\n\n... ${formatNumber(removed)} tokens 被截断 (${percentage}%)\n使用 storageKey 获取完整数据`

  return previewText + hint
}
```

**为什么要按 token 截断？**

```typescript
// 字符截断的问题
"你好世界" = 4 字符, 但可能是 6-8 tokens（中文字符编码效率低）

// Token 截断的优势
"Hello world" = 3 tokens, 3 字符（英文效率高）
"你好世界" = 8 tokens, 4 字符（中文效率低）

// 如果用字符截断，可能切到半个 token（解码失败）
```

## Step 3: Proxy 如何集成到 MCP 调用链

```typescript
// mcp-proxy/src/index.ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js"

class MCPToolProxy {
  private upstreamClient: Client  // 真正的 MCP server
  private config: ProxyConfig

  constructor(upstreamClient: Client, config: ProxyConfig = {}) {
    this.upstreamClient = upstreamClient
    this.config = config
  }

  // 拦截 tool call
  async callTool(toolName: string, args: any): Promise<any> {
    // 1. 调用上游 MCP server
    const rawResult = await this.upstreamClient.callTool({
      name: toolName,
      arguments: args
    })

    // 2. 提取文本内容
    const textContent = this.extractText(rawResult)

    // 3. 拦截 + 截断（这就是 magic 发生的地方）
    const processed = await interceptToolResult(
      textContent,
      this.config
    )

    // 4. 返回处理后的结果给 agent
    return {
      ...rawResult,
      content: [{ type: "text", text: processed.content }],
      _metadata: {  // 隐藏字段，agent 可以访问
        truncated: processed.truncated,
        fullSize: processed.metadata?.fullSize,
        storageKey: processed.metadata?.storageKey
      }
    }
  }

  private extractText(result: any): string {
    // MCP result 格式: { content: [{ type: "text", text: "..." }] }
    return result.content
      .filter((c: any) => c.type === "text")
      .map((c: any) => c.text)
      .join("\n")
  }
}
```

**这就是整个代理层的核心**（只有 ~30 行有效代码）。

## Step 4: Agent 如何获取完整数据（Sandbox MCP）

这里有个关键设计决策：**我给 agent 提供了一个 sandbox MCP**（包含 bash 工具）。

```typescript
// agent 收到截断后的结果
const toolResult = await mcpProxy.callTool("bash", {
  command: "find . -type f"
})

// 结果（被截断了）:
// file1.ts
// file2.ts
// ...
// file1999.ts
// file2000.ts
//
// ... 50000 tokens 被截断 (83.3%)
// 使用 storageKey 获取完整数据
//
// _metadata: {
//   truncated: true,
//   fullSize: 60000,
//   storageKey: "tool_result_abc123"
// }

// Agent 决定需要完整数据
const fullData = await sandbox.callTool("bash", {
  command: `cat /mnt/data/tool_result_abc123`
})

// 或者 Agent 只需要过滤后的数据
const filtered = await sandbox.callTool("bash", {
  command: `cat /mnt/data/tool_result_abc123 | grep '\\.ts$' | wc -l`
})
```

**为什么用 sandbox？**

1. **隔离性**：完整数据不污染 agent 上下文（只在 sandbox 里处理）
2. **灵活性**：agent 可以写任意 bash 命令过滤数据（`grep`、`awk`、`sed`）
3. **可组合**：多个 agent 可以同时访问同一个 storageKey（无需重复获取）

## Step 5: 存储层（完整数据去哪了？）

```typescript
// mcp-proxy/src/storage.ts
import fs from "fs/promises"
import crypto from "crypto"

class ResultStorage {
  private dir: string

  constructor(dir: string = "/mnt/data/mcp-proxy") {
    this.dir = dir
  }

  async save(content: string): Promise<string> {
    // 确保目录存在
    await fs.mkdir(this.dir, { recursive: true })

    // 生成唯一 ID（用 hash 避免重复存储）
    const hash = crypto.createHash("sha256")
      .update(content)
      .digest("hex")
      .slice(0, 12)

    const filename = `tool_${Date.now()}_${hash}.txt`
    const filepath = `${this.dir}/${filename}`

    // 写入完整数据
    await fs.writeFile(filepath, content, "utf-8")

    // 返回 storage key（agent 用这个来获取）
    return filename
  }

  async get(key: string): Promise<string | null> {
    try {
      const filepath = `${this.dir}/${key}`
      return await fs.readFile(filepath, "utf-8")
    } catch {
      return null  // 文件可能过期被删了
    }
  }

  // 清理过期文件（保留 24 小时）
  async cleanup(maxAge: number = 24 * 60 * 60 * 1000) {
    const files = await fs.readdir(this.dir)
    const now = Date.now()

    for (const file of files) {
      const filepath = `${this.dir}/${file}`
      const stat = await fs.stat(filepath)
      const age = now - stat.mtimeMs

      if (age > maxAge) {
        await fs.unlink(filepath)  // 删除过期文件
      }
    }
  }
}
```

**存储策略：**

1. **用 hash 做去重**（相同内容只存一次）
2. **短过期时间**（24 小时，够 agent 处理完了）
3. **简单文件系统**（不需要 Redis，本地文件足够了）

## 完整流程（从 agent 视角）

```typescript
// ============================================
// Step 1: Agent 调用 MCP 工具（通过 proxy）
// ============================================
const result = await mcpProxy.callTool("bash", {
  command: "find . -type f"
})

// ============================================
// Step 2: Agent 收到截断后的结果
// ============================================
console.log(result.content)
// file1.ts
// file2.ts
// ...
// file2000.ts
//
// ... 50000 tokens 被截断 (83.3%)
// 使用 storageKey 获取完整数据
//
// _metadata: {
//   truncated: true,
//   fullSize: 60000,
//   storageKey: "tool_1234567890_abc123def456.txt"
// }

// ============================================
// Step 3: Agent 分析预览，决定是否需要完整数据
// ============================================
if (result._metadata.truncated) {
  // 看了前 2000 个文件，agent 发现：这是个大项目
  // 需要统计所有 .ts 文件数量

  const countResult = await sandbox.callTool("bash", {
    command: `cat /mnt/data/${result._metadata.storageKey} | grep '\\.ts$' | wc -l`
  })

  console.log(countResult.content)  // 3421（全部 .ts 文件）
  // 注意：这个结果很小，不会被截断
}

// ============================================
// Step 4: 如果真的需要完整数据（罕见情况）
// ============================================
if (agentDecidesNeedsFullData) {
  const fullResult = await sandbox.callTool("bash", {
    command: `cat /mnt/data/${result._metadata.storageKey}`
  })

  // 但即使这样，完整数据也只在 sandbox 里
  // 不会污染主 agent 的上下文
}
```

## 为什么这个设计有效（直觉）

把它想象成**数据库的分页查询**：

```
SELECT * FROM users;  -- 返回 100 万行（太慢）

-- 改成这样：
SELECT * FROM users LIMIT 100;  -- 返回前 100 行（够用了）
-- 需要更多？用 OFFSET 分批获取
```

**MCP Tool Proxy 做的就是同样的事情：**

1. **LIMIT 10000 tokens**（预览）
2. **告诉 agent 还有更多**（metadata）
3. **按需获取完整数据**（通过 sandbox）

**关键差异：**

| 方案 | 问题 |
|------|------|
| 直接返回完整数据 | 爆上下文 + 污染 context |
| 直接截断 | Agent 不知道有更多数据 |
| **Proxy + Sandbox** | **两全其美** |

## 实际部署（我是怎么集成的）

```typescript
// agent-system/src/mcp-proxy.ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { MCPToolProxy } from "./mcp-proxy/truncation.js"
import { SandboxMCP } from "./sandbox/index.js"

// 1. 创建真正的 MCP client（连接到 server）
const upstreamClient = new Client({
  name: "my-agent",
  version: "1.0.0"
})

await upstreamClient.connect(transport)

// 2. 用 proxy 包装（拦截所有调用）
const mcpProxy = new MCPToolProxy(upstreamClient, {
  maxTokens: 10000,           // 截断阈值
  storageDir: "/mnt/data/mcp"
})

// 3. 创建 sandbox MCP（agent 用这个获取完整数据）
const sandbox = new SandboxMCP({
  mountPath: "/mnt/data"
})

// 4. agent 使用 proxy（而不是直接用 upstreamClient）
const agent = new Agent({
  tools: {
    mcp: mcpProxy,      // 所有 MCP 调用都走 proxy
    sandbox: sandbox    // sandbox 用于获取完整数据
  }
})

// 5. 启动清理任务（每小时清理过期文件）
setInterval(() => {
  mcpProxy.cleanup()
}, 60 * 60 * 1000)
```

## 常见陷阱（我踩过的坑）

### 陷阱 1：按字符而不是 token 截断

```typescript
// 错误方式
const truncated = text.slice(0, 10000)  // 10K 字符

// 问题：
// "你好你好你好..." = 10000 字符 = ~15000 tokens（超过限制了！）
```

**修复**：用 `gpt-tokenizer` 计算真实 token 数。

### 陷阱 2：截断后不告诉 agent

```typescript
// 错误方式
return { content: truncatedText }  // agent 以为这就是全部

// 问题：agent 不知道有更多数据，做出错误决策
```

**修复**：总是返回 metadata（`truncated`, `storageKey`）。

### 陷阱 3：永久保存文件

```typescript
// 错误方式
const filename = `tool_${random()}.txt`
await fs.writeFile(filename, data)  // 永不删除

// 问题：磁盘被填满（我遇到过 2GB 的 /mnt/data）
```

**修复**：定时清理过期文件（24 小时足够了）。

### 陷阱 4：storageKey 暴露给 agent 上下文

```typescript
// 错误方式
return {
  content: `完整数据: /mnt/data/${key}`,  // 文件路径进入上下文
  metadata: { storageKey: key }
}

// 问题：agent 引用这个路径，路径进入上下文（浪费）
```

**修复**：storageKey 只在 `_metadata` 里（需要时才用）。

## 性能测试（实际数据）

我测试了几种场景（用真实 MCP 工具）：

| 工具调用 | 完整输出 | Token 截断 (10K) | 节省 |
|---------|---------|-----------------|------|
| `find . -type f` (5K files) | 60K tokens | 10K tokens | 83% |
| `cat large.log` (50MB) | 12M tokens | 10K tokens | 99.9% |
| `npm install` | 25K tokens | 10K tokens | 60% |
| `git log` (1K commits) | 15K tokens | 10K tokens | 33% |

**关键观察：**

1. **大多数时候不需要完整数据**（预览足够）
2. **需要时才获取**（按需加载）
3. **token 节省显著**（平均 70%+）

## 总结

MCP Tool Proxy 解决了一个核心问题：**如何让 agent 在不爆上下文的情况下访问任意大的工具输出**。

**设计原则：**

1. **Proxy 拦截**（在代理层统一处理，无需改每个 MCP server）
2. **Token 级截断**（按模型计费单位计算，不是字符）
3. **元数据返回**（agent 知道有更多数据可用）
4. **Sandbox 获取**（完整数据不污染 agent 上下文）
5. **短过期时间**（24 小时后自动清理）

这个模式让我想到 **CDN 的边缘缓存**（预览）+ **源站拉取**（完整数据）。agent 系统也可以借鉴这些成熟的架构模式。

现在去实现你的 MCP Tool Proxy（你的上下文窗口会感谢你的）。

---

**P.S.** 我一开始想把这个逻辑放在 agent 里（而不是 proxy）。但那样每个 agent 都要实现一遍（很蠢）。Proxy 层是唯一正确的地方（所有 agent 自动受益）。

**P.P.S.** 10K tokens 阈值不是魔法数字。我试过 1K（太小，agent 老要更多）和 100K（太大，还是会爆）。10K 似乎是个好平衡（足够预览，又不会爆）。根据你的模型和用例调整。
