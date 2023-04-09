---
title: ChatGPT 助力魔改 dbt 中间表
date: '2023-03-15'
categories:
- Big-Data
tags:
- dbt
- chatgpt
---
## 背景
最近团队打通了 trino-doris connector，可以通过 trino 读写 doris 上的数据。为了减少数据同步工作，尝试通过 dbt-trino 读写 doris 的方式来生产指标。
因为 trino-doris connector 没实现 doris 的建表逻辑，而 dbt 大部分模型都需要建表来实现生产。所以我尝试将 incremental 模型的中间表数据先生产在 Iceberg 上，然后 insert 到 doris 的方式来实现指标生产。
这个过程需要实现 temp 表和目标表所在不同的 schema，而这是 dbt 没实现的功能，所以我们得修改 dbt incremental 模型的代码来实现。
## 源码阅读
dbt incremental model 的源码，[https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/include/global_project/macros/materializations/models/incremental/incremental.sql](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/include/global_project/macros/materializations/models/incremental/incremental.sql)

使用 chatgpt 来解释这段代码在干嘛？

> 阅读 **[**https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/include/global_project/macros/materializations/models/incremental/incremental.sql**](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/include/global_project/macros/materializations/models/incremental/incremental.sql)** 代码
> 
> 解释这段代码在干嘛？
> 
> GPT:
> 
> 这段代码是一个SQL脚本，它定义了一个名为"incremental"的自定义Materialization（即一种定义了如何构建数据模型的方式），并包含以下内容：
> 1. 定义了一个名为"get_current_incremental_strategy"的函数，该函数根据配置文件中指定的列来确定应该使用何种增量更新策略（如增量更新，全量更新等）。
> 2. 定义了一个名为"perform_merge"的函数，该函数将源表（即原始数据表）和增量表（即增量更新所需的中间表）进行合并，并将结果写入到目标表中。
> 3. 定义了一个名为"incremental"的宏，该宏使用上述两个函数来实现增量更新逻辑。具体来说，宏首先检查是否需要进行增量更新，如果需要，则调用"perform_merge"函数将增量数据合并到目标表中。如果不需要进行增量更新，则直接对源表进行全量更新。
> 
这段代码是dbt（Data Build Tool）的一部分，它是一种流行的开源数据建模工具，用于将数据从各种来源整合到数据仓库中。通过使用自定义Materialization和宏，dbt可以自动化地执行数据转换和数据处理任务，并且支持增量更新等高级功能。


> 我们需要修改中间表 temp 表的逻辑，问 gpt 哪段代码是生成 temp 表的
> 
> GPT:
> 
> 该代码定义了一个名为"get_temp_relation"的宏，该宏接受一个关系对象"relation"作为参数，并调用"default__make_temp_relation"宏来创建一个临时表。具体来说，"get_temp_relation"宏会将"relation"对象和"_temp"后缀作为参数传递给"default__make_temp_relation"宏，从而创建一个带有"_temp"后缀的临时表。


**那我们得知 default__make_temp_relation 这个宏是创建临时表的，我们重写这个宏即可实现自定义临时表的逻辑。**
> **我想修改 default__make_temp_relation 宏，使其接收传入参数 temp_database ，临时表所在的 schema 使用 temp_database**

可以通过在"default__make_temp_relation"宏中添加一个新的参数"temp_database"来实现将临时表存储到指定的数据库中。
> 下面是修改后的"default__make_temp_relation"宏的代码：

```sql
{% macro default__make_temp_relation(base_relation, suffix, temp_database) %}
    {%- set temp_identifier = base_relation.identifier ~ suffix -%}
    {%- set temp_relation = base_relation.incorporate(
                                path={"identifier": temp_identifier},
                                database=temp_database) -%}

    {{ return(temp_relation) }}
{% endmacro %}
```
## 结论
对 gpt 给出的答案自己进行测试和细节修改后，实现了一版自定义临时表的表名和所在schema的宏。
下面给出最终的宏和使用方法
```sql
{% macro default__make_temp_relation(base_relation, suffix, temp_database=config.get('temp_database', None)) %}
    {% if temp_database %}
        {% set temp_identifier = 'doris_' ~ base_relation.identifier ~ suffix %}
        {% set temp_schema = 'prod_struct' %}
    {% else %}
        {% set temp_identifier = base_relation.identifier ~ suffix %}
        {% set temp_schema = base_relation.schema %}
    {% endif %}
    {% set temp_database = temp_database or base_relation.database %}
    {% set temp_relation = api.Relation.create(
      database=temp_database,
      schema=temp_schema,
      identifier=temp_identifier,
      type=base_relation.type,
      metadata=base_relation.metadata
    ) %}
    {{ return(temp_relation) }}
{% endmacro %}

```
使用时需要在 config 中加上 temp_database 参数即可
```sql
{{ config(
    materialized = 'incremental',
    unique_key=['chain','protocol_slug'],
    incremental_strategy='append',
    database = 'doris',
    temp_database = 'iceberg',
    alias = 'protocol_info'
)}}
select
*
from protocol_info
```
最终这个 dbt 模型会在 iceberg 目录下生成 temp 表，然后 insert 到 doris 上。
