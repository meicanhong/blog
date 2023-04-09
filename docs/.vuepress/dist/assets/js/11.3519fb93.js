(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{426:function(t,s,a){"use strict";a.r(s);var n=a(2),e=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h2",{attrs:{id:"前言"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#前言"}},[t._v("#")]),t._v(" 前言")]),t._v(" "),s("p",[t._v("今天分享的主题是 Flink SQL 带你玩转实时数据。在开始之前，我想说一下，目前国内越来越多一线互联网公司选择使用 Flink SQL 的方式来生产实时指标，而最近团队也刚好用 Flink SQL 完成了第一批的实时银指标生产，未来会有越来越多的实时指标需要上线，到时候需要各位同学帮忙。所以今天打算通过本场分享，让各位同学掌握 Flink SQL 的基础玩法，能够使用 Flink SQL 生产实时指标。\n我先进行自我介绍，我是 Danny，New Team 的大数据架构工程师，Footprint 的大数据架构实施者。经常和团队冲锋在技术第一线，不是在坑里就是在走向坑的路上。最近刚从 Flink 这个深坑里出来，一路波折，取得真经，下面由我来传经。\n首先请各位同学思考以下问题：")]),t._v(" "),s("ul",[s("li",[t._v("什么是流？什么是批？")]),t._v(" "),s("li",[t._v("如何对流数据进行计算？")]),t._v(" "),s("li",[t._v("如何知道流数据算到哪了？")]),t._v(" "),s("li",[t._v("计算过程中程序崩溃了咋搞？")]),t._v(" "),s("li",[t._v("如何生产实时币价到 Iceberg？")])]),t._v(" "),s("h2",{attrs:{id:"认识流"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#认识流"}},[t._v("#")]),t._v(" 认识流")]),t._v(" "),s("p",[t._v("各位请先看一段 Trino SQL，请猜这段 SQL 在 Flink 上面执行会出现什么问题？（Flink 上 的token_price 是源源不断的流数据）")]),t._v(" "),s("div",{staticClass:"language-sql extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sql"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("select")]),t._v(" token_address"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("avg")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("price"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" token_price\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("where")]),t._v(" token_timestamp "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">=")]),t._v(" date_add"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'minute'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("5")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("current_timestamp")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("group")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("by")]),t._v(" token_address\n")])])]),s("p",[t._v("答案是内存会爆炸，为什么呢？\n得从流的概念讲起，我们来分析下流和批有什么不同的地方")]),t._v(" "),s("table",[s("thead",[s("tr",[s("th"),t._v(" "),s("th",[t._v("批")]),t._v(" "),s("th",[t._v("流")])])]),t._v(" "),s("tbody",[s("tr",[s("td",[t._v("数据量")]),t._v(" "),s("td",[t._v("有限")]),t._v(" "),s("td",[t._v("无限")])]),t._v(" "),s("tr",[s("td",[t._v("数据边界")]),t._v(" "),s("td",[t._v("存在边界")]),t._v(" "),s("td",[t._v("不存边界")])])])]),t._v(" "),s("p",[t._v("前面的 SQL，一直在接收最新的币价，所以 where 条件始终为 true。只要币价不中断，这段 SQL 就会一直执行（无界数据的体现）且 group by 需要在内存中记录分组信息，但流数据又是无限的，这就会把内存给撑爆，程序崩溃。程序崩溃后该怎么恢复，从头算起吗？\n总结一下，流计算的难点：")]),t._v(" "),s("ul",[s("li",[t._v("处理无限的数据")]),t._v(" "),s("li",[t._v("无线膨胀的内存")]),t._v(" "),s("li",[t._v("程序崩溃后如何恢复")])]),t._v(" "),s("h2",{attrs:{id:"如何计算流数据"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#如何计算流数据"}},[t._v("#")]),t._v(" 如何计算流数据")]),t._v(" "),s("h3",{attrs:{id:"时间窗口"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#时间窗口"}},[t._v("#")]),t._v(" 时间窗口")]),t._v(" "),s("p",[t._v('流计算的难点主要是由无限的数据和数据没有边界带来的，那有没有一个东西能将流数据变成 "有限" 和 "有边界" 的数据呢？\n那肯定是有的，Flink 带来了一个叫时间窗口的东西，他能够赋予流数据边界。\n那时间窗口是怎么做到的呢？Flink 将数据分派到符合的窗口上，时间窗口有开始时间和结束时间。例如现在有一个时间窗口是 12:00 ~ 12:05 时间段的，那么这个窗口只接收 12:00 ~ 12:05 期间内的数据。当这个时间窗口过期后，窗口内的数据会被释放掉，也就是释放掉了一些内存空间。这样一来，使用的内存得以被控制，不至于无限膨胀。\n'),s("img",{attrs:{src:"https://cdn.nlark.com/yuque/0/2023/png/21385292/1680013982749-466eac28-8c45-482b-ab26-350dfffa63c7.png#averageHue=%23f9f9f9&clientId=u7fa6a8e7-8eaf-4&from=paste&height=353&id=u85de8c9a&name=image.png&originHeight=770&originWidth=1268&originalType=binary&ratio=2&rotation=0&showTitle=false&size=113091&status=done&style=none&taskId=u23c30c08-722e-47b1-afc5-1482a405971&title=&width=582",alt:"image.png"}})]),t._v(" "),s("h3",{attrs:{id:"状态"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#状态"}},[t._v("#")]),t._v(" 状态")]),t._v(" "),s("p",[t._v("前文 SQL 中的 group by 操作会将很多分组信息放在内存中，这些中间计算结果就是 Flink 中的状态。Flink SQL 可以定期地将状态 State 存储到磁盘中，存储到磁盘中的状态叫 CheckPoint。当 Flink 程序崩溃后，只需找到磁盘中最新的 Checkpoint 即可恢复状态，这样子就可以不用从头算起。\nbtw，像 Flink SQL 写 Iceberg 的程序，一定要开启 Checkpoint，不然在 Iceberg 上是查不到写入数据的。是因为 Flink 在提交 Checkpoint 时也向 Iceberg 提交新的 Snapshot。")]),t._v(" "),s("p",[t._v("好的，了解完窗口和状态这俩个概念后，那我们如何在 Flink 里面应用呢？前文的 SQL 应该在 Flink 里面呈现呢？下面来到实战环节。")]),t._v(" "),s("h2",{attrs:{id:"实战"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#实战"}},[t._v("#")]),t._v(" 实战")]),t._v(" "),s("div",{staticClass:"language-sql extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sql"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("-- 连接 iceberg")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("CREATE")]),t._v(" CATALOG iceberg "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("WITH")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'type'")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'iceberg'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'catalog-type'")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'hive'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'uri'")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'thrift://metastore_ip:9083'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'clients'")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'5'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'property-version'")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'2'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'warehouse'")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'gs://footbase-prod/hive-warehouse'")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("-- 读取 Kafka 上的币价")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("CREATE")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("TABLE")]),t._v(" token_price_stream "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n   token_address "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("varchar")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n   "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("chain")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("varchar")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n   token_symbol "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("varchar")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n   "),s("span",{pre:!0,attrs:{class:"token identifier"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v("timestamp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("bigint")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n   token_timestamp "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" to_timestamp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("from_unixtime"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token identifier"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")]),t._v("timestamp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("`")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'yyyy-MM-dd HH:mm:ss'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n   price "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("double")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n   WATERMARK "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("FOR")]),t._v(" token_timestamp "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("AS")]),t._v(" token_timestamp "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("INTERVAL")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'5'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("SECOND")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("WITH")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n   "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'connector'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'kafka'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'topic'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'token_price'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'properties.bootstrap.servers'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'kafka_ip:9092'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'properties.group.id'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'token_price_demo'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'scan.startup.mode'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'latest-offset'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'format'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'json'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'json.fail-on-missing-field'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'false'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'json.ignore-parse-errors'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'true'")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("-- 创建 Iceberg 币价表")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("CREATE")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("TABLE")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("not")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("exists")]),t._v(" iceberg"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("beta_silver"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("token_price_demo "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n    token_address "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("varchar")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("chain")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("varchar")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    price "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("double")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("PRIMARY")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("KEY")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("chain")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" token_address"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("NOT")]),t._v(" ENFORCED\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("with")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'format-version'")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'2'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'write.format.default'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'ORC'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'write.upsert.enabled'")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'true'")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("-- 开启并设置 Checkpoint")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("SET")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'execution.checkpointing.interval'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'1min'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("SET")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'state.checkpoints.dir'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'file:///opt/flink_cp'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("-- 设置 job name")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("SET")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'pipeline.name'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'token_price_demo'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("-- 设置了一个 10s 的滚动窗口")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("insert")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("into")]),t._v(" iceberg"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("beta_silver"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("token_price_demo "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*+ OPTIONS('upsert-enabled'='true') */")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("select")]),t._v("\n    token_address"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("chain")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("avg")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("price"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("as")]),t._v(" price\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" token_price_stream\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("group")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("by")]),t._v(" token_address"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("chain")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" tumble"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("token_timestamp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("interval")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'10'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("second")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("h2",{attrs:{id:"总结"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#总结"}},[t._v("#")]),t._v(" 总结")]),t._v(" "),s("p",[t._v("回顾本次分享，我们学习了流的概念，知道了流是无限数据和无界数据流；知道了时间窗口的概念，时间窗口可以将流数据变得有界；知道了什么是状态以及Flink如何快速从崩溃中恢复。最终我们通过一场实战训练，加深了我们对流数据、窗口、状态的理解。熟悉掌握以上这些，就算是入门Flink SQL啦。感谢各位的时间，本次分享结束。")])])}),[],!1,null,null,null);s.default=e.exports}}]);