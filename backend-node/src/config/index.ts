import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

interface Config {
  env: string;
  port: number;
  apiVersion: string;
  database: {
    url: string;
    dialect: 'sqlite' | 'mysql' | 'postgres';
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  cors: {
    origin: string;
  };
  upload: {
    dir: string;
    maxSize: number;
  };
  admin: {
    email: string;
    password: string;
    name: string;
  };
}

const getDatabaseDialect = (url: string): 'sqlite' | 'mysql' | 'postgres' => {
  if (url.startsWith('sqlite:')) return 'sqlite';
  if (url.startsWith('mysql:')) return 'mysql';
  if (url.startsWith('postgres:')) return 'postgres';
  return 'sqlite';
};

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '8000', 10),
  apiVersion: process.env.API_VERSION || 'v1',
  database: {
    url: process.env.DATABASE_URL || 'sqlite:./cypetstore.db',
    dialect: getDatabaseDialect(process.env.DATABASE_URL || 'sqlite:./cypetstore.db'),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-this',
    expiresIn: process.env.JWT_EXPIRES_IN || '8d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  },
  upload: {
    dir: process.env.UPLOAD_DIR || 'static/images/products',
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'admin',
    name: process.env.ADMIN_NAME || 'Admin User',
  },
};

export default config;
