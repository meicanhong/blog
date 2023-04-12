---
title: FlinkSQL 解决多流Join
date: '2023-04-12'
categories:
- Big-Data
tags:
- Flink
---

## 场景
链上的NFT交易数据，需要实时计算出NFT当时的价格，得出这笔交易的价格，然后将这笔交易的价格和NFT的信息一起存入到数据库中。

这涉及到俩个流数据，一个是交易流，一个是币价流，需要根据交易流中的数据的时间戳，去币价流中找到对应的币价。所以这里就涉及到了多流Join。

## 难点
交易数据只需找到最贴近交易时间的币价即可，而币价流中的数据是按照时间戳从小到大排列的，所以如果直接Join，会导致一条交易数据会和多条币价数据Join，这样就会导致计算出来的价格不准确。

下面 Flink SQL 使用 Interval Join 实现了多流Join，根据交易的时间戳，找5分钟内最贴近交易时间的币价。

但如果一个币价在五分钟内有多次更新，那么这个币价就会被多次Join，这样子一笔交易就会重复计算多次价格，这样就会导致最终的结果不准确。
```sql
SELECT 
    t.*, 
    p.price
FROM 
    TABLE (
        -- 对 transaction 流进行窗口聚合
        TUMBLE(TABLE transaction, DESCRIPTOR(timestamp), INTERVAL '5' minute)
    ) AS t
LEFT JOIN 
    TABLE (
        -- 对 price 流进行窗口聚合
        TUMBLE(TABLE price, DESCRIPTOR(timestamp), INTERVAL '5' minute)
    ) AS p 
    ON p.tokenId = t.tokenId
    AND p.timestamp <= t.timestamp AND t.timestamp < p.timestamp + INTERVAL '5' minute
```

## 解决方案
在 Flink Java 中，可以使用时态表的方法解决以上问题。但是 Flink SQL 中，暂时还不支持时态表，所以我们选择使用 Lookup Join 来解决这个问题。

Lookup Join 的原理是:

Flink SQL会在流中维护一张 Look-up 表，其中每一行对应的是一个实体的最新状态。这个最新状态的时间戳就是用来与输入数据流中的时间戳进行匹配的。在进行 Look-up Join 操作时，Flink会根据 Look-up 表中记录的实体状态的时间戳，找出距离 Join 操作中指定的时间最接近的一条记录来进行关联。 **Look up join 不会因为有多个状态更新而重复计算，因为它只会关联最新的状态。**

Lookup Join 首先需要定义一张维表，我们需要将币价流中的数据保存到维表中，然后在交易流中使用 Lookup Join 来关联维表。

```sql
create table price (
    tokenId varchar,
    price varchar,
    timestamp timestamp(3),
    PRIMARY KEY (tokenId) NOT ENFORCED,
    WATERMARK FOR timestamp AS timestamp - INTERVAL '5' SECOND
) WITH (
    'connector' = 'jdbc',
    'url' = 'jdbc:mysql://localhost:3306/test?useSSL=false&serverTimezone=UTC',
    'table-name' = 'price'
);
```

然后我们将交易流和维表关联起来，使用 Lookup Join，这样就可以根据交易流中的数据的时间戳，去维表中找到对应的币价。

```sql
SELECT 
    t.*, 
    p.price
FROM
    TABLE (
        -- 对 transaction 流进行窗口聚合
        TUMBLE(TABLE transaction, DESCRIPTOR(timestamp), INTERVAL '5' minute)
    ) AS t
LEFT JOIN price FOR SYSTEM_TIME AS OF t.timestamp AS p
    ON p.tokenId = t.tokenId
```

这样子每笔交易都会找到最贴近交易时间的币价，而且不会因为币价流中的数据有多次更新而重复计算。

## 总结
Flink SQL 中的 Lookup Join 可以解决多流Join中的重复计算问题，但是 Lookup Join 也有一些缺点，比如 Lookup Join 会在流中维护一张 Look-up 表，这张表会占用一定的内存，如果数据量很大，那么这张表就会占用很大的内存，所以 Lookup Join 适用于数据量不大的场景。