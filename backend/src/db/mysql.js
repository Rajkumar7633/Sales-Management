// /backend/src/db/mysql.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD = '',
  DB_NAME,
  DB_PORT = '3306'
} = process.env;

let pool;

export function getDbPool() {
  if (!pool) {
    if (!DB_HOST || !DB_USER || !DB_NAME) {
      throw new Error("Database configuration missing. Please set DB_HOST, DB_USER, and DB_NAME env variables.");
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
  }

  return pool;
}

export default getDbPool();