# WireGuard Easy Chinese

[![Docker](https://img.shields.io/docker/v/flypigcn/wg-easy-cn/latest)](https://hub.docker.com/r/flypigcn/wg-easy-cn)
[![Docker](https://img.shields.io/docker/pulls/flypigcn/wg-easy-cn.svg)](https://hub.docker.com/r/flypigcn/wg-easy-cn)
[![Sponsor](https://img.shields.io/github/sponsors/FlypigCN)](https://github.com/sponsors/FlypigCN)
![GitHub Stars](https://img.shields.io/github/stars/FlypigCN/wg-easy)

您已经找到了在任何Linux主机上安装和管理WireGuard的最简单的方法!

<p align="center">
  <img src="./assets/screenshot.png" width="802" />
</p>

## Features

* 一体式:WireGuard + Web UI。
* 安装方便，使用简单。
* 客户端列表，创建，编辑，删除，启用和禁用。
* 显示客户端的二维码。
* 下载客户端配置文件。
* 客户端已连接的统计信息。
* 每个连接客户端的Tx/Rx图表。
* 支持Gravatar。

## 要求

* 带有支持WireGuard内核(所有现代内核)的主机。
* 安装了Docker的主机。

## 安装

### 1. 安装Docker

如果你还没有安装Docker，运行以下命令安装:

```bash
$ curl -sSL https://get.docker.com | sh
$ sudo usermod -aG docker $(whoami)
$ exit
```

然后再次登录。

### 2. Run WireGuard Easy

自动安装和运行wg-easy，只需运行:

<pre>
$ docker run -d \
  --name=wg-easy \
  -e WG_HOST=<b>🚨YOUR_SERVER_IP</b> \
  -e PASSWORD=<b>🚨YOUR_ADMIN_PASSWORD</b> \
  -v ~/.wg-easy:/etc/wireguard \
  -p 51820:51820/udp \
  -p 51821:51821/tcp \
  --cap-add=NET_ADMIN \
  --cap-add=SYS_MODULE \
  --sysctl="net.ipv4.conf.all.src_valid_mark=1" \
  --sysctl="net.ipv4.ip_forward=1" \
  --restart unless-stopped \
  flypigcn/wg-easy-cn
</pre>

> 💡 将`YOUR_SERVER_IP`替换为您的IP，或动态DNS主机名。
> 
> 💡 将`YOUR_ADMIN_PASSWORD`替换为登录Web界面的密码。

Web UI现在可以在 `http://0.0.0.0:51821` 上使用。

> 💡 您的配置文件将保存在 `~/.wg-easy`

### 3. 赞助商

你喜欢这个项目吗? [给我买杯啤酒!](https://github.com/sponsors/WeeJeWel) 🍻

## 选项

这些选项可以通过在`docker run`命令中使用`-e KEY="VALUE"`设置环境变量来配置。

| 变量名 | 默认 | 示例 | 描述 |
| - | - | - | - |
| `PASSWORD` | - | `foobar123` | 设置后，登录Web界面时需要输入密码。|
| `WG_HOST` | - | `vpn.myserver.com` | VPN服务器的公网IP。 |
| `WG_PORT` | `51820` | `12345` | VPN服务器的UDP公共端口，WireGuard将始终监听Docker容器中的`51820`端口。 |
| `WG_MTU` | `null` | `1420` | 客户端将使用的MTU。服务器使用默认的WG MTU。 |
| `WG_PERSISTENT_KEEPALIVE` | `0` | `25` | 以秒为单位的值以保持“连接”打开。 如果此值为 0，则连接不会保持活动状态。 |
| `WG_DEFAULT_ADDRESS` | `10.8.0.x` | `10.6.0.x` | 客户端 IP 地址范围。 |
| `WG_DEFAULT_DNS` | `1.1.1.1` | `8.8.8.8, 8.8.4.4` | 客户端将使用的 DNS 服务器。 |
| `WG_ALLOWED_IPS` | `0.0.0.0/0, ::/0` | `192.168.15.0/24, 10.0.1.0/24` | 允许的 IP 客户端将使用。 |
| `WG_PRE_UP` | `...` | - | 请参阅 [config.js](https://github.com/WeeJeWel/wg-easy/blob/master/src/config.js#L19) 了解默认值 |
| `WG_POST_UP` | `...` | `iptables ...` | 请参阅 [config.js](https://github.com/WeeJeWel/wg-easy/blob/master/src/config.js#L20) 了解默认值 |
| `WG_PRE_DOWN` | `...` | - | 请参阅 [config.js](https://github.com/WeeJeWel/wg-easy/blob/master/src/config.js#L27) 了解默认值 |
| `WG_POST_DOWN` | `...` | `iptables ...` | 请参阅 [config.js](https://github.com/WeeJeWel/wg-easy/blob/master/src/config.js#L28) 了解默认值|
| `TG_TOKEN` | `null` | `-` | Telegram Robot Token |
| `TG_CHAT_ID`| `null` | `-` | Telegram Robot Chat Id |

> 如果您更改了`WG_PORT`，请确保也更改公开的端口。

## 更新

要更新到最新版本，只需运行：

```bash
docker stop wg-easy-cn
docker rm wg-easy-cn
docker pull flypigcn/wg-easy-cn
```

然后再次运行上面的 `docker run -d \ ...` 命令。

## 常见用例

* [将 WireGuard-Easy 与 Pi-Hole 结合使用](https://github.com/WeeJeWel/wg-easy/wiki/Using-WireGuard-Easy-with-Pi-Hole)
* [将 WireGuard-Easy 与 nginx/SSL 结合使用](https://github.com/WeeJeWel/wg-easy/wiki/Using-WireGuard-Easy-with-nginx-SSL)
