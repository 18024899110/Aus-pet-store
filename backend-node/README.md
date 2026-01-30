# CY Pet Store Backend - Node.js

基于 Node.js + Express + TypeScript + Sequelize 的宠物商店后端 API。

## 技术栈

- **Node.js** - 运行环境
- **Express** - Web 框架
- **TypeScript** - 类型安全
- **Sequelize** - ORM 数据库框架
- **SQLite/MySQL/PostgreSQL** - 数据库支持
- **JWT** - 身份认证
- **Bcrypt** - 密码加密

## 项目结构

```
backend-node/
├── src/
│   ├── config/          # 配置文件
│   ├── controllers/     # 控制器
│   ├── db/              # 数据库连接
│   ├── middleware/      # 中间件
│   ├── models/          # 数据模型
│   ├── routes/          # 路由
│   ├── scripts/         # 脚本
│   ├── utils/           # 工具函数
│   └── server.ts        # 服务器入口
├── static/              # 静态文件
├── package.json
├── tsconfig.json
└── .env                 # 环境变量
```

## 快速开始

### 1. 安装依赖

```bash
cd backend-node
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并根据需要修改：

```bash
cp .env.example .env
```

### 3. 初始化数据库

```bash
npm run init-db
```

这将创建：
- 数据库表结构
- 管理员账户（admin@example.com / admin）
- 示例分类和产品数据

### 4. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:8000` 启动。

### 5. 生产环境部署

```bash
npm run build
npm start
```

## API 端点

### 认证
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录

### 用户
- `GET /api/v1/users/me` - 获取当前用户信息
- `PUT /api/v1/users/me` - 更新当前用户信息
- `GET /api/v1/users` - 获取所有用户（仅管理员）
- `GET /api/v1/users/:id` - 获取指定用户（仅管理员）

### 产品
- `GET /api/v1/products` - 获取产品列表
- `GET /api/v1/products/:id` - 获取单个产品
- `POST /api/v1/products` - 创建产品（仅管理员）
- `PUT /api/v1/products/:id` - 更新产品（仅管理员）
- `DELETE /api/v1/products/:id` - 删除产品（仅管理员）

### 分类
- `GET /api/v1/categories` - 获取分类列表
- `GET /api/v1/categories/:id` - 获取单个分类
- `POST /api/v1/categories` - 创建分类（仅管理员）
- `PUT /api/v1/categories/:id` - 更新分类（仅管理员）
- `DELETE /api/v1/categories/:id` - 删除分类（仅管理员）

### 购物车
- `GET /api/v1/cart` - 获取购物车
- `POST /api/v1/cart` - 添加到购物车
- `PUT /api/v1/cart/:id` - 更新购物车项目
- `DELETE /api/v1/cart/:id` - 删除购物车项目
- `DELETE /api/v1/cart` - 清空购物车

### 订单
- `GET /api/v1/orders` - 获取订单列表
- `GET /api/v1/orders/:id` - 获取单个订单
- `POST /api/v1/orders` - 创建订单
- `PUT /api/v1/orders/:id/status` - 更新订单状态（仅管理员）
- `DELETE /api/v1/orders/:id` - 取消订单

## 数据库

支持三种数据库：

### SQLite（默认）
```env
DATABASE_URL=sqlite:./cypetstore.db
```

### MySQL
```env
DATABASE_URL=mysql://user:password@localhost:3306/cypetstore
```

### PostgreSQL
```env
DATABASE_URL=postgres://user:password@localhost:5432/cypetstore
```

## 开发脚本

- `npm run dev` - 启动开发服务器（支持热重载）
- `npm run build` - 构建生产版本
- `npm start` - 启动生产服务器
- `npm run init-db` - 初始化数据库
- `npm run create-admin` - 创建管理员账户

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| NODE_ENV | 运行环境 | development |
| PORT | 服务器端口 | 8000 |
| DATABASE_URL | 数据库连接字符串 | sqlite:./cypetstore.db |
| JWT_SECRET | JWT 密钥 | your-secret-key |
| JWT_EXPIRES_IN | JWT 过期时间 | 8d |
| CORS_ORIGIN | 允许的跨域来源 | http://localhost:3001 |
| ADMIN_EMAIL | 管理员邮箱 | admin@example.com |
| ADMIN_PASSWORD | 管理员密码 | admin |

## 许可证

MIT
