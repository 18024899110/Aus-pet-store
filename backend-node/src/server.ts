import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import config from './config';
import sequelize from './db';
import routes from './routes';

const app = express();

// 中间件
app.use(cors({
  origin: config.cors.origin.split(','),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 静态文件服务
app.use('/static', express.static(path.join(__dirname, '../static')));

// API 路由
app.use(`/api/${config.apiVersion}`, routes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 根路由
app.get('/', (req, res) => {
  res.json({
    message: 'CY Pet Store API',
    version: config.apiVersion,
    docs: `/api/${config.apiVersion}/docs`,
  });
});

// 错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    detail: err.message || 'Internal server error',
  });
});

// 启动服务器
const startServer = async () => {
  try {
    // 连接数据库
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    // 同步数据库模型
    await sequelize.sync({ alter: config.env === 'development' });
    console.log('✅ Database models synchronized');

    // 启动 HTTP 服务器
    const server = app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📍 API URL: http://localhost:${config.port}/api/${config.apiVersion}`);
      console.log(`🌍 Environment: ${config.env}`);
    });

    // 优雅关闭
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(async () => {
        await sequelize.close();
        console.log('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
