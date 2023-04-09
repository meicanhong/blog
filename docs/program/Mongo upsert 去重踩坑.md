---
title: Mongo upsert 去重踩坑
date: '2022-11-26'
categories:
- Program
tags:
- mongo
---
在线上环境碰到一张 mongo 表里有重复数据，最终追溯到了 node mongo 插入数据那里，发现了 mongo 的 upsert 并非是线程安全的，在并发的情况下会产生重复数据。后面查阅 monog 的文档，也指出了使用 upsert 方法时要给表加上唯一索引。
> #### Upsert with Unique Index
> When using the [upsert: true](https://www.mongodb.com/docs/manual/reference/method/db.collection.update/#std-label-update-upsert) option with the [update()](https://www.mongodb.com/docs/manual/reference/method/db.collection.update/#mongodb-method-db.collection.update) method, **and not** using a [unique index](https://www.mongodb.com/docs/manual/core/index-unique/#std-label-index-type-unique) on the query field(s), multiple instances of a [update()](https://www.mongodb.com/docs/manual/reference/method/db.collection.update/#mongodb-method-db.collection.update) operation with similar query field(s) could result in duplicate documents being inserted in certain circumstances.


我一般都是这样子创建唯一索引：
db.collection.createIndex(unique_keys, { backgroud : true,  unique : true})

这里也分析一下为啥 upsert 会产生重复数据吧。是因为 upsert 操作不是原子性的，upsert 分为俩步：

- 找数据
- 覆盖数据或插入数据

在并发下，多个线程同时 upsert 并完成找数据这一步操作，此时这些线程都没有找到数据，然后都进行插入数据的操作，于是重复数据便产生了。解决这一问题的方案有俩种，一种是给表加唯一索引，另外一种是给 upsert 这俩部操作加上一个写锁。

总结
以后用 mongo 时，尽量给每张表都加上唯一索引吧，有重复数据的时候还得先去重才能建索引，太麻烦了，不如一开始就建好唯一索引。
