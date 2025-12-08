// /backend/src/index.js
import express from 'express';
import cors from 'cors';
import salesRoutes from './routes/sales.js';
import { getDbPool } from './db/mysql.js';

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration - allow requests from frontend
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost on any port (for development)
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    
    // Allow Vercel preview and production URLs
    if (origin.includes('.vercel.app') || origin.includes('vercel.app')) {
      console.log(`✅ Allowing CORS for Vercel origin: ${origin}`);
      return callback(null, true);
    }
    
    // Allow production origins from environment variable
    if (allowedOrigins.length > 0 && allowedOrigins.includes(origin)) {
      console.log(`✅ Allowing CORS for configured origin: ${origin}`);
      return callback(null, true);
    }
    
    // In production, if no specific origins set, allow all (for now)
    if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
      console.log(`⚠️  Allowing CORS for origin (no restrictions): ${origin}`);
      return callback(null, true);
    }
    
    // Reject if in production with restrictions and origin not allowed
    if (process.env.NODE_ENV === 'production' && allowedOrigins.length > 0) {
      console.log(`❌ Rejecting CORS for origin: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    } else {
      // In development, allow all
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Test database connection
async function testDbConnection() {
  try {
    const pool = getDbPool();
    const [rows] = await pool.query('SELECT 1 as test');
    console.log('✅ Database connection test successful');
    return true;
  } catch (error) {
    if (error.message.includes('Database configuration missing')) {
      console.error('❌ Database configuration missing!');
      console.error('📝 Please add these environment variables in Render:');
      console.error('   1. DB_HOST (your MySQL host)');
      console.error('   2. DB_USER (your MySQL username)');
      console.error('   3. DB_PASSWORD (your MySQL password)');
      console.error('   4. DB_NAME (sales_management)');
      console.error('   5. DB_PORT (3306)');
      console.error('   6. NODE_ENV (production)');
      console.error('   7. PORT (10000)');
      console.error('   8. ALLOWED_ORIGINS (your frontend URL)');
      console.error('   Go to: Render Dashboard → Your Service → Environment');
    } else {
      console.error('❌ Database connection failed:', error.message);
    }
    return false;
  }
}

// Routes
app.use('/api/sales', salesRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbConnected = await testDbConnection();
    let salesCount = 0;
    
    if (dbConnected) {
      try {
        const [result] = await getDbPool().query('SELECT COUNT(*) as count FROM sales');
        salesCount = result[0].count;
      } catch (err) {
        console.error('Error counting sales:', err.message);
      }
    }
    
    const dataLoaded = dbConnected && salesCount > 0;
    
    res.json({
      status: 'ok',
      message: 'Sales Management System Backend',
      database: dbConnected ? 'connected' : 'disconnected',
      dataLoaded,
      salesCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      dataLoaded: false,
      timestamp: new Date().toISOString()
    });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await testDbConnection();
});

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

export default app;