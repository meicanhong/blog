(window.webpackJsonp=window.webpackJsonp||[]).push([[25],{456:function(t,a,s){"use strict";s.r(a);var e=s(2),r=Object(e.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h2",{attrs:{id:"背景"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#背景"}},[t._v("#")]),t._v(" 背景")]),t._v(" "),a("p",[t._v("最近团队打通了 trino-doris connector，可以通过 trino 读写 doris 上的数据。为了减少数据同步工作，尝试通过 dbt-trino 读写 doris 的方式来生产指标。\n因为 trino-doris connector 没实现 doris 的建表逻辑，而 dbt 大部分模型都需要建表来实现生产。所以我尝试将 incremental 模型的中间表数据先生产在 Iceberg 上，然后 insert 到 doris 的方式来实现指标生产。\n这个过程需要实现 temp 表和目标表所在不同的 schema，而这是 dbt 没实现的功能，所以我们得修改 dbt incremental 模型的代码来实现。")]),t._v(" "),a("h2",{attrs:{id:"源码阅读"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#源码阅读"}},[t._v("#")]),t._v(" 源码阅读")]),t._v(" "),a("p",[t._v("dbt incremental model 的源码，"),a("a",{attrs:{href:"https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/include/global_project/macros/materializations/models/incremental/incremental.sql",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/include/global_project/macros/materializations/models/incremental/incremental.sql"),a("OutboundLink")],1)]),t._v(" "),a("p",[t._v("使用 chatgpt 来解释这段代码在干嘛？")]),t._v(" "),a("blockquote",[a("p",[t._v("阅读 "),a("strong",[a("a",{attrs:{href:"https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/include/global_project/macros/materializations/models/incremental/incremental.sql",target:"_blank",rel:"noopener noreferrer"}},[a("strong",[t._v("https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/include/global_project/macros/materializations/models/incremental/incremental.sql")]),a("OutboundLink")],1)]),t._v(" 代码")]),t._v(" "),a("p",[t._v("解释这段代码在干嘛？")]),t._v(" "),a("p",[t._v("GPT:")]),t._v(" "),a("p",[t._v('这段代码是一个SQL脚本，它定义了一个名为"incremental"的自定义Materialization（即一种定义了如何构建数据模型的方式），并包含以下内容：')]),t._v(" "),a("ol",[a("li",[t._v('定义了一个名为"get_current_incremental_strategy"的函数，该函数根据配置文件中指定的列来确定应该使用何种增量更新策略（如增量更新，全量更新等）。')]),t._v(" "),a("li",[t._v('定义了一个名为"perform_merge"的函数，该函数将源表（即原始数据表）和增量表（即增量更新所需的中间表）进行合并，并将结果写入到目标表中。')]),t._v(" "),a("li",[t._v('定义了一个名为"incremental"的宏，该宏使用上述两个函数来实现增量更新逻辑。具体来说，宏首先检查是否需要进行增量更新，如果需要，则调用"perform_merge"函数将增量数据合并到目标表中。如果不需要进行增量更新，则直接对源表进行全量更新。')])])]),t._v(" "),a("p",[t._v("这段代码是dbt（Data Build Tool）的一部分，它是一种流行的开源数据建模工具，用于将数据从各种来源整合到数据仓库中。通过使用自定义Materialization和宏，dbt可以自动化地执行数据转换和数据处理任务，并且支持增量更新等高级功能。")]),t._v(" "),a("blockquote",[a("p",[t._v("我们需要修改中间表 temp 表的逻辑，问 gpt 哪段代码是生成 temp 表的")]),t._v(" "),a("p",[t._v("GPT:")]),t._v(" "),a("p",[t._v('该代码定义了一个名为"get_temp_relation"的宏，该宏接受一个关系对象"relation"作为参数，并调用"default__make_temp_relation"宏来创建一个临时表。具体来说，"get_temp_relation"宏会将"relation"对象和"_temp"后缀作为参数传递给"default__make_temp_relation"宏，从而创建一个带有"_temp"后缀的临时表。')])]),t._v(" "),a("p",[a("strong",[t._v("那我们得知 default__make_temp_relation 这个宏是创建临时表的，我们重写这个宏即可实现自定义临时表的逻辑。")])]),t._v(" "),a("blockquote",[a("p",[a("strong",[t._v("我想修改 default__make_temp_relation 宏，使其接收传入参数 temp_database ，临时表所在的 schema 使用 temp_database")])])]),t._v(" "),a("p",[t._v('可以通过在"default__make_temp_relation"宏中添加一个新的参数"temp_database"来实现将临时表存储到指定的数据库中。')]),t._v(" "),a("blockquote",[a("p",[t._v('下面是修改后的"default__make_temp_relation"宏的代码：')])]),t._v(" "),a("div",{staticClass:"language-sql extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sql"}},[a("code",[t._v("{"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v(" macro default__make_temp_relation"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("base_relation"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" suffix"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" temp_database"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v("}\n    {"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("set")]),t._v(" temp_identifier "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" base_relation"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("identifier "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("~")]),t._v(" suffix "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v("}\n    {"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("set")]),t._v(" temp_relation "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" base_relation"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("incorporate"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n                                path"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("{"),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"identifier"')]),t._v(": temp_identifier}"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                                "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("database")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("temp_database"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v("}\n\n    {{ "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("temp_relation"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" }}\n{"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v(" endmacro "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v("}\n")])])]),a("h2",{attrs:{id:"结论"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#结论"}},[t._v("#")]),t._v(" 结论")]),t._v(" "),a("p",[t._v("对 gpt 给出的答案自己进行测试和细节修改后，实现了一版自定义临时表的表名和所在schema的宏。\n下面给出最终的宏和使用方法")]),t._v(" "),a("div",{staticClass:"language-sql extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sql"}},[a("code",[t._v("{"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v(" macro default__make_temp_relation"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("base_relation"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" suffix"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" temp_database"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("config"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("get"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'temp_database'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" None"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v("}\n    {"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" temp_database "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v("}\n        {"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("set")]),t._v(" temp_identifier "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'doris_'")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("~")]),t._v(" base_relation"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("identifier "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("~")]),t._v(" suffix "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v("}\n        {"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("set")]),t._v(" temp_schema "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'prod_struct'")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v("}\n    {"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("else")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v("}\n        {"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("set")]),t._v(" temp_identifier "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" base_relation"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("identifier "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("~")]),t._v(" suffix "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v("}\n        {"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("set")]),t._v(" temp_schema "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" base_relation"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("schema")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v("}\n    {"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v(" endif "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v("}\n    {"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("set")]),t._v(" temp_database "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" temp_database "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("or")]),t._v(" base_relation"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("database")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v("}\n    {"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("set")]),t._v(" temp_relation "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" api"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Relation"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("create")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("database")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("temp_database"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("schema")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("temp_schema"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      identifier"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("temp_identifier"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("type")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("base_relation"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("type")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      metadata"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("base_relation"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("metadata\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v("}\n    {{ "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("temp_relation"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" }}\n{"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v(" endmacro "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),t._v("}\n\n")])])]),a("p",[t._v("使用时需要在 config 中加上 temp_database 参数即可")]),t._v(" "),a("div",{staticClass:"language-sql extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sql"}},[a("code",[t._v("{{ config"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n    materialized "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'incremental'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    unique_key"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'chain'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'protocol_slug'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    incremental_strategy"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'append'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("database")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'doris'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    temp_database "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'iceberg'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    alias "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'protocol_info'")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("}}\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("select")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("*")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" protocol_info\n")])])]),a("p",[t._v("最终这个 dbt 模型会在 iceberg 目录下生成 temp 表，然后 insert 到 doris 上。")])])}),[],!1,null,null,null);a.default=r.exports}}]);