(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{439:function(t,_,v){t.exports=v.p+"assets/img/img_9.55e140bb.png"},440:function(t,_,v){t.exports=v.p+"assets/img/img_10.eb7a44b8.png"},476:function(t,_,v){"use strict";v.r(_);var i=v(2),l=Object(i.a)({},(function(){var t=this,_=t._self._c;return _("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[_("p",[t._v("最近在尝试做一个 crypto 领域的 AI 机器人，想要做到我们问一些 crypto 相关的问题，bot 能够进行回答。例如输入 contract address 信息，bot 能够回答这 contract info、contract belong protocol info 等等信息。")]),t._v(" "),_("p",[t._v("为什么不用 ChatGPT 呢？")]),t._v(" "),_("p",[t._v("因为 GPT 只有截止到 2021 年前的数据，没有最新的数据内容。而且 GPT 所知道的信息太泛了，没有专注于 crypto 领域，回答内容时不够专注。")]),t._v(" "),_("p",[t._v("所以，我们需要提供 更多 crypto 领域的知识给 GPT。")]),t._v(" "),_("p",[t._v("那么，如何将知识喂给GPT呢？有不同的层级：")]),t._v(" "),_("ul",[_("li",[t._v("Prompt 层级。将知识作为上下文信息喂给 GPT")]),t._v(" "),_("li",[t._v("Fine Tune。将知识作为训练集去训练 LLM，这个方案需要自训练 LLM 模型。")])]),t._v(" "),_("h2",{attrs:{id:"prompt-engineer"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#prompt-engineer"}},[t._v("#")]),t._v(" Prompt Engineer")]),t._v(" "),_("p",[_("a",{attrs:{href:"https://github.com/hwchase17/langchain",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://github.com/hwchase17/langchain"),_("OutboundLink")],1)]),t._v(" "),_("p",[t._v("要构建属于自己的 AI 应用肯定是逃不过 Langchain 框架的，Langchain 框架帮我们封装好整个AI应用体系需要用到的组件。")]),t._v(" "),_("p",[t._v("构建私有知识库 AI 机器人步骤：")]),t._v(" "),_("ol",[_("li",[t._v("准备数据")]),t._v(" "),_("li",[t._v("将数据切分 并 embeddings，持久化到 vector db")]),t._v(" "),_("li",[t._v("用户提问后，将问题放入 vector db 搜索，得到相似数据")]),t._v(" "),_("li",[t._v("将 vector db 的结果 放入 prompt 中，丢给 LLM 提问")]),t._v(" "),_("li",[t._v("LLM 回答问题")])]),t._v(" "),_("p",[t._v("这些步骤内，最重要的是准备数据，这部分数据可能来自于：")]),t._v(" "),_("ul",[_("li",[t._v("数据库中的结构化数据")]),t._v(" "),_("li",[t._v("Google Search result")]),t._v(" "),_("li",[t._v("news、paper、blog 等非结构化数据")]),t._v(" "),_("li",[t._v("…")])]),t._v(" "),_("p",[_("img",{attrs:{src:v(439),alt:"Untitled"}})]),t._v(" "),_("p",[t._v("私有 AI Chat 服务：")]),t._v(" "),_("ul",[_("li",[t._v("https://github.com/langgenius/dify")]),t._v(" "),_("li",[t._v("https://github.com/Chainlit/chainlit")])]),t._v(" "),_("h2",{attrs:{id:"自训练-llm"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#自训练-llm"}},[t._v("#")]),t._v(" 自训练 LLM")]),t._v(" "),_("p",[t._v("有几个比较成功的自训练 LLM 模型，我们可以参考其训练过程：")]),t._v(" "),_("ul",[_("li",[t._v("https://github.com/tatsu-lab/stanford_alpaca")]),t._v(" "),_("li",[t._v("https://github.com/tloen/alpaca-lora")]),t._v(" "),_("li",[t._v("https://github.com/AI4Finance-Foundation/FinGPT")]),t._v(" "),_("li",[t._v("https://github.com/chaoyi-wu/PMC-LLaMA")]),t._v(" "),_("li",[t._v("https://github.com/nomic-ai/gpt4all")])]),t._v(" "),_("p",[t._v("简单介绍以上模型：")]),t._v(" "),_("ul",[_("li",[t._v("Stanford-Alpaca 提供完整的训练流程和代码，很有参考意义。")]),t._v(" "),_("li",[t._v("Alpace-Lora 是利用 Lora 技术，使整个模型训练 更快更轻，对硬件要求没那么高。")]),t._v(" "),_("li",[t._v("FinGPT 是一个实际的自训练模型落地应用，是金融领域的LLM")]),t._v(" "),_("li",[t._v("PMC是 喂了 4.3M 医学论文进行微调的 基于 LLaMA 模型 的 医学 LLM")])]),t._v(" "),_("h3",{attrs:{id:"self-intruct"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#self-intruct"}},[t._v("#")]),t._v(" Self-Intruct")]),t._v(" "),_("p",[t._v("训练模型需要准备数据，https://github.com/yizhongw/self-instruct 提供了一种可以生成大量训练数据的方法。")]),t._v(" "),_("p",[t._v("生成过程：")]),t._v(" "),_("ol",[_("li",[t._v("人工设计了175个表示不同任务的指令，并且给每条数据都编写了（指令, 输入, 输出）/（指令, 输出），将这175条数据作为种子池。")]),t._v(" "),_("li",[t._v("使用模型生成新的指令；")]),t._v(" "),_("li",[t._v("对该模型生成的指令判断是否分类任务；")]),t._v(" "),_("li",[t._v("使用模型生成实例；")]),t._v(" "),_("li",[t._v("对上述模型生成的数据进行过滤和后处理；")]),t._v(" "),_("li",[t._v("将经过过滤和后处理的数据添加到种子池中；")]),t._v(" "),_("li",[t._v("一直重复上述2到6步直到种子池有足够多的数据；")])]),t._v(" "),_("p",[t._v("具体流程：")]),t._v(" "),_("ol",[_("li",[t._v("从种子集开始，抽几条出来让 GPT 模仿，生成一条 "),_("code",[t._v("instruction")])]),t._v(" "),_("li",[t._v("判断这条 "),_("code",[t._v("instruction")]),t._v(" 是否能分类，然后继续让 GPT 生成 "),_("code",[t._v("instance")]),t._v("（即输入输出）\n"),_("ol",[_("li",[t._v("输入优先："),_("code",[t._v("is_classification")]),t._v("：false")]),t._v(" "),_("li",[t._v("输出优先："),_("code",[t._v("is_classification")]),t._v("：true。因为对于分类任务，如果先生成文本，后生成标签，模型会偏向于生成比较单一的结果。")])])]),t._v(" "),_("li",[t._v("验证步骤2生成的指令质量，质量高的才留下，放到种子集中，然后进行下一次循环。")])]),t._v(" "),_("p",[_("img",{attrs:{src:v(440),alt:"Untitled"}})])])}),[],!1,null,null,null);_.default=l.exports}}]);