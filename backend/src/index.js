import express from "express"
import cors from "cors"
import salesRoutes from "./routes/sales.js"
import { SalesService } from "./services/salesService.js"

const app = express()
const PORT = process.env.PORT || 5001

// CORS configuration - allow requests from frontend
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : []

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    // Allow localhost on any port (for development)
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true)
    }
    
    // Allow specific localhost origins
    const localOrigins = ['http://localhost:3000', 'http://localhost:3001']
    if (localOrigins.includes(origin)) {
      return callback(null, true)
    }
    
    // Allow any localhost port for development
    if (origin.match(/^http:\/\/localhost:\d+$/)) {
      return callback(null, true)
    }
    
    // Allow Vercel preview and production URLs (check this FIRST)
    if (origin.includes('.vercel.app') || origin.includes('vercel.app')) {
      console.log(`✅ Allowing CORS for Vercel origin: ${origin}`)
      return callback(null, true)
    }
    
    // Allow production origins from environment variable
    if (allowedOrigins.length > 0 && allowedOrigins.includes(origin)) {
      console.log(`✅ Allowing CORS for configured origin: ${origin}`)
      return callback(null, true)
    }
    
    // In production, if no specific origins set, allow all (for now)
    if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
      console.log(`⚠️  Allowing CORS for origin (no restrictions): ${origin}`)
      return callback(null, true)
    }
    
    // Reject if in production with restrictions and origin not allowed
    if (process.env.NODE_ENV === 'production' && allowedOrigins.length > 0) {
      console.log(`❌ Rejecting CORS for origin: ${origin}`)
      callback(new Error(`Origin ${origin} not allowed by CORS`))
    } else {
      // In development, allow all
      callback(null, true)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Routes
app.use("/api/sales", salesRoutes)

// Don't pre-load CSV on startup for Render free tier (512MB limit)
// Load data on first request instead to avoid memory issues
console.log("Sales Management System Backend starting...")
console.log("⚠️  CSV data will load on first request (to save memory on Render free tier)")

const salesService = new SalesService()

// Note: We're NOT pre-loading data to avoid memory issues on Render free tier
// Data will load lazily on first API request

// Health check endpoint
app.get("/api/health", (req, res) => {
  const isDataLoaded = salesService.getSalesData() !== null
  res.json({ 
    status: "ok", 
    message: "Sales Management System Backend",
    dataLoaded: isDataLoaded
  })
})

const server = app.listen(PORT, () => {
  console.log(`Sales Management System Backend running on http://localhost:${PORT}`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use!`)
    console.error(`\nTo fix this, you can:`)
    console.error(`1. Kill the process using port ${PORT}:`)
    console.error(`   lsof -ti:${PORT} | xargs kill -9`)
    console.error(`\n2. Or use a different port:`)
    console.error(`   PORT=5001 npm run dev`)
    console.error(`\n3. Or find what's using the port:`)
    console.error(`   lsof -i:${PORT}`)
    process.exit(1)
  } else {
    throw err
  }
})
