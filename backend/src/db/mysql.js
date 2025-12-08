import mysql from "mysql2/promise"

// Create a MySQL connection pool using environment variables
// Required env vars:
// - DB_HOST
// - DB_PORT (optional, default 3306)
// - DB_USER
// - DB_PASSWORD
// - DB_NAME

let pool

export function getDbPool() {
  if (!pool) {
    const {
      DB_HOST,
      DB_PORT,
      DB_USER,
      DB_PASSWORD,
      DB_NAME,
    } = process.env

    if (!DB_HOST || !DB_USER || !DB_NAME) {
      throw new Error("Database configuration missing. Please set DB_HOST, DB_USER and DB_NAME env variables.")
    }

    pool = mysql.createPool({
      host: DB_HOST,
      port: DB_PORT ? Number.parseInt(DB_PORT, 10) : 3306,
      user: DB_USER,
      password: DB_PASSWORD || "",
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }

  return pool
}
