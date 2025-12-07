import express from "express"
import { SalesController } from "../controllers/salesController.js"

const router = express.Router()
const salesController = new SalesController()

// GET /api/sales - Get filtered and paginated sales data
router.get("/", (req, res) => salesController.getSales(req, res))

// GET /api/sales/filter-options - Get available filter options
router.get("/filter-options", (req, res) => salesController.getFilterOptions(req, res))

export default router

