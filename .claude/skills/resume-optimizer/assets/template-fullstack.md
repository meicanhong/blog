# 张三 - 全栈工程师

**联系方式：** github.com/zhangsan | zhangsan@email.com | +86 138-xxxx-xxxx
**个人网站：** zhangsan.dev

---

## 技术栈

**前端：** React 18, TypeScript, Next.js 14, Tailwind CSS, Zustand, React Query
**后端：** Node.js, Express, Nest.js, PostgreSQL, Redis, GraphQL
**工程化：** Vite, Docker, GitHub Actions, AWS (EC2/S3/Lambda), Vercel
**其他：** Git, RESTful API, 微服务架构, 性能优化, 单元测试

---

## 工作经验

### 高级全栈工程师 | ABC 科技有限公司
**2022.06 - 至今 | 北京**

#### SaaS 协作平台 (React + Node.js)
- 设计并实现实时协作系统，支持 100+ 并发用户同时编辑，采用 WebSocket + CRDT 算法保证数据一致性
- 构建微服务架构后端，拆分 8 个核心服务，通过 Redis 分布式锁和消息队列实现服务间通信，系统可用性达 99.95%
- 优化前端性能，通过代码分割、懒加载、虚拟滚动等手段，首屏加载时间从 3.5s 降至 800ms，Lighthouse 性能评分从 62 提升至 94
- 建立 CI/CD 流水线，实现自动化测试、部署和回滚，部署频率从每周 1 次提升至每天 3 次，故障恢复时间缩短 70%
- 主导技术栈升级（React 16 → 18, Node 14 → 20），采用 Suspense、Server Components 等新特性，开发效率提升 40%

#### 企业管理后台重构项目
- 重构老旧管理系统，采用 Next.js SSR + TypeScript 替换 jQuery + PHP，代码可维护性大幅提升
- 设计组件库和设计系统，覆盖 80+ 业务组件，组件复用率达 85%，新功能开发周期缩短 50%
- 优化数据库查询，通过索引优化和 N+1 查询改写，接口响应时间从平均 1.2s 降至 150ms
- 引入 GraphQL 替代部分 REST API，客户端数据获取效率提升 60%，减少 40% 的网络请求

---

### 全栈工程师 | XYZ 互联网公司
**2020.07 - 2022.05 | 上海**

#### 电商平台核心系统
- 实现高并发秒杀系统，采用 Redis 预减库存 + 消息队列异步处理，支持 10 万+ QPS，超卖率控制在 0.01%
- 开发商品推荐引擎，基于协同过滤算法，点击率提升 35%，转化率提升 18%
- 优化支付流程，接入微信、支付宝、银联支付，支付成功率从 95% 提升至 99.2%
- 构建实时数据看板，采用 WebSocket 推送订单、用户行为数据，辅助运营决策

#### 运维监控系统
- 搭建 ELK 日志分析系统，实现日志收集、检索和可视化，故障定位时间减少 80%
- 建立服务监控告警体系，集成 Prometheus + Grafana，实现 APM 和自定义告警，平均故障响应时间从 30 分钟缩短至 5 分钟

---

## 教育背景

**计算机科学与技术 本科** | XX 大学 | 2016.09 - 2020.06

---

## 开源贡献

- **react-virtualized-list** - 高性能虚拟列表组件，2.3k+ stars，支持大数据量渲染和动态高度
- **Next.js** - 提交 2 个 PR 修复 SSR 相关 bug，已被合并至主分支
- **技术博客** - zhangsan.dev，分享全栈开发经验，累计阅读量 50 万+

---

## 个人项目

### AI 代码助手 (TypeScript + OpenAI API)
构建 VS Code 插件，集成 GPT-4 实现代码补全、重构建议和 bug 检测，安装量 5000+，评分 4.8/5.0
