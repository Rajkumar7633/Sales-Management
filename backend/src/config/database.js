import mysql from "mysql2/promise";

let pool = null;
let keepAliveTimer = null;

function createPoolFromEnv() {
  // ...existing code may set env vars...
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

  return mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT ? Number(DB_PORT) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
    // mysql2 lower-level keepAlive handled by pool pings below
  });
}

export async function initPool() {
  // close existing pool if present
  if (pool) {
    try {
      await pool.end();
    } catch (e) {
      /* ignore */
    }
    pool = null;
  }
  pool = createPoolFromEnv();
  // test a connection
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log("✅ DB pool initialized");
  } catch (err) {
    console.error("❌ DB pool init failed:", err.message || err);
    // leave pool assigned so subsequent retries can reuse init logic
  }
}

export async function getConnection() {
  if (!pool) await initPool();
  return pool.getConnection();
}

export function getPool() {
  return pool;
}

export function startKeepAlive(intervalMs = 60_000) {
  if (keepAliveTimer) return;
  keepAliveTimer = setInterval(async () => {
    try {
      if (!pool) await initPool();
      const conn = await pool.getConnection();
      await conn.query("SELECT 1");
      conn.release();
      // console.log("DB keepAlive OK");
    } catch (err) {
      console.error(
        "DB keepAlive failed, reinitializing pool:",
        err.message || err
      );
      try {
        await initPool();
      } catch (e) {
        /* ignore */
      }
    }
  }, intervalMs);
  // allow process to exit if nothing else is keeping it alive
  if (keepAliveTimer.unref) keepAliveTimer.unref();
}

export function stopKeepAlive() {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}

export default {
  initPool,
  getConnection,
  getPool,
  startKeepAlive,
  stopKeepAlive,
};
