# Engineering Deep Dive: How MaybeAi Solves Context Drift in Long-Running Agents

在 MaybeAi，我们致力于构建能够执行复杂、长周期任务的自主 Agent。这就产生了一个业界公认的难题：**如何在长达 50 步以上的操作链中，既保持 Model 的“注意力”不漂移，又防止 Context Window（上下文窗口）被垃圾数据撑爆？**

以一个具体的金融分析任务为例——“分析 NVDA、MRVL 和 TSM 过去三年的股价相关性并生成 PDF 报告”——我们来拆解 MaybeAi 内部的上下文工程（Context Engineering）实践。

---

### The Problem: When "Chat" Isn't Enough

对于简单的问答，上下文就是为了“接话”。但对于 Agent，上下文是它的**工作记忆（Working Memory）**。

在上述股票分析任务中，Agent 需要经历以下阶段：
1. **规划**：拆解任务。
2. **采集**：浏览网页，下载 3 个股票的 CSV（每个数千行）。
3. **清洗**：运行 Python 代码处理缺失值。
4. **分析**：计算 Pearson 系数，绘制热力图。
5. **报告**：综合所有信息写入 Markdown/PDF。

如果我们将所有网页 HTML、CSV 原始数据、Python 运行日志全部塞入 Context，任何现有的 LLM 都会在第 10 步左右崩溃——要么 Token 溢出，要么因干扰信息太多而出现幻觉（Lost-in-the-middle 现象）。

### Our Solution: Specific Context Structure

经过多次迭代，MaybeAi 确立了一套严格的 **Context 构造协议**。我们在每一次 Loop（推理轮次）中发送给 LLM 的 Prompt，并不只是简单的“对话历史”，而是一个精心分层的结构体。

#### The Anatomy of a MaybeAi Context

每一轮推理的 Context 严格遵循以下顺序：

```text
┌──────────────────────────────────────────────┐
│ 1. System Prompt (The Constitution)          │
│    - 身份定义、工具协议、原则                 │
├──────────────────────────────────────────────┤
│ 2. Action-Observation History (The Append-Log)│
│    - 历史压缩层                              │
│    - <action> ... </action>                  │
│    - <observation> ... </observation>        │
├──────────────────────────────────────────────┤
│ 3. On-Demand Read Buffer (Transient Memory)  │
│    - 仅当前轮次需要的数据片段                 │
├──────────────────────────────────────────────┤
│ 4. State Recitation (The Anchor)             │
│    - 强制复述层：todo.md (核心！)             │
└──────────────────────────────────────────────┤
   ↓ New Token Generation Starts Here
```

让我们逐层拆解这个设计的精妙之处。

---

### Layer 1: System Prompt (不变的基石)

这是 Agent 的出厂设置。除了常规的“你是一个有用的助手”，我们在 MaybeAi 更强调**操作原则**：
*   **File-First Principle**：永远不要把大数据打印到控制台，必须写入文件。
*   **State Awareness**：每完成一个大步骤，必须更新 `todo.md`。

---

### Layer 2: Action-Observation History (外部化与压缩)

这是最容易爆炸的部分。我们的策略是：**Data goes to Disk, Meta-data goes to Context.**

当 Agent 下载了一个 2MB 的 CSV 文件时：
*   **错误做法**：把 CSV 内容直接放入 `<observation>`。
*   **MaybeAi 做法**：
    Agent 收到观察：`File saved to /data/nvda_data.csv (756 rows, date range 2022-12-14 to 2025-12-14).`

在这个阶段，Context 记录的是**“我拥有了这个文件”**的事实，而不是文件内容。通过这种“指针”方式，50 步的操作历史也仅占用几万 Tokens。

---

### Layer 3: On-Demand Read Buffer (瞬时记忆)

Agent 何时看数据？只有在它主动调用 `read_file` 时。

比如在第 12 步，Agent 需要写代码清洗数据。它决定先看一眼数据结构：
*   Action: `read_file(path="/data/nvda_data.csv", head=5)`
*   这一轮的 Context 会临时插入这 5 行数据。
*   **关键点**：一旦 Agent 完成了代码编写并执行（生成了清洗后的文件），这部分“读取的内容”在后续轮次中就可以被压缩或丢弃，因为它们已经转化为新的文件实体。

---

### Layer 4: State Recitation (防漂移的杀手锏)

这是 MaybeAi 能够稳定运行长任务的核心秘密。我们在 Context 的**最末尾（Last Tokens）**，强制拼接一个特殊文件：`todo.md`。

无论历史有多长，LLM 在生成下一个 Token 前，看到的最后一段话永远是当前的**作战地图**。

#### 真实案例还原：第 25 轮推理时的 Context 末尾

```markdown
... [History of 24 steps] ...

[todo.md Content - Auto Appended]
# 目标：NVDA/MRVL/TSM 投资报告

- [x] 下载 CSV (已存入 /data/)
- [x] Python 清洗数据 (已存入 /data/cleaned.csv)
- [x] 计算 Pearson 矩阵 (NVDA-MRVL 相关性 0.85)
- [x] 绘图 (已存入 /images/heatmap.png)
- [ ] **撰写投资见解 (Current Focus)**
- [ ] 生成 PDF

当前状态：图表已就绪，正在分析数据关联性以撰写见解。
```

通过这种 **Recitation（复述）机制**，我们利用了 Attention 机制对末尾 token 的高权重，强行将 Agent 的注意力拉回到当前未完成的任务上。这有效解决了 LLM 在长对话中“忘了我本来要干嘛”的问题。

---

### The Result: A "Sane" Agent

通过这套架构，我们观察到 MaybeAi 的 Agent 表现出了一种类似人类工程师的行为模式：
1.  **它很爱写笔记**：因为它知道写进文件比记在脑子（Context）里更靠谱。
2.  **它节奏感强**：每一步都在划掉 `todo.md` 的一项，这种自我反馈强化了任务完成率。
3.  **它极其稳定**：即使在第 45 步出错（例如 LaTeX 编译失败），由于 `todo.md` 明确记录了前 44 步的成果（文件都在），它可以从容地由错误处重试，而不是从头开始。

在 AI Agent 领域，**Memory isn't just storage; it's structure.** 通过将文件系统作为长期记忆，将 Context 限制为“控制流”和“元数据”，MaybeAi 成功让 LLM 具备了处理复杂现实世界任务的能力。