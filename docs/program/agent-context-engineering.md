---
title: AI Agent 上下文工程实践：从长任务崩溃到稳定运行
date: 2025-11-24
tags:
- ai-generation
---

# AI Agent 上下文工程实践：从长任务崩溃到稳定运行

在构建高性能 AI Agent 的过程中，我发现真正限制长任务成功率的，往往不是底层模型能力，而是上下文管理。经过多次框架重构和数百万真实用户会话的验证，我们在 MaybeAi 沉淀出一套高度结构化的上下文工程体系。

## 为什么上下文工程是核心竞争力

Agent 竞争不是比模型，是比整个系统。真正影响成功率的，往往是任务拆解、工具链、失败重试、上下文管理这些工程细节。更关键的是，这套"上下文工程"的实践经验不是天上掉下来的，它需要在真实任务场景里一刀一枪练出来。

我们的 Agent 平均每个会话需要 50 步工具调用，处理的任务包括多文件数据分析、跨平台内容抓取、复杂报告生成等。如果上下文管理不当，Agent 会在第 20 步左右开始"目标漂移"，或者因为上下文窗口溢出直接崩溃。

## 上下文设计的核心原则

### 文件系统是无限外部记忆

把文件系统视为 Agent 的"终极上下文"：无限大小、持久化、可直接操作。任何大块内容（网页全文、CSV 数据、PDF、长日志）绝不直接放入上下文，而是保存到文件，只保留路径和必要摘要。

```python
# 错误做法：把完整 CSV 内容放进上下文
observation = f"CSV content: {full_csv_content}"  # 可能几万行

# 正确做法：外部化存储，只保留元信息
save_file("/data/stock_data.csv", csv_content)
observation = "File saved to /data/stock_data.csv (756 rows, date range 2022-12-14 to 2025-12-14)"
```

### 可逆压缩

信息压缩后必须可恢复。我们不是丢弃信息，而是把它移到文件系统，需要时通过主动读取工具拉回。

比如处理一个 50 页的 PDF 财报：
- 上下文中只放："这是一份 50 页财报，关键点是营收增长 20%，路径：/reports/q3.pdf"
- 完整 PDF 内容存在文件里
- 后续需要时，Agent 调用 `read_file("/reports/q3.pdf")` 获取

### 注意力操纵：Recitation 机制

这是我们对抗"lost-in-the-middle"问题的核心武器。通过将最关键的信息（如当前计划和进度）强制追加到上下文最末尾，确保 LLM 的注意力机制优先看到。

核心文件是 `todo.md`：
```markdown
# 整体目标：分析 NVDA、MRVL、TSM 过去 3 年股票相关性并生成投资报告

- [x] 获取过去 3 年每日收盘价数据
- [x] 下载并保存为 CSV 文件
- [x] 清洗数据（处理缺失值、对齐日期）
- [ ] 计算 Pearson 相关系数矩阵
- [ ] 绘制相关性热力图和股价时间序列图
- [ ] 分析见解
- [ ] 评估风险
- [ ] 生成最终报告

当前进度：数据已清洗，下一步计算相关性。
全局提醒：报告需客观、专业。
```

每完成一个主要阶段（通常 3-10 步工具调用），Agent 必须更新 `todo.md`，然后系统自动将最新内容追加到上下文末尾。

## 固定的四层上下文结构

我们严格遵循以下四层顺序拼接上下文，确保可预测性和稳定性：

```
┌────────────────────────────────────────────┐
│ 1. 系统提示（固定，最前）                    │
├────────────────────────────────────────────┤
│ 2. 历史行动-观察对（从旧到新，追加式）         │
│    <action> ... </action>                    │
│    <observation> ... </observation>          │
│    <action> ... </action>                    │
│    <observation> ... </observation>          │
│    ...                                     │
├────────────────────────────────────────────┤
│ 3. 当前轮临时读取的文件内容（可选，仅本轮）     │
├────────────────────────────────────────────┤
│ 4. 关键文件 recitation（强制，最末尾）         │
│    └─ todo.md 最新完整内容（必有）            │
│    └─ 其他关键文件（如 insights.md，可选）    │
└────────────────────────────────────────────┘
```

### 第一层：系统提示

固定不变，放在最前面。包含 Agent 身份、能力描述、工具定义、核心原则。

```
You are MaybeAi, a powerful AI agent capable of browsing the web, executing code, reading/writing files, etc.
Tools available: browser_*, shell_*, read_file, write_file, ...
Key principles: Use files as external memory. Always update todo.md after each major step. Keep context lean by summarizing large content...
```

### 第二层：历史行动-观察对

追加式（append-only），从最旧到最新依次排列。每对的固定格式：

```xml
<action>
<write_file path="todo.md">
# 整体目标：分析股票相关性
- [ ] 获取数据
...
</write_file>
</action>

<observation>
File todo.md created successfully.
</observation>

<action>
<browser_navigate url="https://finance.yahoo.com" />
</action>

<observation>
Page loaded. Title: Yahoo Finance - Stock Market Live...
</observation>
```

关键点：observation 里绝不放完整大内容，只放路径 + 摘要。

### 第三层：当前轮临时读取内容

仅在本轮需要时出现。如果 Agent 上一步调用了 `read_file`、`head`、`grep` 等，工具返回的内容会直接追加在这里，作为本轮的"即时记忆"。

```xml
<action>
<read_file path="/data/stock_data.csv" />
</action>

<observation>
Date,Close
2022-12-14,178.35
2022-12-15,180.22
...
(756 rows total, showing first 100)
</observation>
```

下轮如果不再需要，这些内容不会被永久保留（除非 Agent 主动写到文件里）。

### 第四层：关键文件 Recitation

这是整个上下文结构的"杀手锏"，几乎每轮都必须有。放置位置：整个 context 的绝对末尾（最近位置），确保 LLM 的注意力机制优先看到。

```markdown
[todo.md content start]
# 整体目标：分析 NVDA、MRVL、TSM 过去 3 年股票相关性并生成投资报告

- [x] 获取过去 3 年每日收盘价数据
- [x] 下载并保存为 CSV 文件
- [x] 清洗数据
- [ ] 计算 Pearson 相关系数矩阵
...

当前进度：数据已清洗，下一步计算相关性。
[todo.md content end]
```

## 长任务中的读写流程

以"分析 NVDA、MRVL、TSM 过去三年股票价格相关性并生成投资报告"为例，展示完整的上下文演变过程。

### 任务启动（第 1 轮）

```
[系统提示]
You are MaybeAi, a powerful AI agent...

[历史行动-观察对]  // 目前为空

[用户任务]
分析 NVIDIA (NVDA)、Marvell Technology (MRVL) 和 TSMC (TSM) 过去三年股票价格的相关性，
计算 Pearson 相关系数，绘制热力图和时间序列图，最后生成一份投资报告。

[Agent 行动 1]
<write_file path="todo.md">
# 整体目标：分析 NVDA、MRVL、TSM 过去 3 年股票相关性并生成投资报告

- [ ] 获取过去 3 年每日收盘价数据
- [ ] 下载并保存为 CSV 文件
- [ ] 清洗数据
- [ ] 计算 Pearson 相关系数矩阵
- [ ] 绘制相关性热力图和股价时间序列图
- [ ] 分析见解
- [ ] 评估风险
- [ ] 生成最终报告

当前进度：刚开始。
</write_file>

[观察 1]
File todo.md created successfully.

[todo.md 最新内容 - recitation]
# 整体目标：分析 NVDA、MRVL、TSM 过去 3 年股票相关性并生成投资报告
...（完整内容）
```

此时上下文大约 3-4k tokens。

### 数据下载完成（第 8 轮）

```
[系统提示]  // 固定

[历史行动-观察对]  // 前面 7 轮的历史
<action> download NVDA CSV </action>
<observation> File saved to /data/nvda_data.csv (756 rows) </observation>

<action> download MRVL CSV </action>
<observation> File saved to /data/mrvl_data.csv (756 rows) </observation>

<action> download TSM CSV </action>
<observation> File saved to /data/tsm_data.csv (756 rows) </observation>

<action> 更新 todo.md </action>
<observation> todo.md updated </observation>

[todo.md 最新内容 - recitation]
- [x] 获取过去 3 年每日收盘价数据
- [x] 下载并保存为 CSV 文件
- [ ] 清洗数据（处理缺失值、对齐日期）
...

当前进度：数据已下载，下一步清洗。
```

此时上下文大约 15-20k tokens。注意：CSV 原始数据完全没进来，只在观察里提了一句路径。

### 数据清洗阶段（第 12 轮）

Agent 决定清洗数据，需要读取 CSV。

```
[系统提示 + 历史行动-观察对]  // 前面所有历史

[最近行动]
<read_file path="/data/nvda_data.csv" />
<read_file path="/data/mrvl_data.csv" />
<read_file path="/data/tsm_data.csv" />

[观察]
nvda_data.csv content: (返回前 100 行 + 统计摘要)
Date,Close
2022-12-14,178.35
...
(756 rows total)

[todo.md 最新内容 - recitation]
- [x] 获取...
- [x] 下载...
- [ ] 清洗数据（处理缺失值、对齐日期）   ← 当前焦点
...
```

这轮上下文临时变大（因为读了三个 CSV 片段），但下轮清洗完后，Agent 会把清洗结果保存为新文件 `cleaned_data.csv`，下次就不需要再读原始 CSV 了。

### 任务接近尾声（第 25 轮）

```
[系统提示 + 完整历史行动-观察对]  // 约 50 步历史

[最近几轮关键观察摘要]
- cleaned_data.csv saved (756 aligned rows)
- Pearson correlation matrix: NVDA-MRVL: 0.85, NVDA-TSM: 0.78
- heatmap.png saved to /images/heatmap.png
- price_chart.png saved to /images/price_chart.png
- insights.md written
- todo.md updated: all items checked except final report

[todo.md 最新内容 - recitation]
- [x] 获取过去 3 年每日收盘价数据
- [x] 下载并保存为 CSV 文件
- [x] 清洗数据
- [x] 计算 Pearson 相关系数矩阵
- [x] 绘制相关性热力图和股价时间序列图
- [x] 分析见解
- [x] 评估风险
- [ ] 生成最终报告（Markdown + 图表）

当前进度：所有分析完成，只剩合成报告。
```

最终生成报告时，Agent 会再次 `read_file` 读取 `insights.md`、图路径等必要片段，合成最终 Markdown。

## 关键文件的使用规范

### todo.md：Agent 的外部大脑

每完成一个主要阶段（通常 3-10 步工具调用）必须更新：
- 勾选已完成项
- 调整剩余任务顺序
- 重述全局目标

更新后立即 recitation 到上下文末尾。

### 其他常见文件

| 文件类型 | 用途 | 示例 |
|---------|------|------|
| 中间数据 | 存储处理结果 | `cleaned_data.csv`, `analysis_result.json` |
| 错误日志 | 保留完整错误栈 | `error_log.txt`, `logs.json` |
| 草稿笔记 | 临时思考和见解 | `insights.md`, `draft.md`, `scratchpad.txt` |
| 图像路径 | 生成的图表 | `heatmap.png`, `price_chart.png` |

这些文件按需读取，读取后内容仅用于当前或后续几轮推理。

## 四大工程模块的核心经验

### 任务拆解

**核心做法**：
- 将复杂任务拆解为 ~50 步工具调用链，每步遵循"选择行动 → 执行 → 追加观察"的循环
- 使用 `todo.md` 作为"外部大脑"，明确分解粒度（按"5 秒级操作单元"）
- 支持子代理（sub-agents）隔离子任务，共享上下文但独立窗口

**关键教训**：
- 长序列易导致"目标漂移"和"中间丢失"问题
- 通过 recitation 机制，成功率提升 20-30%，无需重训模型
- 任务粒度过粗会导致级联失败，优化后按"5 秒级操作单元"拆解

### 工具链

**核心做法**：
- 采用上下文感知状态机管理工具，不动态加载/卸载（避免 KV-cache 失效）
- 用 logit masking（解码时屏蔽 token 概率）约束选择
- 工具设计标准化：统一前缀（如 `browser_*`, `shell_*`），总工具数控制在 <20 个原子工具

**关键教训**：
- 动态工具切换在生产中常引发"schema violation"
- masking 后，工具调用稳定性达 99%
- 通过前缀分组和沙箱，减少了 80% 的工具输出噪声

### 失败重试

**核心做法**：
- 保留所有失败痕迹：行动、观察和错误日志追加到上下文中
- 自调试机制：日志流记录失败上下文，供重试时引用
- 支持"部分回滚"：失败步骤隔离重跑，而非全序列重启

**关键教训**：
- 隐藏失败是"伪优化"：早期版本清理错误导致模型重复犯错
- 保留失败后，Agent 学会"避坑"，重试效率提升
- 错误恢复率从 30% 升至 70%

### 上下文管理

**核心做法**：
- 文件系统作为"无限上下文"，保存中间结果
- 可恢复压缩：大文件外部化但留路径，确保信息不永久丢失
- 操纵注意力：通过 todo 背诵推全局计划到上下文末尾
- 确定性追加：稳定 JSON 序列化，避免时间戳变异

**关键教训**：
- 上下文膨胀是 Agent 杀手：无优化时，50 步后窗口溢出
- 文件外部化 + 压缩后，成本降 50%，支持长任务
- 上下文工程是"船而非建筑"：随模型进步迭代

## 实际效果

经过这套体系的打磨，我们在 MaybeAi 取得了以下成果：

| 指标 | 优化前 | 优化后 | 提升 |
|-----|-------|-------|------|
| 长任务成功率 | 50% | 96%+ | +92% |
| 上下文 token 消耗 | 基准 | -50% | 成本减半 |
| 错误恢复率 | 30% | 70% | +133% |
| 支持最大步数 | ~20 步 | 50+ 步 | +150% |
| 目标漂移率 | 高 | 近零 | 显著改善 |

在第三方基准测试中，自动化率和多步任务成功率位居前列。用户反馈："Agent 记性超好，不会忘中间结果"、"现在它像个可靠的助手，不会半途而废"。

## 核心洞察

回顾整个上下文工程的迭代过程，几个关键认知：

**失败不是 bug，而是 feature**。保留失败痕迹让 Agent 能够自适应学习，避免重复犯错。

**上下文不是垃圾桶，而是可塑工具**。Agent 不是死记硬背，而是像程序员一样"查文件、看笔记"。

**文件系统是最好的外部记忆**。无限大小、持久化、可直接操作，完美解决上下文窗口限制。

**Recitation 是对抗遗忘的利器**。将关键信息强制放在上下文末尾，利用 LLM 的注意力机制特性。

**工程壁垒远超模型**。当大模型能力趋于同质化，上下文工程已成为 Agent 领域最值得深耕的差异化方向。

## 总结

这套结构化、文件驱动、可逆的上下文管理体系，既是我们在生产环境中的实战结晶，也适用于任何希望构建可靠长任务 Agent 的团队。

上下文工程不是一次性设计，而是持续迭代的过程。我们经历了四次框架重构，每次都是从真实用户反馈中提炼原则。这个过程没有捷径，必须在真实任务场景里一刀一枪练出来。

未来，随着模型上下文窗口继续扩大，这套体系仍将保持价值——因为高效的记忆管理永远是智能体的核心竞争力。
