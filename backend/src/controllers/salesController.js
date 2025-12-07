import { SalesService } from "../services/salesService.js"

// Singleton instance to share data across requests
let salesServiceInstance = null

function getSalesService() {
  if (!salesServiceInstance) {
    salesServiceInstance = new SalesService()
  }
  return salesServiceInstance
}

export class SalesController {
  constructor() {
    this.salesService = getSalesService()
  }

  async getSales(req, res) {
    try {
      const {
        search = "",
        page = 1,
        sortBy = "date",
        sortOrder,
        regions,
        genders,
        ageRange,
        categories,
        tags,
        paymentMethods,
        dateRange,
      } = req.query

      const result = await this.salesService.getFilteredSales({
        search,
        page: Number.parseInt(page),
        sortBy,
        sortOrder,
        regions,
        genders,
        ageRange,
        categories,
        tags,
        paymentMethods,
        dateRange,
      })

      res.json(result)
    } catch (error) {
      console.error("API Error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  }

  async getFilterOptions(req, res) {
    try {
      const options = await this.salesService.getFilterOptions()
      res.json(options)
    } catch (error) {
      console.error("Filter Options Error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  }
}

