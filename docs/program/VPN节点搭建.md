---
title: VPN节点搭建
date: '2023-05-11'
categories:
- Program
tags:
- VPN
---

# VPN节点搭建

## VPS 购买

VPS 购买地址:

- 1C1G [https://my.racknerd.com/aff.php?aff=8055&pid=735](https://my.racknerd.com/aff.php?aff=8055&pid=735)
- 2C2G [https://my.racknerd.com/aff.php?aff=8055&pid=76](https://my.racknerd.com/aff.php?aff=8055&pid=768)
- 4C4G [https://my.racknerd.com/aff.php?aff=8055&pid=73](https://my.racknerd.com/aff.php?aff=8055&pid=737)

## 域名购买
推荐国内的云，6元能买到一个一年的域名

## V2ray

### 搭建 V2ray

系统推荐使用 Ubutu 22.04（尝试过 Centos7，使用一键脚本存在问题）

一键安装 V2ray 命令：`bash <(wget -qO- -o- [https://git.io/v2ray.sh](https://git.io/v2ray.sh))`

详细教程查看  [https://github.com/233boy/v2ray](https://github.com/233boy/v2ray)

### TLS+WS+Web

参考：https://github.com/233boy/v2ray

## Gost

### **Gost 协议搭建**

参考：[https://github.com/haoel/haoel.github.io](https://github.com/haoel/haoel.github.io)

### 谷歌人机验证问题

为啥会出现人机验证问题

原因：VPS 所在网段被谷歌拉黑，可能是同网段内其他VPS访问谷歌太频繁。

解决方案之一：访问 Google 的请求走 Tunnel，避免直接使用 VPS 的 IP 访问即可。下面我们利用 CF 提供的 WARP 解决

一键安装 cf warp 添加 ipv6 命令

`bash <(curl -fsSL [git.io/warp.sh](http://git.io/warp.sh)) 6`

执行完成后，执行 `ifconfig` 可以看到 `wgcf` 端口

修改 v2ray.config 文件，让 google 的请求 走 `wgcf` 端口

outbounds 里添加

```json
{
	"protocol": "freedom",
	"settings": {
		"domainStrategy": "UseIPv6"
	},
	"tag": "wgcf-ipv6"
},
```

routing 的 rules 添加规则

```json
{
	"type": "field",
	"outboundTag": "wgcf-ipv6",  // 这个tag和"outbounds"判断的tag名字一样
	"domain": ["geosite:google"] // google 走 IPv6
},
```

重启 v2ray 生效配置。

检测是否走 `wgcf` 端口，`tcpdump -i wgcf host [www.google.com](http://www.google.com/)`