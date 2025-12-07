import express from "express"
import cors from "cors"
import salesRoutes from "./routes/sales.js"
import { SalesService } from "./services/salesService.js"

const app = express()
const PORT = process.env.PORT || 5001

// CORS configuration - allow requests from frontend
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    // Allow localhost on any port
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true)
    }
    
    // Allow specific origins (including port 3001 if 3000 is in use)
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001']
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    
    // Also allow any localhost port for development
    if (origin.match(/^http:\/\/localhost:\d+$/)) {
      return callback(null, true)
    }
    
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Routes
app.use("/api/sales", salesRoutes)

// Pre-load CSV data on server startup to avoid first request delay
console.log("Sales Management System Backend starting...")
console.log("Pre-loading CSV data in background (this may take 30-60 seconds)...")

const salesService = new SalesService()

// Pre-load data in background (non-blocking) so server starts immediately
setImmediate(async () => {
  try {
    await salesService.preloadData()
    console.log("✅ CSV data pre-loaded successfully - server ready for requests!")
  } catch (error) {
    console.error("❌ Error pre-loading CSV data:", error.message)
    console.error("Data will load on first request (may cause delay)")
  }
})

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
