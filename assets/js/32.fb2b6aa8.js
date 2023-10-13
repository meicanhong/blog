(window.webpackJsonp=window.webpackJsonp||[]).push([[32],{465:function(t,r,a){"use strict";a.r(r);var e=a(2),s=Object(e.a)({},(function(){var t=this,r=t._self._c;return r("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[r("h2",{attrs:{id:"个人信息"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#个人信息"}},[t._v("#")]),t._v(" 个人信息")]),t._v(" "),r("p",[t._v("梅灿鸿 | 男 | 本科 |")]),t._v(" "),r("p",[t._v("联系方式:")]),t._v(" "),r("p",[t._v("邮箱: canhong5357003@gmail.com")]),t._v(" "),r("p",[t._v("Github: "),r("a",{attrs:{href:"https://github.com/meicanhong",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://github.com/meicanhong"),r("OutboundLink")],1)]),t._v(" "),r("p",[t._v("Blog: "),r("a",{attrs:{href:"https://meicanhong.github.io/blog/",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://meicanhong.github.io/blog/"),r("OutboundLink")],1)]),t._v(" "),r("h2",{attrs:{id:"项目经验"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#项目经验"}},[t._v("#")]),t._v(" 项目经验")]),t._v(" "),r("h3",{attrs:{id:"footprint-analysis-2022-07-至今"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#footprint-analysis-2022-07-至今"}},[t._v("#")]),t._v(" Footprint Analysis 2022.07 - 至今")]),t._v(" "),r("h4",{attrs:{id:"项目描述"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#项目描述"}},[t._v("#")]),t._v(" 项目描述")]),t._v(" "),r("p",[t._v("Footprint Analysis 是一个用于分析区块链数据的平台，帮助用户自由探索区块链数据，从而发现其中的价值并实现区块链数据的价值化。")]),t._v(" "),r("h4",{attrs:{id:"工作内容"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#工作内容"}},[t._v("#")]),t._v(" 工作内容")]),t._v(" "),r("p",[t._v("作为架构组的成员，我的职责主要包括团队内架构设计和落地、线上服务的稳定性和可用性保障、解决技术难点和进行性能优化等事项。下面是我取得的主要成果：")]),t._v(" "),r("ol",[r("li",[t._v("参与项目架构的优化，从 BigQuery+Doris 切换到 Trino+Iceberg。通过这一优化，我们节省了从 BQ 到 Doris 的数据迁移成本，并平均提升了 3 倍的查询效率。")]),t._v(" "),r("li",[t._v("负责生产集群和查询集群的性能和稳定性优化。通过对 Trino + Iceberg 的性能优化，我们实现了集群零宕机目标，并将查询速度提升了 2～5 倍。")]),t._v(" "),r("li",[t._v("负责引入 Doris 数据库。我们利用 OLAP 引擎的特性，实现了 Restful API 的秒级查询，并将 API 的平均查询速度从 10s 降低到 0.3s。")]),t._v(" "),r("li",[t._v("开发实时指标计算系统。利用 Flink SQL 实现了实时指标计算，并提出了 Doris/Iceberg 混编的实时数据治理方案。用户可以极速查询最新的区块链数据。")])]),t._v(" "),r("h4",{attrs:{id:"亮点"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#亮点"}},[t._v("#")]),t._v(" 亮点")]),t._v(" "),r("ol",[r("li",[r("strong",[t._v("开发 Iceberg 自动化数据治理程序，提高查询效率。")]),t._v(" 我们开发了自动化程序，能够扫描表的元数据信息，通过 order/z-order 等方式将小文件进行合并，将数据整理成有序的结构进行存储。\n此外，该程序能够自动清理历史快照和过期数据，将表的元数据信息整理成 BI 报表并呈现。这一程序提高了查询效率，方便我们观测表质量并发现问题。")]),t._v(" "),r("li",[r("strong",[t._v("Trino 查询效率和稳定性优化。")]),t._v(" 我们遇到过 Trino 集群经常出现 OOM 的问题。通过阅读 Trino 源码并理解其内存管理机制，结合业务特点，我们调整了 Trino 的内存配置，保障了集群的稳定性。\n后来，我们发现有一张 Iceberg 表的 DeleteRows 过多导致 Trino Master 节点 OOM，我们分析收集到的 dump 文件并通过调整表的结构和生产方式解决了该问题。")]),t._v(" "),r("li",[r("strong",[t._v("提出 Doris/Iceberg 混合查询方案，加速用户查询。")]),t._v(" 我们的实时指标数据存储在 Iceberg 中，会产生大量的快照和碎片文件，难以对其进行治理并不利于用户查询。\n因此，我们将实时数据生产到 Doris 中，Doris 的 Compaction 机制能够有效治理流数据。于是\n我们提出了 Doris/Iceberg 混合查询的方案，实时数据放在 Doris 中，历史数据放在 Iceberg 中，对外提供视图，用户可以通过视图查询实时数据和历史数据，实现了实时数据的快速查询。")])]),t._v(" "),r("h3",{attrs:{id:"inet智能运维管理平台-2021-07-2022-05"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#inet智能运维管理平台-2021-07-2022-05"}},[t._v("#")]),t._v(" iNet智能运维管理平台 2021.07 ~ 2022.05")]),t._v(" "),r("h4",{attrs:{id:"项目描述-2"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#项目描述-2"}},[t._v("#")]),t._v(" 项目描述")]),t._v(" "),r("p",[t._v("iNet智能运维管理平台是专门为解决日渐繁杂的网络运维问题，通过对网络设备形成统一配置模型，完善配置管理接口，实现多场景部署、安全合规分析、智能运维管理等一系列复杂功能。打通IT服务流程和网络设备的需求通路，提升运维效率和安全合规性。")]),t._v(" "),r("h4",{attrs:{id:"工作内容-2"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#工作内容-2"}},[t._v("#")]),t._v(" 工作内容")]),t._v(" "),r("ol",[r("li",[t._v("参与基础网络模型的建模设计，自动分析下发路径,实现对网络设备的配置下发，包括配置下发的优化、配置下发的回滚。")]),t._v(" "),r("li",[t._v("负责 NAT 和 Load Balancer 模块的开发，并实现了对应的配置解析与配置下发模块，使得设备的配置下发更加高效和简洁。")]),t._v(" "),r("li",[t._v("设计开发 SDN 模块。我们基于SDN内的网络设备进行了拓扑构建，并实现了SDN拓扑的路径分析与配置下发，为用户提供了更加高效、智能的网络管理服务。")])]),t._v(" "),r("h4",{attrs:{id:"亮点-2"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#亮点-2"}},[t._v("#")]),t._v(" 亮点")]),t._v(" "),r("ol",[r("li",[r("strong",[t._v("实现自动分析下发路径，优化网络设备的配置下发。")]),t._v(" 我们在基础网络模型的建模设计中，对Dijkstra最短路径算法进行了修改，得到了top n条路径，并通过抽象出路由模块，判断设备间的网络是否互通，使得设备的配置下发更加高效和简洁。")]),t._v(" "),r("li",[r("strong",[t._v("事务性的配置下发，保障配置的完整性。")]),t._v(" 当我们需要打通某一条网络链路时，需要对链路上的所有设备进行配置下发，为了保障数据的完整性，我们对需要下发设备进行上锁操作，直至整个链路都下发完成后才释放锁，保证了配置下发的事务性。")])]),t._v(" "),r("h2",{attrs:{id:"专业技能"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#专业技能"}},[t._v("#")]),t._v(" 专业技能")]),t._v(" "),r("ol",[r("li",[t._v("熟悉 Java 语言，熟练对模块进行抽象和封装，并运用设计模式进行设计开发")]),t._v(" "),r("li",[t._v("熟悉 Trino、Flink、Iceberg、Doris 等大数据项目，熟悉其内部原理和实现机制，能够对其进行性能监控和优化")]),t._v(" "),r("li",[t._v("熟悉云原生技术，熟悉 Kubernetes、Docker 等容器技术，熟悉 Rancher、Grafana 等监控系统")]),t._v(" "),r("li",[t._v("熟练 SQL 语言，熟悉 SQL 的聚合操作、窗口操作、Join 操作等，熟悉 SQL 的优化")]),t._v(" "),r("li",[t._v("熟悉使用 ChatGPT，Copilot 等 AI 辅助工具，热衷写出更好的 prompt，提高工作效率")]),t._v(" "),r("li",[t._v("熟悉 Web 框架，熟悉 Spring Boot、NestJS 等 IOC 框架，熟悉 JPA 等 ORM 框架")]),t._v(" "),r("li",[t._v("了解 Python、Typescript、Go 等语言，熟悉其语法和常用库")])])])}),[],!1,null,null,null);r.default=s.exports}}]);