// /backend/src/db/mysql.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool = null;

export function getDbPool() {
  if (pool) {
    return pool;
  }

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD = '',
  DB_NAME,
  DB_PORT = '3306'
} = process.env;

  if (!DB_HOST || !DB_USER || !DB_NAME) {
    const missing = [];
    if (!DB_HOST) missing.push('DB_HOST');
    if (!DB_USER) missing.push('DB_USER');
    if (!DB_NAME) missing.push('DB_NAME');
    
    throw new Error(
      `Database configuration missing. Please set these environment variables in Render: ${missing.join(', ')}. ` +
      `Go to Render Dashboard → Your Service → Environment → Add Environment Variable`
    );
    }

    pool = mysql.createPool({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

  return pool;
}