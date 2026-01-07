---
title: AutoGen Human-in-the-Loop 实践：从暂停机制到前后端通讯
date: 2025-11-09
tags:
- ai-generation
---

# AutoGen Human-in-the-Loop 实践：从暂停机制到前后端通讯

最近在用 AutoGen 搭建一个贷款审批系统，需要 AI 评估完信用风险后，暂停等待银行职员审查文件并最终批准。这个场景完美契合 Human-in-the-Loop（人机循环）模式。在实现过程中，我深入研究了 AutoGen 的 UserProxyAgent 暂停机制和前后端通讯方案，踩了不少坑，也有些收获。

## 为什么需要 Human-in-the-Loop

在很多实际场景中，完全自动化的 AI 决策是不够的，甚至是危险的：

- **金融审批**：贷款、信用卡申请需要人类最终把关
- **医疗诊断**：AI 辅助诊断，但医生做最终决策
- **内容审核**：敏感内容需要人工复核
- **法律文书**：AI 起草合同，律师审查修改

这些场景的共同点是：AI 负责高效处理和初步判断，人类保留最终决策权，确保合规与责任。

## 贷款审批场景实现

我们的目标是：AI 评估信用风险 → 银行职员审查文件 → 最终批准/拒绝贷款。

### 完整代码

```python
import asyncio
from autogen_agentchat.agents import AssistantAgent, UserProxyAgent
from autogen_agentchat.conditions import TextMentionTermination
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.ui import Console
from autogen_ext.models.openai import OpenAIChatCompletionClient

# 配置 LLM 客户端（需要设置 OPENAI_API_KEY 环境变量）
model_client = OpenAIChatCompletionClient(model="gpt-4o-mini")

# 1. 信用风险评估代理
risk_assessor = AssistantAgent(
    name="Risk_Assessor",
    model_client=model_client,
    system_message="""
    你是一位专业的信用风险评估专家。
    根据申请人提供的个人信息（信用分数、年收入、债务收入比、就业历史、贷款金额等），
    分析信用风险，给出风险分数（0-100，越低越好）和初步推荐（批准/拒绝/需进一步审查）。
    评估完成后，请总结报告，并询问银行职员是否批准贷款。
    """
)

# 2. 银行职员代理（Human-in-the-Loop）
bank_officer = UserProxyAgent(
    name="Bank_Officer",
    input_func=input,  # 使用控制台 input() 获取人类输入
    system_message="""
    你是一位银行贷款审批职员。
    请仔细审查风险评估报告和申请文件。
    你可以提问、要求更多信息，或直接决定：
    - 输入 "APPROVE" 表示批准贷款
    - 输入 "REJECT" 表示拒绝贷款并说明原因
    - 输入其他内容表示反馈或提问，系统会继续交互
    """
)

# 3. 终止条件：当出现 "APPROVE" 或 "REJECT" 时结束对话
termination = TextMentionTermination("APPROVE") | TextMentionTermination("REJECT")

# 4. 创建团队：轮流发言（先风险评估代理，然后银行职员）
team = RoundRobinGroupChat(
    participants=[risk_assessor, bank_officer],
    termination_condition=termination
)

# 5. 主函数：启动贷款审批任务
async def loan_approval_process():
    # 示例申请人信息
    applicant_info = """
    申请人：张三
    信用分数：720
    年收入：150,000 元
    月债务：2,500 元（债务收入比 DTI：20%）
    就业历史：稳定工作 8 年
    贷款金额：500,000 元（房屋贷款）
    其他：无不良记录
    """

    task = f"""
    请评估以下贷款申请的信用风险：
    {applicant_info}

    给出详细风险分析、风险分数和初步推荐。
    然后将报告提交给银行职员最终审批。
    """

    print("=== 开始贷款审批流程 ===\n")
    result = await Console(team.run_stream(task=task))

    print("\n=== 审批结果 ===")
    print(result.final_response)

# 运行
asyncio.run(loan_approval_process())
```

### 执行效果

```
=== 开始贷款审批流程 ===

---------- Risk_Assessor ----------
风险分析报告：
- 信用分数 720：良好
- DTI 20%：低风险
- 稳定就业 8 年：正面因素
风险分数：25（低风险）
初步推荐：批准

请银行职员审查并最终决定是否批准贷款。

---------- Bank_Officer ----------
[等待人类输入...] 请审查以上报告。你可以提问或输入 APPROVE / REJECT：

> 文件已审查，一切正常。APPROVE

---------- Risk_Assessor ----------
贷款已获批准！最终决定：批准贷款 500,000 元给张三。

TERMINATE
```

## UserProxyAgent 的暂停机制

一开始我很好奇：AutoGen 是怎么做到"跑到 UserProxyAgent 就自动暂停等待人类输入"的？

### 核心原理

UserProxyAgent 的暂停机制依赖于 **异步输入函数（input_func）** 和 **事件驱动的消息处理流程**。

```python
class UserProxyAgent(BaseChatAgent):
    def __init__(
        self,
        name: str,
        input_func: Callable[[str, CancellationToken | None], Awaitable[str]] | None = None,
        ...
    ):
        self._input_func = input_func or default_input_func
```

关键点：
- `input_func` 是一个异步函数，签名是 `async def func(prompt: str, cancellation_token) -> str`
- 它接收一个提示字符串（包含完整对话历史），返回人类输入的字符串
- 默认实现是 `input_func = input`（控制台输入）

### 暂停的实现

在 UserProxyAgent 的 `a_generate_response` 方法中：

```python
async def a_generate_response(
    self, messages: Sequence[Message], cancellation_token: CancellationToken | None
) -> Message | None:
    # 1. 构建提示，给人类显示当前上下文
    prompt = self._format_prompt(messages)  # 将历史消息格式化为可读提示

    # 2. 调用 input_func，await 直到得到输入
    user_input = await self._input_func(prompt, cancellation_token)

    if user_input is None:  # 用户取消
        return None

    # 3. 将人类输入包装成 TextMessage 返回
    return TextMessage(content=user_input, source=self.name)
```

**关键的一行**：`await self._input_func(...)` 会挂起（suspend）当前协程，直到 `input_func` 完成返回字符串。此时，整个团队的执行流（`team.run_stream()`）也被暂停，因为它在等待这个代理的回复。

### 团队执行流程

在 `RoundRobinGroupChat` 中：

```python
async for turn_result in self._run_turn():
    current_agent = self._next_participant()  # 轮到 UserProxyAgent
    response = await current_agent.a_generate_response(...)  # 这里调用
    yield response
    # 检查终止条件...
```

当轮到 UserProxyAgent 时：
1. 调用 `a_generate_response`
2. 进入 `await input_func`
3. 整个异步迭代器暂停 → 外部的 `await Console(stream)` 也暂停显示
4. 直到人类输入后，协程恢复，继续下一个代理或终止

这就是 AutoGen 实现"自然暂停"的完整机制：**纯异步协程挂起 + 可替换输入函数**。

## 与前端通讯的方案

控制台 `input()` 只适合调试，生产环境需要 Web UI。AutoGen 的 `input_func` 是可替换的异步函数，这让前后端通讯变得非常灵活。

### 方案一：FastAPI + WebSocket（企业级推荐）

这是微软官方推荐的方案，适合需要完全自定义前端界面的场景。

#### 后端实现

```python
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from autogen_agentchat.agents import UserProxyAgent
import asyncio
import json

app = FastAPI()

# 存储活跃的 WebSocket 连接
active_websockets = {}

@app.websocket("/ws/loan_approval/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    active_websockets[session_id] = websocket
    try:
        while True:
            # 保持连接，接收心跳或消息
            await websocket.receive_text()
    except WebSocketDisconnect:
        del active_websockets[session_id]

# 自定义 input_func：通过 WebSocket 与前端通讯
async def websocket_input_func(prompt: str, cancellation_token=None, session_id="default"):
    if session_id not in active_websockets:
        raise Exception("No active websocket for this session")

    ws = active_websockets[session_id]

    # 1. 发送对话上下文 + 等待输入的提示给前端
    await ws.send_json({
        "type": "waiting_for_input",
        "prompt": prompt,  # 包含完整历史对话
        "message": "请审查贷款申请并做出决定"
    })

    # 2. 等待前端发送用户输入
    while True:
        data = await ws.receive_json()
        if data.get("type") == "user_response":
            user_input = data["content"]
            return user_input

# 创建 UserProxyAgent 时传入自定义 input_func
bank_officer = UserProxyAgent(
    name="Bank_Officer",
    input_func=lambda prompt, ct: websocket_input_func(prompt, ct, session_id="user123")
)
```

#### 前端实现

```html
<script>
const ws = new WebSocket("ws://localhost:8000/ws/loan_approval/user123");

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.type === "waiting_for_input") {
        // 显示 AI 报告
        document.getElementById("chat").innerHTML +=
            "<p><strong>AI报告：</strong>" + data.prompt + "</p>";
        // 显示输入框
        document.getElementById("input-area").style.display = "block";
    }
};

function sendApproval() {
    const input = document.getElementById("user-input").value;
    ws.send(JSON.stringify({
        type: "user_response",
        content: input  // 如 "APPROVE" 或 "REJECT: 收入证明不足"
    }));
    document.getElementById("input-area").style.display = "none";
}
</script>

<div id="chat"></div>
<div id="input-area" style="display:none;">
    <input id="user-input" placeholder="输入 APPROVE / REJECT 或反馈"/>
    <button onclick="sendApproval()">提交</button>
</div>
```

## 在 UserProxyAgent 中能拿到什么数据

在实现前端通讯时，我遇到一个问题：能不能拿到之前所有 agent 的运行上下文？发给用户的那段提示词（prompt）是怎么生成的？

### 完整的对话历史

答案是：**可以**。UserProxyAgent 在需要人类输入时，能完整拿到整个对话历史上下文。

在 `a_generate_response` 方法中：

```python
async def a_generate_response(
    self, messages: Sequence[Message], cancellation_token: CancellationToken | None
) -> Message | None:
```

`messages` 参数就是完整的对话历史上下文：
- 类型：`list[Message]` 或 `Sequence[Message]`
- 每个 `Message` 包含：
  - `content`: 消息内容
  - `source`: 发言者名称（如 "Risk_Assessor"）
  - `timestamp`: 时间戳
  - 其他元数据

这个列表从任务开始到当前轮次的所有消息，顺序完整，包含所有之前 agent 的输出。

### 提示词的生成

在 UserProxyAgent 内部，有一个 `_format_prompt` 方法负责把历史消息格式化成人类可读的提示：

```python
def _format_prompt(self, messages: Sequence[Message]) -> str:
    # 遍历 messages 列表
    # 对于每条消息：
    #   如果是 TextMessage：显示 ---------- {source} ----------\n{content}\n
    #   如果是工具调用/结果：格式化显示工具名、参数、返回等
    # 最后追加一个输入提示，如 \n>
```

示例输出：

```
---------- Risk_Assessor ----------
风险分析报告：
信用分数：720（良好）
...
初步推荐：批准

请银行职员最终审批。

---------- Bank_Officer ----------
[等待输入] >
```

这个完整的字符串就是 `prompt`，然后被传给你的 `input_func(prompt, cancellation_token)`。

### 自定义 UserProxyAgent 获取原始消息

如果你想拿到原始结构化的 `messages` 列表（而不是格式化后的字符串），可以自定义 UserProxyAgent 子类：

```python
from autogen_agentchat.agents import UserProxyAgent
from autogen_agentchat.base import Message, CancellationToken, TextMessage

class CustomUserProxyAgent(UserProxyAgent):
    async def a_generate_response(
        self,
        messages: list[Message],
        cancellation_token: CancellationToken | None
    ) -> Message | None:
        # 这里你可以直接访问原始 messages！
        print("=== 原始历史消息 ===")
        for msg in messages:
            print(f"{msg.source}: {msg.content}")

        # 仍然使用父类的格式化 prompt（或自己重新格式化）
        prompt = self._format_prompt(messages)

        # 自定义逻辑：发给前端时可以附加更多数据
        enriched_prompt = f"=== 贷款审批上下文 ===\n{prompt}\n请做出决定："

        # 调用你的 input_func（可以是 WebSocket 等）
        user_input = await self._input_func(enriched_prompt, cancellation_token)

        return TextMessage(content=user_input, source=self.name)
```

这样你就能在需要人类输入时：
- 拿到原始结构化 `messages`（便于提取特定 agent 输出、工具结果等）
- 拿到格式化的 `prompt` 字符串（适合直接展示给人类）

### 在前端通讯时的实践

在 WebSocket 通讯中，你可以这样处理：

```python
async def websocket_input_func(prompt: str, cancellation_token=None, session_id="default"):
    ws = active_websockets[session_id]

    # 可以解析 prompt，或直接发送
    await ws.send_json({
        "type": "waiting_for_input",
        "full_context": prompt,                  # 完整格式化历史（推荐直接显示）
        "last_ai_message": extract_last_ai_message(prompt),  # 可选：提取最后一段AI报告
        "applicant_info": {...}                  # 可选：从上下文解析出的结构化数据
    })

    # 等待用户回复...
    data = await ws.receive_json()
    return data["content"]
```

## 踩坑记录

### 坑一：WebSocket 连接管理

在多用户场景下，我用一个简单的 `dict` 存储 WebSocket 连接：

```python
active_websockets = {}
```

但这在生产环境不够健壮。更好的做法是：
- 使用 Redis 或数据库存储会话状态
- 添加连接超时和心跳检测
- 处理异常断开和重连

### 坑二：终止条件不生效

我设置了 `TextMentionTermination("APPROVE")`，但输入 "approve"（小写）时不会终止。

原因：默认是大小写敏感的。解决方案：

```python
# 方案一：统一转大写
termination = TextMentionTermination("APPROVE")
# 在 input_func 中：return user_input.upper()

# 方案二：使用正则表达式（如果支持）
# 或自定义终止条件
```

## 核心洞察

**input_func 是可替换的异步函数**。这个设计让 AutoGen 的 Human-in-the-Loop 极其灵活，从控制台调试到企业级 Web UI 的无缝切换。

**await 机制实现自然暂停**。不需要复杂的状态机或轮询，纯异步协程挂起就能实现优雅的暂停等待。

**可以拿到完整的对话历史上下文**。UserProxyAgent 不是"盲目"等待输入，而是能看到之前所有 agent 的输出，这让人类决策更有依据。

**灵活的前后端通讯方案**。WebSocket 适合企业级系统，Chainlit 适合快速原型，Gradio 适合简单演示，各有千秋。

## 总结

AutoGen 的 Human-in-the-Loop 实现非常优雅：通过 UserProxyAgent + 可替换的异步 input_func，实现了从控制台到 Web UI 的灵活切换。暂停机制基于纯异步协程挂起，不需要复杂的状态管理。

在实际项目中，我推荐：
- **快速原型阶段**：用 Chainlit，几行代码就能跑起来
- **生产环境**：用 FastAPI + WebSocket，完全自定义前端
- **内部工具**：用 Gradio，简单够用

最重要的是理解 `input_func` 的本质：它就是一个"等待人类输入的异步函数"，你可以让它等待控制台输入、WebSocket 消息、HTTP 请求、甚至是邮件回复。这种设计的灵活性，让 Human-in-the-Loop 从理论变成了可落地的实践。
