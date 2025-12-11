// /backend/src/index.js
import express from "express";
import cors from "cors";
import https from "https";
import http from "http";
import salesRoutes from "./routes/sales.js";
import { getDbPool } from "./db/mysql.js";

// Add DB keepalive wiring
import db from "./config/database.js";

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration - allow requests from frontend
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow localhost on any port (for development)
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }

      // Allow Vercel preview and production URLs
      if (origin.includes(".vercel.app") || origin.includes("vercel.app")) {
        console.log(`✅ Allowing CORS for Vercel origin: ${origin}`);
        return callback(null, true);
      }

      // Allow production origins from environment variable
      if (allowedOrigins.length > 0 && allowedOrigins.includes(origin)) {
        console.log(`✅ Allowing CORS for configured origin: ${origin}`);
        return callback(null, true);
      }

      // In production, if no specific origins set, allow all (for now)
      if (
        process.env.NODE_ENV === "production" &&
        allowedOrigins.length === 0
      ) {
        console.log(
          `⚠️  Allowing CORS for origin (no restrictions): ${origin}`
        );
        return callback(null, true);
      }

      // Reject if in production with restrictions and origin not allowed
      if (process.env.NODE_ENV === "production" && allowedOrigins.length > 0) {
        console.log(`❌ Rejecting CORS for origin: ${origin}`);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      } else {
        // In development, allow all
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Test database connection
async function testDbConnection() {
  try {
    const pool = getDbPool();
    const [rows] = await pool.query("SELECT 1 as test");
    console.log("✅ Database connection test successful");
    return true;
  } catch (error) {
    if (error.message.includes("Database configuration missing")) {
      console.error("❌ Database configuration missing!");
      console.error("📝 Please add these environment variables in Render:");
      console.error("   1. DB_HOST (your MySQL host)");
      console.error("   2. DB_USER (your MySQL username)");
      console.error("   3. DB_PASSWORD (your MySQL password)");
      console.error("   4. DB_NAME (sales_management)");
      console.error("   5. DB_PORT (3306)");
      console.error("   6. NODE_ENV (production)");
      console.error("   7. PORT (10000)");
      console.error("   8. ALLOWED_ORIGINS (your frontend URL)");
      console.error("   Go to: Render Dashboard → Your Service → Environment");
    } else {
      console.error("❌ Database connection failed:", error.message);
    }
    return false;
  }
}

// Routes
app.use("/api/sales", salesRoutes);

// Health check endpoint - tests MySQL connection
app.get("/api/health", async (req, res) => {
  try {
    // Test MySQL connection
    const pool = db.getPool();
    if (!pool) {
      return res.status(500).json({ ok: false, db: false, error: "Database pool not initialized" });
    }
    
    // Test query to MySQL
    const [rows] = await pool.query("SELECT 1 as test, DATABASE() as db_name, NOW() as server_time");
    
    // Check if sales table exists and get row count
    let tableInfo = null;
    try {
      const [tableCheck] = await pool.query(
        "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'sales'"
      );
      const tableExists = tableCheck[0].count > 0;
      
      if (tableExists) {
        const [[{ count }]] = await pool.query("SELECT COUNT(*) as count FROM sales");
        tableInfo = {
          exists: true,
          rowCount: count
        };
      } else {
        tableInfo = {
          exists: false,
          rowCount: 0
        };
      }
    } catch (tableErr) {
      tableInfo = { error: tableErr.message };
    }
    
    return res.json({ 
      ok: true, 
      db: true,
      database: rows[0].db_name,
      serverTime: rows[0].server_time,
      table: tableInfo
    });
  } catch (err) {
    console.error("Health check DB error:", err.message || err);
    return res.status(500).json({ 
      ok: false, 
      db: false, 
      error: "MySQL connection failed",
      message: err.message 
    });
  }
});

// Self-ping mechanism to keep Render free tier alive
let keepAliveInterval = null;

function startKeepAlivePing() {
  // Only run in production (on Render)
  if (process.env.NODE_ENV !== "production") {
    console.log("⏭️  Skipping keep-alive ping (not in production)");
    return;
  }

  // Get the Render service URL from environment
  // RENDER_EXTERNAL_URL is automatically provided by Render
  const renderUrl = process.env.RENDER_EXTERNAL_URL || process.env.RENDER_SERVICE_URL;
  
  if (!renderUrl) {
    console.log("⚠️  RENDER_EXTERNAL_URL not set, keep-alive ping disabled");
    console.log("💡 Render should automatically provide RENDER_EXTERNAL_URL");
    return;
  }

  const healthCheckUrl = `${renderUrl}/api/health`;
  const pingInterval = 30 * 1000; // 30 seconds

  console.log(`🔄 Starting keep-alive ping every 30 seconds to: ${healthCheckUrl}`);

  // Ping immediately on start
  pingHealthEndpoint(healthCheckUrl);

  // Then ping every 30 seconds
  keepAliveInterval = setInterval(() => {
    pingHealthEndpoint(healthCheckUrl);
  }, pingInterval);
}

async function pingHealthEndpoint(url) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === "https:";
      const client = isHttps ? https : http;

      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (isHttps ? 443 : 80),
        path: urlObj.pathname,
        method: "GET",
        headers: {
          "User-Agent": "Render-KeepAlive/1.0",
        },
        timeout: 10000, // 10 second timeout
      };

      const req = client.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          if (res.statusCode === 200) {
            console.log(`✅ Keep-alive ping successful: ${new Date().toISOString()}`);
          } else {
            console.log(`⚠️  Keep-alive ping returned status: ${res.statusCode}`);
          }
          resolve();
        });
      });

      req.on("error", (error) => {
        console.log(`⚠️  Keep-alive ping failed: ${error.message}`);
        resolve();
      });

      req.on("timeout", () => {
        req.destroy();
        console.log(`⏱️  Keep-alive ping timeout (server may be starting)`);
        resolve();
      });

      req.end();
    } catch (error) {
      console.log(`⚠️  Keep-alive ping error: ${error.message}`);
      resolve();
    }
  });
}

function stopKeepAlivePing() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
    console.log("🛑 Stopped keep-alive ping");
  }
}

// Start server
async function startServer() {
  // Initialize DB pool and start keepalive
  console.log('🔄 Initializing MySQL database connection...');
  console.log(`📊 Database config: ${process.env.DB_HOST ? 'Host: ' + process.env.DB_HOST : 'DB_HOST not set'}, ${process.env.DB_NAME ? 'Database: ' + process.env.DB_NAME : 'DB_NAME not set'}`);
  
  await db.initPool();
  db.startKeepAlive(60_000); // ping every 60s

  // Test database connection and show table info
  try {
    const pool = db.getPool();
    if (pool) {
      // Check if sales table exists and get row count
      const [tableCheck] = await pool.query(
        "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'sales'"
      );
      const tableExists = tableCheck[0].count > 0;
      
      if (tableExists) {
        const [[{ count }]] = await pool.query("SELECT COUNT(*) as count FROM sales");
        console.log(`✅ MySQL connected! Sales table exists with ${count} records.`);
      } else {
        console.log(`⚠️  MySQL connected, but 'sales' table does not exist. Please import your data.`);
      }
    }
  } catch (dbErr) {
    console.error('❌ Database connection test failed:', dbErr.message);
  }

  // Start the Express server
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints:`);
    console.log(`   - GET /api/health - Health check`);
    console.log(`   - GET /api/sales - Get sales data`);
    console.log(`   - GET /api/sales/filter-options - Get filter options`);
    console.log(`   - GET /api/sales/test - Test database connection`);
    
    // Start keep-alive ping after server is ready
    // Wait a bit for server to fully initialize
    setTimeout(() => {
      startKeepAlivePing();
    }, 5000); // Wait 5 seconds after server starts
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log("Shutting down...");
    stopKeepAlivePing();
    try {
      db.stopKeepAlive();
    } catch (e) {}
    try {
      await db.getPool()?.end();
    } catch (e) {}
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  // Try to recover from unhandled errors by reinitializing pool
  process.on("unhandledRejection", async (err) => {
    console.error("Unhandled Rejection:", err);
    try {
      await db.initPool();
    } catch (e) {}
  });
  process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
    try {
      await db.initPool();
    } catch (e) {}
  });
}

startServer().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});

// Error handling
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  process.exit(1);
});

export default app;
