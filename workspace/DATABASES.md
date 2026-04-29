# 数据库配置信息

_来源: 1Panel Docker 容器截图（2026-04-21）_
_警告：此文件包含敏感凭据，请勿公开分享_

---

## PostgreSQL

| 属性 | 值 |
|------|-----|
| 容器名 | `1Panel-postgresql-ZkqT` |
| Host | `127.0.0.1`（Docker 内部 IP）或 `<容器IP>` |
| 端口 | `5432` |
| 用户名 | `user_fczjRd` |
| 密码 | `password_37xFFz` |

**连接命令：**
```bash
PGPASSWORD=password_37xFFz psql -h127.0.0.1 -p5432 -Uuser_fczjRd
# 或 Docker 内部直连
docker exec -it 1Panel-postgresql-ZkqT psql -U user_fczjRd
```

---

## MySQL

| 属性 | 值 |
|------|-----|
| 容器名 | `1Panel-mysql-CLgi` |
| Host | `127.0.0.1`（Docker 内部 IP）或 `<容器IP>` |
| 端口 | `3306` |
| 用户名 | `root` |
| 密码 | `mysql_RcDHFa` |

**连接命令：**
```bash
mysql -h127.0.0.1 -P3306 -uroot -pmysql_RcDHFa
# 或 Docker 内部直连
docker exec -it 1Panel-mysql-CLgi mysql -u root -pmysql_RcDHFa
```

**测试结果 (2026-04-21):**
```bash
✅ 连接成功
📦 MySQL 版本: 8.4.8
ℹ️ 'dbHub' 数据库不存在（系统中仅有：information_schema, mysql, performance_schema, sys）
```

---

## Redis

| 属性 | 值 |
|------|-----|
| 容器名 | `1Panel-redis-R438` |
| Host | `127.0.0.1`（Docker 内部 IP）或 `<容器IP>` |
| 端口 | `6379` |
| 密码 | `redis_XCiDHQ` |

**连接命令：**
```bash
redis-cli -h127.0.0.1 -p6379 -a redis_XCiDHQ
# 或 Docker 内部直连
docker exec -it 1Panel-redis-R438 redis-cli a redis_XCiDHQ
```

**测试结果 (2026-04-21):**
```bash
✅ 连接成功
📦 Redis 版本: 8.6.2
💾 数据库键数量: 0（空数据库）
```

---

## dbHub（HTTP API 服务）

_注意：dbHub 通过 HTTP API 提供服务，端口与容器不同_

| 属性 | 值 |
|------|-----|
| 访问方式 | `http://`（API 服务） |
| Host/地址 | `127.0.0.1` |
| 端口 | `18084`（HTTP API）/ `3306`（MySQL底层） |
| 数据库类型 | MySQL |
| 数据库名 | `dbHub` |
| 用户名 | `root` |
| 密码 | `mysql_RcDHFa` |

**API 访问：**
```bash
# HTTP API 访问 dbHub
curl http://127.0.0.1:18084/api/...

# MySQL 直接连接（使用相同凭据）
mysql -h127.0.0.1 -P3306 -uroot -pmysql_RcDHFa dbHub
```

> **注意：** dbHub 的 API 端口是 `18084`，但底层 MySQL 数据库使用相同的用户名/密码（与上面 MySQL 配置一致）

---

## ⚠️ 注意事项

1. **Docker 网络：** `127.0.0.1` 是宿主机地址，从容器外部访问时使用。如果要在其他 Docker 容器内连接，需要使用 Docker bridge IP（通常通过 `docker inspect <container> | grep IPAddress` 获取）
2. **客户端未安装：** 当前环境没有预装 mysql-client、psql、redis-cli
3. **安全提醒：** 密码已明文记录，建议定期轮换

---

## 数据库容器验证命令

```bash
# 查看所有 1Panel 相关容器
docker ps | grep "1Panel"

# 获取容器 IP（用于同网络其他容器访问）
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container-name>
```
