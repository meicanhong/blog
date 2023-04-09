---
title: Mac Win 双系统时间同步
date: '2023-03-19'
categories:
- Life
tags:
- black apple
---
## 背景
黑苹果电脑安装 win10 和 mac 双系统后，windows 上的时间一直都是早 8 小时的。在使用 windows 时看时间很不方便，于是本文提供一种 windows 开机自动校时的方法
## 解决方案
新增脚本 sync_time.bat，此脚本主要是在做同步时间
```shell
net stop w32time
w32tm /unregister
w32tm /register
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\w32time\Config" /v MaxNegPhaseCorrection /t reg_dword /d 0xFFFFFFFF /f
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\w32time\Config" /v MaxPosPhaseCorrection /t reg_dword /d 0xFFFFFFFF /f
net start w32time
w32tm /resync
w32tm /resync

#pause
```

将此脚本设置为开机自启<br />win + r 后输入：shell:startup，将 sync_time.bat 放到此目录下，即可实现开启自启脚本，实现时间校准。

