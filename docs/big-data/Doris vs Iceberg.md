---
title: Doris vs Iceberg
date: '2023-04-18'
categories:
- Big-Data
tags:
- Doris
- Iceberg
publish: false
---

## 前言
最近团队在做数仓的性能优化，分别对 Iceberg 和 Doris 下的表进行了性能优化。在优化过程中，查阅了相关的资料，对俩者的存储格式和查询过程有一定的了解。在此有感而发，记录一下。

## 场景
- Iceberg 适合存储海量数据，做复杂的查询。
- Doris 适合存储少量数据，做简单的查询。

Doris 官方文档资料全面，社区活跃，开发者可以从中学习到很多知识。
