// /backend/src/index.js
import express from "express";
import cors from "cors";
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

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    // try a lightweight DB check if pool exists
    const pool = db.getPool();
    if (pool) {
      const [rows] = await pool.query("SELECT 1");
      // ignore rows, just ensure query runs
    }
    return res.json({ ok: true, db: !!pool });
  } catch (err) {
    console.error("Health check DB error:", err.message || err);
    return res.status(500).json({ ok: false, error: "DB check failed" });
  }
});

// Start server
async function startServer() {
  // Initialize DB pool and start keepalive
  await db.initPool();
  db.startKeepAlive(60_000); // ping every 60s

  // Start the Express server
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log("Shutting down...");
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
