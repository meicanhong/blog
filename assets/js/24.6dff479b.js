(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{454:function(t,s,a){"use strict";a.r(s);var r=a(2),n=Object(r.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h2",{attrs:{id:"理解-trino-内存管理"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#理解-trino-内存管理"}},[t._v("#")]),t._v(" 理解 Trino 内存管理")]),t._v(" "),s("p",[t._v("Trino 内存管理是由 Master Coordinator 来做的\nTrino 会每 2s 做一次内存分析：")]),t._v(" "),s("ul",[s("li",[t._v("分析当前集群内存是否溢出\n"),s("ul",[s("li",[t._v("当前内存集群内存溢出：Trino 会检查当前集群内存溢出的持续时间，如果持续时间超过了预设值（默认5min），则会根据配置好的 Kill Query策略去 Kill 掉查询。\n"),s("ul",[s("li",[t._v("query-low-memory-killer-policy：\n"),s("ul",[s("li",[t._v("none ：不会杀死任何查询")]),t._v(" "),s("li",[t._v("total-reservation ：终止当前使用最多总内存的查询。")]),t._v(" "),s("li",[t._v("total-reservation-on-blocked-nodes：终止当前在内存不足的节点上使用最多内存的查询")])])])])])])]),t._v(" "),s("li",[t._v("分析当前时刻的所有查询是否超出了预设的内存上限\n"),s("ul",[s("li",[t._v("分析查询是否超出了 query.max-memory-per-node / query.max-memory / query.max-total-memory，超出则 kill 掉")])])])]),t._v(" "),s("p",[t._v("以上的内存管理是针对 query 的，不针对 master 节点解析SQL、分析、优化和调度的操作")]),t._v(" "),s("h2",{attrs:{id:"如何避免-trino-oom"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#如何避免-trino-oom"}},[t._v("#")]),t._v(" 如何避免 Trino OOM")]),t._v(" "),s("p",[t._v("Trino 资源组也可以限制用户使用内存\n主要是通过 softMemoryLimit 限制内存的使用。")]),t._v(" "),s("blockquote",[s("p",[t._v("官方文档")]),t._v(" "),s("p",[t._v("softMemoryLimit (required): maximum amount of distributed memory this group may use, before new queries become queued. May be specified as an absolute value (i.e. 1GB) or as a percentage (i.e. 10%) of the cluster’s memory.")])]),t._v(" "),s("p",[t._v("意思是：在每个查询开始之前，会判断当前用户组使用集群的内存情况，如果超过了设定值，则在队列内等待。直至该用户组使用集群内存降下到预设值。\n如：下面配置的意思是，所有的用户都属于admin组，admin组限制了在集群内最高并发50条查询，最长等待队列是300；当admin使用集群内存超过80%时，查询需要在队列中等待。")]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"rootGroups"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"name"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"admin"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"softMemoryLimit"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"80%"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"hardConcurrencyLimit"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("50")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"maxQueued"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("300")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"selectors"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"user"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('".*"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"group"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"admin"')]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("思路：")]),t._v(" "),s("ol",[s("li",[t._v("配置每个查询的使用的内存上限")]),t._v(" "),s("li",[t._v("降低当集群内存不足时， 降低 Trino kill query 的 delay time")]),t._v(" "),s("li",[t._v("配置资源组，避免当集群内存负载高时插入新查询。")]),t._v(" "),s("li",[t._v("开启 spill 选项，允许内存 load 到磁盘")])])])}),[],!1,null,null,null);s.default=n.exports}}]);