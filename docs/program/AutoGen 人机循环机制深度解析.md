# AutoGen 人机循环深度解析：从原理到企业级落地

说实话，第一次接触 AutoGen 的 UserProxyAgent 时，我看着那行 `await input_func` 发呆——原来"暂停等待人类输入"这么核心的功能，底层实现竟然这么简单优雅。这篇文章记录了我对 AutoGen 人机循环机制的完整探索，从概念、场景到实现原理，再到如何集成真实的企业级前端。

---

## 什么是人机循环

**人机循环**（Human-in-the-Loop，简称 HITL）是在 AI 系统中引入人类干预、反馈或批准的机制。听起来很学术，说白了就是：AI 干活，人类把关。

在 AutoGen 里，HITL 主要解决一个问题：**多代理系统执行到关键节点时，暂停下来等人类决定下一步怎么做**。

### 两种交互模式

AutoGen 支持 HITL 的两种方式：

| 模式 | 触发时机 | 适用场景 |
|------|----------|----------|
| 运行中反馈 | 执行过程中暂停 | 短期、即时决策（批准/拒绝） |
| 运行后反馈 | 执行到终止条件后停止 | 需要较长时间审查的场景 |

---

## 实际场景：为什么要 HITL

说实话，不是所有场景都需要人类介入。AI 处理重复任务就很高效。但下面这些情况，没人类盯着容易出事：

| 领域 | 风险 | HITL 作用 |
|------|------|-----------|
| 医疗诊断 | 误诊危及生命 | 医生验证 AI 结论 |
| 金融贷款 | 经济损失 + 合规 | 银行职员最终批准 |
| 内容审核 | 误判文化上下文 | 人工复核边缘案例 |
| 自动驾驶 | 不可预测环境 | 远程接管复杂路况 |
| 代码生成 | 执行危险操作 | 开发者审查后运行 |

**核心逻辑**：AI 处理信息和初步判断，人类做最终决策。这样既能提效，又能保证责任归属。

---

## 代码实现：贷款审批场景

用 AutoGen v0.4 实现一个完整的 HITL 场景：AI 评估信用风险，银行职员最终批准。

```python
import asyncio
from autogen_agentchat.agents import AssistantAgent, UserProxyAgent
from autogen_agentchat.conditions import TextMentionTermination
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.ui import Console
from autogen_ext.models.openai import OpenAIChatCompletionClient

# LLM 客户端配置
model_client = OpenAIChatCompletionClient(model="gpt-4o-mini")

# 1. 信用风险评估代理
risk_assessor = AssistantAgent(
    name="Risk_Assessor",
    model_client=model_client,
    system_message="""
    你是信用风险评估专家。
    根据申请人信息（信用分数、收入、债务比率、就业历史、贷款金额等），
    分析风险，给出风险分数（0-100，越低越好）和初步推荐。
    评估完成后，询问银行职员是否批准贷款。
    """
)

# 2. 银行职员代理（Human-in-the-Loop）
bank_officer = UserProxyAgent(
    name="Bank_Officer",
    input_func=input,  # 生产环境换成 WebSocket 或 Web UI
    system_message="""
    你是银行贷款审批职员。
    审查风险评估报告后：
    - 输入 "APPROVE" 批准
    - 输入 "REJECT" 拒绝
    - 输入其他内容继续交互
    """
)

# 3. 终止条件
termination = TextMentionTermination("APPROVE") | TextMentionTermination("REJECT")

# 4. 团队：轮流发言
team = RoundRobinGroupChat(
    participants=[risk_assessor, bank_officer],
    termination_condition=termination
)

# 5. 执行
async def loan_approval_process():
    applicant_info = """
    申请人：张三
    信用分数：720
    年收入：150,000 元
    月债务：2,500 元（DTI：20%）
    就业历史：稳定工作 8 年
    贷款金额：500,000 元
    """

    task = f"请评估以下贷款申请：{applicant_info}"
    result = await Console(team.run_stream(task=task))
    return result

asyncio.run(loan_approval_process())
```

**执行流程**：Risk_Assessor 分析 → 暂停等待人类输入 → Bank_Officer 输入 APPROVE/REJECT → 结束。

---

## 深入原理：UserProxyAgent 是怎么暂停的

这个问题的答案其实很简洁：**异步协程挂起**。

### 核心机制

UserProxyAgent 的关键方法是 `a_generate_response`：

```python
async def a_generate_response(
    self,
    messages: Sequence[Message],
    cancellation_token: CancellationToken | None
) -> Message | None:
    # 1. 格式化历史对话为人类可读的 prompt
    prompt = self._format_prompt(messages)

    # 2. 核心：await 挂起，直到人类输入
    user_input = await self._input_func(prompt, cancellation_token)

    # 3. 包装成消息返回
    return TextMessage(content=user_input, source=self.name)
```

当团队轮到 UserProxyAgent 时：

```python
# 团队执行循环（简化）
async for turn_result in self._run_turn():
    current_agent = self._next_participant()  # 轮到 UserProxyAgent
    response = await current_agent.a_generate_response(...)  # 这里 await 挂起！
    yield response
```

**整个执行流在这里暂停**，直到 `input_func` 返回人类输入。

### 能拿到什么数据

`messages` 参数包含完整的对话历史：

```python
# messages 结构示例
[
    Message(source="Risk_Assessor", content="风险分析..."),
    Message(source="Bank_Officer", content="请审查..."),
    # ... 所有之前的消息
]
```

默认的 `_format_prompt` 把这些格式化成人类可读字符串：

```
---------- Risk_Assessor ----------
风险分析报告：...

---------- Bank_Officer ----------
[等待输入] >
```

如果想拿原始结构化数据，可以子类化：

```python
class CustomUserProxyAgent(UserProxyAgent):
    async def a_generate_response(self, messages, cancellation_token=None):
        # 直接访问原始 messages
        last_ai_output = messages[-1].content

        # 自定义发给前端的格式
        enriched_prompt = f"=== 贷款审批 ===\n{self._format_prompt(messages)}"

        user_input = await self._input_func(enriched_prompt, cancellation_token)
        return TextMessage(content=user_input, source=self.name)
```

---

## 前端集成：企业级落地方案

控制台 `input()` 只适合本地调试。生产环境需要前后端分离。

### 方案对比

| 方案 | 实时性 | 开发难度 | 推荐场景 |
|------|--------|----------|----------|
| FastAPI + WebSocket | 高 | 中 | 企业级内部系统 |
| Chainlit | 高 | 低 | 快速原型、演示 |
| Gradio | 中 | 低 | 简单共享 |
| REST 轮询 | 低 | 中 | 传统后台管理 |

### 推荐：FastAPI + WebSocket

**后端**：

```python
from fastapi import FastAPI, WebSocket
import json

app = FastAPI()
active_websockets = {}

@app.websocket("/ws/loan_approval/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    active_websockets[session_id] = websocket
    try:
        while True:
            await websocket.receive_text()  # 保持连接
    except:
        del active_websockets[session_id]

# 自定义 input_func
async def websocket_input_func(prompt: str, cancellation_token=None, session_id="default"):
    ws = active_websockets[session_id]

    # 发送上下文给前端
    await ws.send_json({
        "type": "waiting_for_input",
        "prompt": prompt,
        "message": "请审查贷款申请"
    })

    # 等待用户输入
    while True:
        data = await ws.receive_json()
        if data.get("type") == "user_response":
            return data["content"]

# 创建 UserProxyAgent
bank_officer = UserProxyAgent(
    name="Bank_Officer",
    input_func=lambda p, ct: websocket_input_func(p, ct, session_id="user123")
)
```

**前端（JavaScript）**：

```javascript
const ws = new WebSocket("ws://localhost:8000/ws/loan_approval/user123");

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "waiting_for_input") {
        document.getElementById("chat").innerHTML += `<p>${data.prompt}</p>`;
        document.getElementById("input-area").style.display = "block";
    }
};

function sendApproval() {
    const input = document.getElementById("user-input").value;
    ws.send(JSON.stringify({
        type: "user_response",
        content: input  // "APPROVE" 或 "REJECT"
    }));
}
```

---

## 关键洞察总结

1. **HITL 本质是异步 await 挂起**：简单但强大的设计
2. **input_func 是扩展点**：从控制台到 WebSocket 无缝切换
3. **完整对话历史可访问**：`messages` 参数包含所有上下文
4. **前端集成选型**：快速原型用 Chainlit，企业级用 FastAPI + WebSocket

说实话，AutoGen 的 HITL 设计很值得学习。它证明了复杂的功能不一定需要复杂的实现——一个异步 await + 可替换的 input_func，就支撑起了从控制台调试到企业级 Web UI 的完整扩展链路。

---

## 参考

- [AutoGen GitHub](https://github.com/microsoft/autogen)
- [AutoGen 文档](https://microsoft.github.io/autogen/)
