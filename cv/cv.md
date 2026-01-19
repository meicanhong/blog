---
title: 简历
---
# 梅灿鸿

## 个人信息

- **性别**：男
- **年龄**：25
- **学历**：本科
- **专业**：网络工程
- **电话**：13059277414
- **邮箱**：canhong5357003@gmail.com
- **GitHub**：[github.com/meicanhong](https://github.com/meicanhong)
- **博客**：[meicanhong.github.io](https://meicanhong.github.io)

## 项目经历

### MaybeAI（Agentic 平台）

**Agent工程师　2025.03 – 2025.09**


- 负责后端的对话功能，agent/workflow 配置管理，mutil-trigger,版本快照，用户管理，runtime 数据持久化，定时任务，日志监控等基础功能
- 设计并实现 AI Agent 的 Human-in-the-Loop 工作流，实现实时人工干预、反馈驱动模型优化及高风险任务审计。
- 设计Domain Knowledge 注入机制（类似现在的 Claude Skills），domain knowledge 被设计为标准 MCP Tool 格式，agents 在初始化阶段会去动态扫描 domain tool，自行决定是否使用，若使用则会将 domain knowledge 注入到全局 prompt 中，后续 runtime 会依照 domain knowledge 行动。
- 研发企业级 MCP Marketplace 平台，可以一键收录外部符合 Openapi/MCP 格式的服务，转换为标准的 MCP 格式并部署到 k8s 集群中，部署上线后 agent 即可discover这些 tool 并准确使用；对于需要 api key 的 mcp servers，平台可在 tool 运行前问用户索要 api key，或者使用平台提供好的 api key。
- 实现 Tool Indexing 模块，利用 LLM 与原始 Tool Info，去重新生成更好的 Tool Info，例如统一的 Tool Name/ Description/ args description 等元数据，还会生成多条这个 tool 的使用场景，什么时候使用，什么时候不该使用，最终把这些数据信息 embedding 进 qdrant 中，等待 tool selector 模块使用。
- 实现 Tool Selector 模块，运用 Mutil-Query + Parent Doucment 三路 RAG 向量检索, 能根据用户意图从 1000+ Tools 中挑选合适的 Tool 来满足用户意图，从 Qdrant 中匹配出来的 tools 会经过一轮 llm rerank(根据 tool calls count/ tool score 等)，最终匹配最合适的 Tool 返回给 agent 使用。
- 设计并实现 Browser Crawler Plugin，Agent 以 MCP 标准来调用这个 Plugin，Plugin 内置了主流平台的爬虫模板(etc: X、Reddit、小红书), 这些爬虫模块以 MCP Tool 格式呈现给 Agent，若没匹配到合适的爬虫模板，Agent 可以按 browser-use 方式通过 plugin 操作浏览器, 去获取目标数据
- 设计并实现 Google Sheet MCP，支持 Sheet 基础数据操作，DataFrame/SQL-like 分析、公式注入与图表生成，并通过 dry_run + diff + commit 机制保障 AI 自动化操作的安全可控。

### KOL.AI (X 社媒内容创作平台)

**全栈工程师　2024.08 - 2025.03**

- 基于 AutoGen 框架设计并实现 Mutil Agent 写作系统，支持 Agent 的创建、编辑、复制、删除及历史版本回溯；提供 14+ 工具插件（互联网搜索、图片生成、新闻抓取等）与多模型配置，实现 Agent 配置的可视化低代码管理
- 设计并实现 X AI 写作引擎，用户可设置人设，写作风格，受众群体等信息，支持一键复制 X KOL 生成专属的配置信息，自动搜索今日热门话题去生成个性化推文
- 设计并实现 写作灵感引擎，用户可设置监听多个 X KOL和新闻数据源，系统会自动分析，生成每日推文建议
- 设计并实现 RLHF 反馈引擎，可针对 AI 生成的推文进行意见反馈，系统会收集保存反馈，
- 设计并实现 AI 任务执行日志可视化系统，支持实时查看 Agent 每步执行明细与生成的中间内容；追踪模型调用、Token 消耗、执行耗时等关键指标，并提供 Agent 配置快照，实现 AI 生成过程的全链路可追溯与高效调试
- 设计并实现 Twitter 账号全生命周期管理系统，覆盖账号管理、AI 驱动内容生成、定时发布、自动评论、自动关注、安全风控，支持多账号批量运营与任务状态实时监控
- 设计并实现多源热点数据爬取系统，每日定时抓取 X 热门话题、Google Trends、Medium 热门文章等多平台数据，通过统一数据清洗与聚合管道为 AI 内容创作提供实时灵感素材


### Ads3（Web3 智能广告平台）

**后端工程师　2023.10 – 2024.08**

- 设计并实现**核心活动引擎与任务系统**，构建统一事件驱动架构支持概率抽奖、拼团、定时开奖、裂变任务、俄罗斯转盘等 **8+ 活动玩法**；实现 Telegram 群验证、发言检测、邀请链追踪、链上行为验证等 **20+ 任务类型**，支撑平台 **3 个月从 0 增长至 100 万用户**，日活峰值 **15 万+**
- 设计并实现**跨链钱包充值提现系统**，构建统一抽象层支持 TON 与 **10+ 主流 EVM 链**（Ethereum、BSC、Polygon 等）；通过链上事件监听 + 区块确认机制实现自动到账，充提时效 **< 3 分钟**，交易成功率 **99.8%**
- 设计并实现 **AI 智能客服 SaaS 平台**，基于 RAG + LLM 构建多租户 Telegram Bot 系统，支持品牌方上传项目知识库、自定义回复风格与话术模板、可视化配置工具开关（联网搜索、实时新闻等）；通过向量检索 + 上下文记忆实现精准问答，并提供 Q&A 测试集验证知识库质量
- 设计并实现 **AI 智能风控审核系统**，基于用户行为图谱分析与资金流水模式识别，构建多维度异常检测模型；自动识别羊毛党团伙的异常提现行为，并及时告警通知运维人员
- 设计并实现运营后台（React + NestJS），实现活动一键创建/编辑/上下架、资金归集与分发、实时数据大屏等功能，将运营发活动时间**从 2 小时缩短至 5 分钟**，运营效率提升超 **90%**

### Footprint Analytics（链上数据分析平台）

**区块链数据基础设施工程师　2022.09 – 2023.10**

- 负责大数据基础设施架构升级与性能优化，推动**2 次架构迭代**，最终构建 **Trino + Iceberg + Doris + Flink** 技术栈，支撑日均 **10 万+ 次** 跨链复杂分析查询；将查询时延 P95 **从 3 分钟优化至 10 秒内**，内部生产任务执行成功率提升至 **99%**，云服务成本降低 **50%**
- 独立构建多链底层数据收录系统，实时收录 **40+ EVM 与非 EVM 链** 原始数据（Transactions、Logs、Blocks、Traces、Token Transfers），日处理 **300GB+** 链上数据，数据完整性及准确率达 99.99%。该系统已成功商业化，为多家头部 Web3 机构提供底层数据源支持。
- 为全球知名 GameFi 投资机构设计并交付实时分析系统，覆盖 DAU、NFT 铸造量等 15+ 核心指标；通过优化 Flink 流计算与向量化查询，实现秒级刷新（延迟 < 5s），支撑客户实时运营决策，并为公司带来数百万量级的年度商业价值。
- 主导大数据基础设施跨云迁移（GCP → 腾讯云），将 300TB+ 数据从 GCS 至 EMR HDFS 的零停机迁移。通过开发按分区并行同步、重构 Shuffle 逻辑、碎片文件合并等工具，将迁移效率提升 85%，实现每月 10 万美金级成本节省，保障数据 100% 完整性。
- 设计并实现覆盖 5,000+ 币种的高质量价格系统，时效性 < 5 分钟，准确率达金融级标准（99.99%）；该系统作为平台核心数据产品，广泛应用于行业头部 API 服务场景。
- 自然语言转 SQL（NL2SQL）系统：自主研发 NL2SQL 智能查询系统，支持用户通过自然语言生成复杂分析 SQL 并自动构建看板；系统 SQL 生成准确率达 90%，大幅降低了非技术用户的使用门槛，成为平台核心技术壁垒。

## 公司经历

**广州悦谦科技有限公司**　2022.07 – 2025.09　软件工程师

## 教育背景

**东莞理工学院**　网络工程　本科　2018.09 – 2022.06

## 专业技能

- **编程语言**：Python、Typescript、Java
- **大模型 & Agent**：Multi-Agent、Tool Calling、ReAct、RAG、Context Engineering、Prompt Engineering
- **大数据 & 基础设施**：Trino、Doris、Iceberg、Flink、Redis、Elasticsearch、MongoDB、MySQL、PostgreSQL
- **区块链**：EVM/非EVM 全链数据管道、智能合约交互、钱包系统
- **运维**：Linux、Docker、Kubernetes、Tencent Cloud/GCP

## 个人评价

- 拥有 3 年以上大语言模型（LLM）实战经验，熟悉 Vibe Coding，日常习惯使用 AI 自动化重复性任务与辅助脑力工作
- 热衷技术创新，对新兴工具和前沿技术保持强烈好奇心和学习热情
- 自驱力强，注重代码质量与产品体验，在 AI 时代追求高标准和良好品味
