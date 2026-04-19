import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

const db = connectionString ? neon(connectionString) : null;

export { db };

export function getDb() {
  if (!db) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return db;
}