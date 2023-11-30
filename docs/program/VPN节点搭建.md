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

## 配置证书
先购买域名，然后在域名服务商那里配置域名解析，将域名解析到 VPS 的 IP 上

然后需要在 VPS 上签一个证书，使用 Let's Encrypt 来签 一个证书。使用 Let's Encrypt 证书你需要在服务器上安装一个 certbot，点击 certbot 这个链接，你可以选择你的服务器，操作系统，然后就跟着指令走吧。

接下来，你需要申请一个证书（我们使用standalone的方式，然后，你需要输入你的电子邮件和你解析到 VPS 的域名）：

```bash
sudo certbot certonly --standalone
```

证书默认生成在 /etc/letsencrypt/live/<YOUR.DOMAIN.COM/> 目录下，这个证书90天后就过期，所以我们要配置自动更新证书。

创建一个 shell 脚本，用来自动更新证书：

```bash
/usr/bin/certbot renew --force-renewal
docker restart gost
```

使用命令 `crontab -e` 来开启定时任务

```bash
0 0 1 * * sh /root/cron_renew_ssl.sh
```

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