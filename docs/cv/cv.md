# 梅灿鸿

## 个人信息

- **性别**：男
- **年龄**：25
- **学历**：本科
- **专业**：网络工程
- **电话**：13059277414
- **邮箱**：canhong5357003@gmail.com
- **GitHub**：[github.com/meicanhong](https://github.com/meicanhong)
- **博客**：[meicanhong.github.io/blog](https://meicanhong.github.io/blog/)

## 项目经历

### MaybeAI（Agentic Workflow 平台）

**Agent工程师　2024.08 – 2025.09**

- 设计并实现自然语言生成生产级 Workflow 核心能力**从 0 到 1**：用户一句自然语言描述，系统自动完成意图解析 → 多 Agent 规划 → Tool 链编排 → 可视化 Workflow 固化，平均 **9 秒生成、21 秒首次运行**，Workflow 成功生成率超 **96%**
- 设计并实现**图形化 Workflow 编辑器**：支持节点拖拽编辑（LLM 模型、Prompt、工具参数、分支逻辑等）、实时预览与版本对比，显著提升企业用户定制与迭代效率
- 实现**"冷启动 + 固化执行"双模引擎**：首次由 LLM 完成规划，生成后自动切换为硬编码稳定执行（完全脱 LLM），仅在异常场景介入，单 Workflow 日均 token 消耗降低 **90%+**，大幅降低平台大模型成本
- 构建**长任务 Agent 上下文工程体系**（文件系统外部记忆 + 可逆压缩 + 追加式行动-观察历史 + 复述目标），支持 **50+ 步复杂任务无目标漂移**，提升跨月趋势分析与深度报告自动化稳定性
- 落地**全链路可观测与一键回放系统**（Redis + Elasticsearch checkpoint）：支持每步 reasoning chain、tool call 与 token 消耗可视化回放，异常 **30 秒告警**，故障定位时间降至 **3 分钟内**
- 研发**企业级 MCP Tool 平台**：支持 OpenAPI 3.0 接口 **8 秒自动转化**及 MCP 标准 Tool 一键收录，实现可检索/灰度/观测/审计全能力；结合 HyDE + Multi-Query + Parent Document 三路向量检索优化，已聚合 **1000+ 企业级 Tool**，日调用峰值 **10 万次**，成功率 **99.2%**
- 负责 **MCP Tool 质量提升与标准化**，构建统一 Tool Info 引擎自动生成 Tool Name/Description/Args Description 等元信息，通过标准化 Tool Info 将 Tool Selector 准确率提升至 **95%**，LLM Function Call 准确率达 **99%**
- 设计并实现基于用户浏览器侧的 **Browser Plugin（MCP Tool）**，支持 Agent 在 Workflow 中以自然语言调度用户浏览能力获取实时数据，并将 Tool Output 注入后续流程，解决登录态与权限受限场景下的数据接入问题

### Ads3（Web3 智能广告平台）

**后端工程师　2023.10 – 2024.08**

- 负责开发 Ads3 **核心活动引擎**，支持概率抽奖、人满开团、定时开奖、裂变任务等 **8+ 活动玩法**，日均 PV **10w+**，单日最高 **2000+ 同时在线活动**，支持 **1w+ 用户并发**无明显延迟
- 设计并开发**平台钱包系统从 0 到 1**，支持 TON、Solana、BNB Chain、Polygon **多链**，覆盖链上充值、提现及资金流全链路追踪，防刷钱包风控规则生效，资金准确率 **100%**，日充值提现金额峰值超 **20 万美金**
- 主导 **Telegram 生态任务系统**开发，对接 Telegram Mini App 官方 API 与 TON 链上任务，实现用户登录、每日签到、邀请裂变、链上行为验证等 **20+ 任务类型**，3 个月内帮助平台冷启动用户突破 **100w+**
- 设计并开发运营后台（React + NestJS），实现活动一键创建/编辑/上下架、资金归集与分发、实时数据大屏等功能，将运营发活动时间**从 2 小时缩短至 5 分钟**，运营效率提升超 **90%**
- 搭建完整**反作弊与风控体系**（IP/设备指纹/行为分析 + 链上地址黑名单），作弊用户识别率 **>98%**，为平台节约刷量成本超 **100 万美金**

### Footprint Analytics（链上数据分析平台）

**区块链数据基础设施工程师　2022.09 – 2023.10**

- 负责**多链统一分析引擎与查询服务**的开发与稳定性建设，面向 **40+ EVM 与非 EVM 链**，支撑日均 **10 万+ 次复杂分析查询**，作为平台核心数据底座
- 负责 Trino + Doris + Iceberg + Flink **技术栈选型与深度调优**，针对多链异构 Schema、高基数 Join 场景，将跨链复杂查询 P95 延迟**从 300s+ 优化至 10s 内**，实现准实时交互式分析体验
- 设计并实现**多链实时数据收录与增量更新 Pipeline**，日处理原始链上数据 **300GB+**，覆盖 **40+ 主流公链**（Ethereum、BSC、Solana、Sui 等），保障 **99.99%+ 数据完整性**与时效性
- 自主研发**多链地址标签与巨鲸行为分析体系**，支持高频地址评分与行为聚合，日处理关键地址 **300 万+**，相关数据能力被多家头部机构直接采购使用

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
