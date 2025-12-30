---
name: resume-optimizer
description: 优化程序员 Markdown 简历，包括改进技术描述、量化项目成果、突出技术亮点、优化技能展示。当用户说"优化简历"、"改进简历"、"重写简历"、"让简历更专业"、"提升简历质量"，或提供简历文件需要优化时使用。
---

# Resume Optimizer

优化程序员 Markdown 简历的内容质量，通过改进技术描述、量化成果、突出亮点来提升简历竞争力。

## Workflow

### 1. Read Resume
读取用户提供的简历文件或内容。

### 2. Analyze Current State
分析简历的现状：
- 识别弱化描述（缺乏量化、使用被动语态、技术栈堆砌）
- 检查项目经验的深度和说服力
- 评估技能描述的完整性
- 识别缺失的关键信息

### 3. Optimize Content
根据最佳实践优化内容：

**项目经验优化：**
- 应用 STAR 法则（Situation, Task, Action, Result）
- 添加量化指标（性能提升、用户增长、处理数据量）
- 使用强有力的技术动词（参见 action-verbs.md）
- 突出技术难点和解决方案
- 体现架构设计和技术决策能力

**技能描述优化：**
- 按技术领域分组展示（前端、后端、工程化等）
- 为核心技术添加具体特性和使用场景
- 确保与目标岗位技术栈对齐（参考 keywords.md）
- 删除过时或不相关的技术

**语言优化：**
- 替换弱动词（"负责"、"参与"）为强动词（"设计"、"实现"、"优化"）
- 确保每个项目都有量化成果
- 使用主动语态和现在完成时
- 保持描述简洁有力

### 4. Validate
检查优化后的简历：
- [ ] 每个项目都有量化数据
- [ ] 使用强有力动词开头
- [ ] 技术栈描述完整且分组清晰
- [ ] 没有语法错误
- [ ] 关键技术词与行业标准对齐
- [ ] 整体长度适中（1-2 页）

### 5. Output
输出优化后的完整 Markdown 简历。

## Key Principles

### Quantify Everything
用具体数字展示影响力：
- 性能提升："响应时间从 800ms 降至 50ms，降低 94%"
- 业务价值："日均 PV 50 万，GMV 突破 1000 万"
- 技术指标："系统可用性达 99.9%，支持 10 万+ DAU"

### Show Technical Depth
不只列举技术栈，展示如何使用和解决的问题：
- ❌ "使用 React 开发前端"
- ✅ "采用 React 18 Hooks + TypeScript 重构核心页面，首屏加载时间减少 40%，Lighthouse 性能评分从 65 提升至 92"

### Use Strong Action Verbs
避免被动和弱化动词：
- ❌ "负责、参与、协助、帮助"
- ✅ "设计、实现、优化、重构、构建、主导"

参见 references/action-verbs.md 获取完整动词库。

### Align with Target Role
确保技术栈与目标岗位匹配：
- 阅读职位描述 (JD)，提取关键技术词
- 在简历中覆盖 80% 以上的核心技术要求
- 参考 references/keywords.md 了解不同技术栈关键词

## Resources

### references/best-practices.md
详细的简历优化最佳实践，包括：
- 核心优化原则（量化成果、STAR 法则、技术深度）
- 项目经验优化策略（弱化 vs 优化示例）
- 常见问题修正
- 结构建议和检查清单

### references/action-verbs.md
技术领域强有力动词库，按类别组织：
- 开发与实现、优化与改进、分析与解决
- 架构与设计、领导与协作、测试与质量
- 创新与研究、自动化与工具、文档与传播

### references/keywords.md
不同技术栈的关键词库，涵盖：
- 前端开发（框架、语言、状态管理、构建工具、测试）
- 后端开发（Node.js 生态、其他语言框架、API 设计）
- 数据库（关系型、NoSQL、ORM、优化）
- DevOps & 云服务（容器化、CI/CD、监控）
- 架构与模式、消息队列、工程实践

### assets/template-fullstack.md
优秀的全栈工程师简历模板，展示：
- 完整的技术栈分组展示
- 量化的项目成果描述
- 技术深度和业务价值结合
- 清晰的信息层次结构

### assets/template-frontend.md
优秀的前端工程师简历模板，展示：
- 前端技术栈的详细展示
- 性能优化和工程化实践
- 具体的技术指标和成果
- 开源贡献和技术博客

## Usage Examples

**Example 1: Basic Optimization**
```
User: 帮我优化这份简历
Assistant:
[读取简历]
[分析并识别改进点]
[应用最佳实践优化内容]
[输出优化后的完整简历]
```

**Example 2: Targeted Optimization**
```
User: 我的简历缺少量化数据，帮我改进一下
Assistant:
[读取简历]
[重点为每个项目添加量化指标]
- 性能提升百分比
- 用户量、访问量
- 业务指标
[输出优化后的简历]
```

**Example 3: Tech Stack Alignment**
```
User: 我要应聘 React 高级工程师，帮我优化简历以匹配这个岗位
Assistant:
[读取简历和 JD（如有）]
[参考 keywords.md 确保 React 技术栈完整]
[突出 React 相关项目经验]
[优化技能描述，展示 React 深度]
[输出优化后的简历]
```
