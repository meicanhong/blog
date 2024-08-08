(window.webpackJsonp=window.webpackJsonp||[]).push([[41],{478:function(t,a,s){"use strict";s.r(a);var r=s(2),e=Object(r.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"vpn节点搭建"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#vpn节点搭建"}},[t._v("#")]),t._v(" VPN节点搭建")]),t._v(" "),a("h2",{attrs:{id:"vps-购买"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#vps-购买"}},[t._v("#")]),t._v(" VPS 购买")]),t._v(" "),a("p",[t._v("VPS 购买地址:")]),t._v(" "),a("ul",[a("li",[t._v("1C1G "),a("a",{attrs:{href:"https://my.racknerd.com/aff.php?aff=8055&pid=735",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://my.racknerd.com/aff.php?aff=8055&pid=735"),a("OutboundLink")],1)]),t._v(" "),a("li",[t._v("2C2G "),a("a",{attrs:{href:"https://my.racknerd.com/aff.php?aff=8055&pid=768",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://my.racknerd.com/aff.php?aff=8055&pid=76"),a("OutboundLink")],1)]),t._v(" "),a("li",[t._v("4C4G "),a("a",{attrs:{href:"https://my.racknerd.com/aff.php?aff=8055&pid=737",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://my.racknerd.com/aff.php?aff=8055&pid=73"),a("OutboundLink")],1)])]),t._v(" "),a("h2",{attrs:{id:"域名"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#域名"}},[t._v("#")]),t._v(" 域名")]),t._v(" "),a("h3",{attrs:{id:"域名购买"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#域名购买"}},[t._v("#")]),t._v(" 域名购买")]),t._v(" "),a("p",[t._v("推荐国内的云，6元能买到一个一年的域名")]),t._v(" "),a("h3",{attrs:{id:"域名停靠-cloudflare"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#域名停靠-cloudflare"}},[t._v("#")]),t._v(" 域名停靠 cloudflare")]),t._v(" "),a("ol",[a("li",[t._v("在 cf 上 new site，输入域名，选择 free plan")]),t._v(" "),a("li",[t._v("在买的域名服务商那里，将域名解析到 cf 提供的 ns 上")]),t._v(" "),a("li",[t._v("在 cf 上添加 A 记录，将域名解析到 VPS 的 IP 上，注意要关闭 cloudflare 的代理")])]),t._v(" "),a("h2",{attrs:{id:"v2ray"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#v2ray"}},[t._v("#")]),t._v(" V2ray")]),t._v(" "),a("h3",{attrs:{id:"搭建-v2ray"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#搭建-v2ray"}},[t._v("#")]),t._v(" 搭建 V2ray")]),t._v(" "),a("p",[t._v("系统推荐使用 Ubutu 22.04（尝试过 Centos7，使用一键脚本存在问题）")]),t._v(" "),a("p",[t._v("一键安装 V2ray 命令："),a("code",[t._v("bash <(wget -qO- -o- [https://git.io/v2ray.sh](https://git.io/v2ray.sh))")])]),t._v(" "),a("p",[t._v("详细教程查看  "),a("a",{attrs:{href:"https://github.com/233boy/v2ray",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://github.com/233boy/v2ray"),a("OutboundLink")],1)]),t._v(" "),a("h3",{attrs:{id:"tls-ws-web"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#tls-ws-web"}},[t._v("#")]),t._v(" TLS+WS+Web")]),t._v(" "),a("p",[t._v("参考：https://github.com/233boy/v2ray")]),t._v(" "),a("h2",{attrs:{id:"配置证书"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#配置证书"}},[t._v("#")]),t._v(" 配置证书")]),t._v(" "),a("p",[t._v("先购买域名，然后在域名服务商那里配置域名解析，将域名解析到 VPS 的 IP 上")]),t._v(" "),a("p",[t._v("然后需要在 VPS 上签一个证书，使用 Let's Encrypt 来签 一个证书。使用 Let's Encrypt 证书你需要在服务器上安装一个 certbot，点击 certbot 这个链接，你可以选择你的服务器，操作系统，然后就跟着指令走吧。")]),t._v(" "),a("p",[t._v("接下来，你需要申请一个证书（我们使用standalone的方式，然后，你需要输入你的电子邮件和你解析到 VPS 的域名）：")]),t._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" certbot certonly "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("--standalone")]),t._v("\n")])])]),a("p",[t._v("证书默认生成在 /etc/letsencrypt/live/<YOUR.DOMAIN.COM/> 目录下，这个证书90天后就过期，所以我们要配置自动更新证书。")]),t._v(" "),a("p",[t._v("创建一个 shell 脚本，用来自动更新证书：")]),t._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[t._v("/usr/bin/certbot renew --force-renewal\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("docker")]),t._v(" restart gost\n")])])]),a("p",[t._v("使用命令 "),a("code",[t._v("crontab -e")]),t._v(" 来开启定时任务")]),t._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),t._v(" * * "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sh")]),t._v(" /root/cron_renew_ssl.sh\n")])])]),a("h2",{attrs:{id:"gost"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#gost"}},[t._v("#")]),t._v(" Gost")]),t._v(" "),a("h3",{attrs:{id:"gost-协议搭建"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#gost-协议搭建"}},[t._v("#")]),t._v(" "),a("strong",[t._v("Gost 协议搭建")])]),t._v(" "),a("p",[t._v("参考："),a("a",{attrs:{href:"https://github.com/haoel/haoel.github.io",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://github.com/haoel/haoel.github.io"),a("OutboundLink")],1)]),t._v(" "),a("h3",{attrs:{id:"谷歌人机验证问题"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#谷歌人机验证问题"}},[t._v("#")]),t._v(" 谷歌人机验证问题")]),t._v(" "),a("p",[t._v("为啥会出现人机验证问题")]),t._v(" "),a("p",[t._v("原因：VPS 所在网段被谷歌拉黑，可能是同网段内其他VPS访问谷歌太频繁。")]),t._v(" "),a("p",[t._v("解决方案之一：访问 Google 的请求走 Tunnel，避免直接使用 VPS 的 IP 访问即可。下面我们利用 CF 提供的 WARP 解决")]),t._v(" "),a("p",[t._v("一键安装 cf warp 添加 ipv6 命令")]),t._v(" "),a("p",[a("code",[t._v("bash <(curl -fsSL [git.io/warp.sh](http://git.io/warp.sh)) 6")])]),t._v(" "),a("p",[t._v("执行完成后，执行 "),a("code",[t._v("ifconfig")]),t._v(" 可以看到 "),a("code",[t._v("wgcf")]),t._v(" 端口")]),t._v(" "),a("p",[t._v("修改 v2ray.config 文件，让 google 的请求 走 "),a("code",[t._v("wgcf")]),t._v(" 端口")]),t._v(" "),a("p",[t._v("outbounds 里添加")]),t._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"protocol"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"freedom"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"settings"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t\t"),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"domainStrategy"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"UseIPv6"')]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"tag"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"wgcf-ipv6"')]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n")])])]),a("p",[t._v("routing 的 rules 添加规则")]),t._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"type"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"field"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"outboundTag"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"wgcf-ipv6"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v('// 这个tag和"outbounds"判断的tag名字一样')]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"domain"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"geosite:google"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// google 走 IPv6")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n")])])]),a("p",[t._v("重启 v2ray 生效配置。")]),t._v(" "),a("p",[t._v("检测是否走 "),a("code",[t._v("wgcf")]),t._v(" 端口，"),a("code",[t._v("tcpdump -i wgcf host [www.google.com](http://www.google.com/)")])])])}),[],!1,null,null,null);a.default=e.exports}}]);