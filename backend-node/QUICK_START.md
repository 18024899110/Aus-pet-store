# 快速启动指南

## 第一步：安装依赖

在 `backend-node` 目录下运行：

```bash
npm install
```

## 第二步：初始化数据库

```bash
npm run init-db
```

这将创建数据库并添加示例数据。

**默认管理员账户：**
- 邮箱：admin@example.com
- 密码：admin

## 第三步：启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:8000` 启动。

## 第四步：测试 API

### 测试登录

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin@example.com",
    "password": "admin"
  }'
```

### 测试获取产品

```bash
curl http://localhost:8000/api/v1/products
```

## 前后端连接

确保前端的 API 配置指向 `http://localhost:8000`。

前端应该已经配置为使用 `/api/v1` 作为基础路径。

## 常见问题

### 端口被占用

如果 8000 端口已被占用，修改 `.env` 文件中的 `PORT` 值。

### 数据库错误

删除 `cypetstore.db` 文件，然后重新运行 `npm run init-db`。

### CORS 错误

检查 `.env` 文件中的 `CORS_ORIGIN` 是否包含前端的 URL（默认 http://localhost:3001）。

## 切换数据库

### 使用 MySQL

1. 安装 MySQL
2. 创建数据库：`CREATE DATABASE cypetstore;`
3. 修改 `.env`：
   ```
   DATABASE_URL=mysql://root:password@localhost:3306/cypetstore
   ```
4. 运行 `npm run init-db`

### 使用 PostgreSQL

1. 安装 PostgreSQL
2. 创建数据库：`CREATE DATABASE cypetstore;`
3. 修改 `.env`：
   ```
   DATABASE_URL=postgres://postgres:password@localhost:5432/cypetstore
   ```
4. 运行 `npm run init-db`

## 下一步

查看 [README.md](README.md) 了解完整的 API 文档和功能说明。
