import express from "express"
import { SalesController } from "../controllers/salesController.js"
import Sales from "../models/Sales.js"

const router = express.Router()
const salesController = new SalesController()

// GET /api/sales - Get filtered and paginated sales data
router.get("/", (req, res) => salesController.getSales(req, res))

// GET /api/sales/filter-options - Get available filter options
router.get("/filter-options", (req, res) => salesController.getFilterOptions(req, res))

// GET /api/sales/test - Test database connection and data
router.get("/test", async (req, res) => {
  try {
    const result = await Sales.testConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      connected: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
})

export default router

