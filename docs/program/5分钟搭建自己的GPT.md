---
title: 5分钟搭建自己的GPT
date: '2023-04-11'
categories:
- Program
tags:
- AI
---

跟着 [ChatGPT-Next-Web](https://github.com/Yidadaa/ChatGPT-Next-Web) 这个项目，5分钟搭建自己的GPT聊天机器人。

## Vercel 部署
使用 Vercel 部署，免费，不用搭建服务器。

步骤:
1. [获取 OpenAI Key](https://platform.openai.com/account/api-keys) 
2. [Deploy In Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYidadaa%2FChatGPT-Next-Web&env=OPENAI_API_KEY&env=CODE&project-name=chatgpt-next-web&repository-name=ChatGPT-Next-Web)
   1. 输入 OpenAI Key
   2. Code 是你给这个服务定义的密码，用于访问这个服务
3. Enjoy

部署完成后即可打开自己的GPT服务,打开设置输入访问密码(上文的 Code)即可使用

![image.png](./img/img_2.png)

自己花了点时间在国内的一台服务器上搭建了一个 [ChatGPT 服务](http://117.50.185.73/)，方便国内的小白使用(不用走代理)

## Docker 部署
```shell
docker pull yidadaa/chatgpt-next-web

docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY="sk-xxxx" \
   -e CODE="your-password" \
   --name chatgpt \
   yidadaa/chatgpt-next-web
```