---
title: "快速开始"
---

# 快速开始

这是一条最短路径，几分钟内跑起来。

## 方案 A：Docker 单容器（推荐）
```bash
docker run -d --name nginxpulse \
  -p 8088:8088 -p 8089:8089 \
  -v /path/to/logs/:/share/logs:ro \
  -v /path/to/nginxpulse_data:/app/var/nginxpulse_data \
  -v /path/to/pgdata:/app/var/pgdata \
  -v /path/to/configs:/app/configs \
  -v /etc/localtime:/etc/localtime:ro \
  magiccoders/nginxpulse:latest
```

若日志目录已挂载但无数据，通常是权限问题，请参考《Deployment》中的“Docker 部署权限说明”，用 `PUID/PGID` 对齐宿主机 UID/GID。

打开：
- 前端: `http://localhost:8088`
- API: `http://localhost:8089`

### 挂载路径说明
* `/path/to/logs` 宿主机存放日志的文件夹
* `/path/to/nginxpulse_data` 用于持久化容器内产生的数据文件 
* `/path/to/pgdata` 用于存放PostgreSQL产生的数据，如果外置数据库则无需传入
* `/path/to/configs` 用于持久化UI自动化生成的配置数据

## 方案 B：单体部署（非 Docker）
前提：必须安装并启动 PostgreSQL。

1) 修改 `configs/nginxpulse_config.json`：
```json
"database": {
  "driver": "postgres",
  "dsn": "postgres://nginxpulse:nginxpulse@127.0.0.1:5432/nginxpulse?sslmode=disable"
}
```

2) 启动服务（示例）：
```bash
./nginxpulse
```

## 必读提醒
版本 > 1.5.3 必须部署 PostgreSQL（SQLite 已移除）。

## 时区
本项目使用系统时区解析日志，请确保运行环境时区正确。
