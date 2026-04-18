import { neon } from '@neondatabase/serverless';

// 从环境变量获取数据库连接字符串
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const db = neon(connectionString);
