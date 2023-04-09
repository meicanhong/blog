---
title: Logstash with Trino 实践分享
date: '2022-11-19'
categories:
- Big-Data
tags:
- Trino
---

Trino 是我们的查询引擎，我们通过 trino 可读写不同 catalog 的数据。如今有业务需求引入了 ElasticSearch，需要将 Trino 的数据同步到 es 中。经调研发现 Logstash 满足我们的同步数据需求，于是便探索如果用 logstash 将 trino 的数据同步到 es。
### Logstash 配置参考
logstash input 支持以 JDBC 方式导入数据，trino 也实现了 jdbc 接口。所以将 trino-jdbc.jar 作为驱动导入即可。详情配置参考：
```nginx
input {
  jdbc {
    jdbc_driver_library => "/usr/share/logstash/config/trino-jdbc-402.jar"
    jdbc_driver_class => "io.trino.jdbc.TrinoDriver"
    jdbc_connection_string => "jdbc:trino://trino-host:443/catalog"
    jdbc_user => "user"
    jdbc_password => "password"
    connection_retry_attempts => "1"
    jdbc_validation_timeout => "3600"
    statement_filepath => "/usr/share/logstash/src/your_sql.sql"
    record_last_run => false
    schedule => "* * * * *"
  }
}
```
output 配置没啥好说的，我们是要同步到 es 中，所以 output 配置为 es 即可。
```nginx
output {
  elasticsearch {
    index => "table_name"
    document_type => "_doc"
    document_id => "%{[@metadata][fingerprint]}"
    ilm_enabled => false
    ssl => true
    cloud_id => "cloud_id"
    cloud_auth => "auth"
  }
}
```

### 同步数据去重
按照上面的配置同步数据的话，多次同步会产生重复数据。所以便要考虑去重方案。
logstash 的 filter fingerprint 插件可以实现去重效果。原理大概是将唯一键组成字段 hash 后得到哈希值，作为此条数据的 id，在写入 es 时会比较 id 然后选择覆盖或插入数据的操作。

如下配置里，我把源表里的 protocol_slug、chain、on_date 生产唯一键 "[@metadata][fingerprint]"，在 output 时将 document_id 配置为 "[@metadata][fingerprint]" ，就可以避免重复数据的产生。
```nginx
filter {
    mutate {
        remove_field => ["@timestamp", "@version"]
    }
    fingerprint {
        source => ["protocol_slug", "chain", "on_date"]
        target => "[@metadata][fingerprint]"
        method => "MURMUR3"
        concatenate_sources => true
    }
}

output {
  elasticsearch {
    index => "table_name"
    document_id => "%{[@metadata][fingerprint]}"
    ilm_enabled => false
    ssl => true
    cloud_id => "cloud_id"
    cloud_auth => "auth"
  }
}
```

### Logstash 调优
logstash jvm 默认配置的是 1g 的堆内存。我这边通过修改 jvm.options 修改为 8g 内存了，还将栈大小提升到 4m。
```latex
-Xss4M
-Xms8g
-Xmx8g
```

我这边需要同步多份数据，需要修改 pipelines.yml，改为多个 pipeline 去同步数据。这里还可以给 pipeline 配置worker数量，不过我这边暂时没遇到性能问题，所以没有进行配置。
```yaml
# This file is where you define your pipelines. You can define multiple.
# For more information on multiple pipelines, see the documentation:
#   https://www.elastic.co/guide/en/logstash/current/multiple-pipelines.html

- pipeline.id: pipeline_1
  path.config: "/usr/share/logstash/src/config_1.conf"
- pipeline.id: pipeline_2
  path.config: "/usr/share/logstash/src/config_2.conf"

```

### 总结
通过以上操作，logstash 能够完成我们实时同步增量数据的需求，并且输入源是 trino，能够很好集成进我们的框架中，是一次不错的生产实践。

### 参考Link
[https://blog.csdn.net/UbuntuTouch/article/details/106639848](https://blog.csdn.net/UbuntuTouch/article/details/106639848)
[https://trino.io/docs/current/client/jdbc.html](https://trino.io/docs/current/client/jdbc.html)
[https://trino.io/docs/current/client/jdbc.html](https://trino.io/docs/current/client/jdbc.html)
