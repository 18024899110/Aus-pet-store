# 澳洲宠物用品商店 (AuPets)

一个完整的宠物用品电商网站，包含前端React应用和后端Python FastAPI服务。

## 项目结构

```
Au_shop/
├── frontend/             # React前端
│   ├── public/           # 静态文件
│   └── src/              # 源代码
│       ├── assets/       # 资源文件
│       ├── components/   # 组件
│       ├── context/      # 上下文
│       └── pages/        # 页面
└── backend/              # Python FastAPI后端
    ├── app/              # 应用代码
    │   ├── api/          # API路由
    │   ├── core/         # 核心配置
    │   ├── db/           # 数据库
    │   ├── models/       # 数据模型
    │   ├── schemas/      # Pydantic模式
    │   └── utils/        # 工具函数
    └── static/           # 静态文件
```

## 功能特点

- 响应式设计，适配各种设备
- 用户注册和登录系统
- 商品浏览和搜索
- 商品分类
- 购物车功能
- 结账流程
- 订单管理
- 管理员后台

## 技术栈

### 前端

- React
- React Router
- Bootstrap
- Axios
- Context API

### 后端

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT认证

## 安装和运行

### 前端

```bash
cd frontend
npm install
npm start
```

### 后端

```bash
cd backend
pip install -r requirements.txt
python run.py
```

## API文档

启动后端服务后，可以访问 `http://localhost:8000/docs` 查看API文档。

## 测试账户

- 管理员: admin@example.com / admin
- 测试用户: test@example.com / password 