(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{422:function(t,s,a){t.exports=a.p+"assets/img/img_9.69feb5ae.png"},452:function(t,s,a){"use strict";a.r(s);var r=a(2),e=Object(r.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h2",{attrs:{id:"测试结论"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#测试结论"}},[t._v("#")]),t._v(" 测试结论"),s("br")]),t._v(" "),s("p",[s("img",{attrs:{src:a(422),alt:"img"}})]),t._v(" "),s("h2",{attrs:{id:"详细报告"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#详细报告"}},[t._v("#")]),t._v(" 详细报告")]),t._v(" "),s("p",[t._v("测试表大小 19.31 GB"),s("br"),t._v("测试表数据条数 414839537"),s("br"),t._v("排序字段 wallet_address")]),t._v(" "),s("div",{staticClass:"language-sql extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sql"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("CREATE")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("TABLE")]),t._v(" iceberg"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("beta_gold"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("protocol_active_address_sorted "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n   on_date "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("date")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n   "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("chain")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("varchar")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n   protocol_slug "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("varchar")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n   wallet_address "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("varchar")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n   protocol_name "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("varchar")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n   is_new_address "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("boolean")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n   protocol_type "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("varchar")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("WITH")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n   format "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'ORC'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n   format_version "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n   partitioning "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" ARRAY"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'month(on_date)'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n   sorted_by "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" ARRAY"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'wallet_address'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("h3",{attrs:{id:"仅过滤-sort-字段"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#仅过滤-sort-字段"}},[t._v("#")]),t._v(" 仅过滤 sort 字段")]),t._v(" "),s("ul",[s("li",[t._v("sort table: 854ms")]),t._v(" "),s("li",[t._v("without sort table: 14892 ms")]),t._v(" "),s("li",[t._v("查询速度差 17 倍")])]),t._v(" "),s("div",{staticClass:"language-sql extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sql"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("select")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("*")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" iceberg"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("beta_gold"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"protocol_active_address_sorted"')]),t._v(" \n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("where")]),t._v(" wallet_address "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'0x24f7c21da174ec903019095746f8955485bd952d'")]),t._v("\n")])])]),s("h3",{attrs:{id:"过滤-sort-partition"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#过滤-sort-partition"}},[t._v("#")]),t._v(" 过滤 sort + partition")]),t._v(" "),s("ul",[s("li",[t._v("sort table: 528 ms")]),t._v(" "),s("li",[t._v("without sort table: 742 ms")]),t._v(" "),s("li",[t._v("查询速度差 1.4 倍")])]),t._v(" "),s("div",{staticClass:"language-sql extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sql"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("select")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("*")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" iceberg"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("beta_gold"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"protocol_active_address_sorted"')]),t._v(" \n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("where")]),t._v(" on_date "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("date")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'2023-01-01'")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("and")]),t._v(" wallet_address "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'0x0000000009572a244a6c2d06ffe7be30e3bd2aec'")]),t._v("\n")])])]),s("h3",{attrs:{id:"插入性能"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#插入性能"}},[t._v("#")]),t._v(" 插入性能")]),t._v(" "),s("h4",{attrs:{id:"一次性插入-100w-条苏局"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#一次性插入-100w-条苏局"}},[t._v("#")]),t._v(" 一次性插入 100w 条苏局")]),t._v(" "),s("ul",[s("li",[t._v("sort table: 5894 ms")]),t._v(" "),s("li",[t._v("without sort table: 6499 ms")]),t._v(" "),s("li",[t._v("插入性能差 1.1 倍")])]),t._v(" "),s("div",{staticClass:"language-sql extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sql"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("insert")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("into")]),t._v(" iceberg"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("beta_gold"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"protocol_active_address_sorted"')]),t._v(" \n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("select")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("*")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" iceberg"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("prod_gold"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("protocol_active_address\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("limit")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1000000")]),t._v("\n")])])]),s("h4",{attrs:{id:"一次性插入-1000w-条数据"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#一次性插入-1000w-条数据"}},[t._v("#")]),t._v(" 一次性插入 1000w 条数据")]),t._v(" "),s("ul",[s("li",[t._v("sort table: 38434 ms")]),t._v(" "),s("li",[t._v("without sort table: 12455 ms")]),t._v(" "),s("li",[t._v("插入性能差 3 倍")])]),t._v(" "),s("div",{staticClass:"language-sql extra-class"},[s("pre",{pre:!0,attrs:{class:"language-sql"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("insert")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("into")]),t._v(" iceberg"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("beta_gold"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"protocol_active_address_sorted"')]),t._v(" \n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("select")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("*")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" iceberg"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("prod_gold"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("protocol_active_address\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("limit")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("10000000")]),t._v("\n")])])]),s("h2",{attrs:{id:""}},[s("a",{staticClass:"header-anchor",attrs:{href:"#"}},[t._v("#")])])])}),[],!1,null,null,null);s.default=e.exports}}]);