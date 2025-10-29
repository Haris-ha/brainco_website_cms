# PostgreSQL 数据库配置指南

## ✅ 已完成的步骤

1. ✅ 安装了 PostgreSQL 依赖包 (`pg` 和 `pg-connection-string`)
2. ✅ 创建了 `.env` 配置文件
3. ✅ 设置了数据库客户端为 `postgres`

## 🔧 需要完成的步骤

### 1. 安装 PostgreSQL 数据库

如果您还没有安装 PostgreSQL，请选择以下方式之一：

**使用 Homebrew (推荐 macOS):**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**使用 Docker:**
```bash
docker run --name brainco-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=brainco_cms \
  -p 5432:5432 \
  -d postgres:16
```

### 2. 创建数据库

如果您已经安装了 PostgreSQL，需要创建数据库：

```bash
# 连接到 PostgreSQL
psql -U postgres

# 在 psql 命令行中执行
CREATE DATABASE brainco_cms;
\q
```

### 3. 配置环境变量

编辑 `.env` 文件，根据您的实际配置修改以下参数：

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost        # 数据库主机
DATABASE_PORT=5432            # 数据库端口
DATABASE_NAME=brainco_cms     # 数据库名称
DATABASE_USERNAME=postgres    # 数据库用户名
DATABASE_PASSWORD=postgres    # 数据库密码（请修改为安全密码）
DATABASE_SSL=false            # 是否使用 SSL
DATABASE_SCHEMA=public        # 数据库 schema
```

**重要安全提示：**
- 请修改 `.env` 文件中的所有密钥（APP_KEYS, JWT_SECRET 等）
- 生产环境中请使用强密码
- 不要将 `.env` 文件提交到版本控制系统

### 4. 数据迁移

如果您之前使用 SQLite 并有数据需要迁移：

**方案 A：重新开始（推荐用于开发环境）**
```bash
# 直接启动，Strapi 会自动创建表结构
pnpm dev
```

**方案 B：导出导入数据**
```bash
# 1. 使用 SQLite 时导出数据
pnpm strapi export --file backup

# 2. 切换到 PostgreSQL 配置

# 3. 导入数据
pnpm strapi import --file backup.tar.gz
```

### 5. 启动应用

```bash
# 开发模式
pnpm dev

# 或生产模式
pnpm build
pnpm start
```

### 6. 验证连接

启动后，检查日志中是否有 PostgreSQL 连接成功的信息：

```
[INFO] Database connection established
```

## 🔍 常见问题

### 连接被拒绝
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**解决方案：** 确保 PostgreSQL 服务正在运行
```bash
# macOS with Homebrew
brew services start postgresql@16

# 或使用 Docker
docker start brainco-postgres
```

### 身份验证失败
```
Error: password authentication failed for user "postgres"
```
**解决方案：** 检查 `.env` 中的用户名和密码是否正确

### 数据库不存在
```
Error: database "brainco_cms" does not exist
```
**解决方案：** 创建数据库
```bash
psql -U postgres -c "CREATE DATABASE brainco_cms;"
```

### 权限不足
```
Error: permission denied to create database
```
**解决方案：** 确保用户有足够的权限
```sql
-- 在 psql 中执行
ALTER USER postgres CREATEDB;
```

## 📊 性能优化建议

### 连接池配置

如果需要调整连接池大小，可以在 `.env` 中添加：

```env
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_CONNECTION_TIMEOUT=60000
```

### 生产环境建议

1. **启用 SSL 连接**（如果数据库支持）
```env
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=true
```

2. **使用连接字符串**（简化配置）
```env
DATABASE_URL=postgresql://username:password@host:5432/dbname?sslmode=require
```

3. **定期备份**
```bash
# 创建备份
pg_dump -U postgres brainco_cms > backup.sql

# 恢复备份
psql -U postgres brainco_cms < backup.sql
```

## 📝 回滚到 SQLite

如果需要回滚到 SQLite：

1. 修改 `.env` 文件：
```env
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

2. 重启应用

## 🔗 相关资源

- [Strapi 数据库配置文档](https://docs.strapi.io/dev-docs/configurations/database)
- [PostgreSQL 官方文档](https://www.postgresql.org/docs/)
- [pg 包文档](https://node-postgres.com/)


