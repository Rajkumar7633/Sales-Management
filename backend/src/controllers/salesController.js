import salesService from "../services/salesService.js"

export class SalesController {
  constructor() {
    this.salesService = salesService  // Use the imported instance
  }

  async getSales(req, res) {
    try {
      const {
        search = "",
        page = 1,
        pageSize = 10,
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

      // Helper to parse array from query string
      // Express automatically parses 'regions[]=value1&regions[]=value2' into an array
      // But also handles 'regions=value1,value2' or single values
      const parseArray = (value) => {
        if (!value) return [];
        if (Array.isArray(value)) return value.filter(v => v);
        if (typeof value === 'string') {
          // Handle comma-separated values
          return value.split(',').map(v => v.trim()).filter(v => v);
        }
        return [];
      };

      const result = await this.salesService.getFilteredSales({
        search: search.trim(),
        page: Number.parseInt(page) || 1,
        pageSize: Number.parseInt(pageSize) || 10,
        sortBy: sortBy || "date",
        sortOrder: sortOrder || "desc",
        regions: parseArray(regions),
        genders: parseArray(genders),
        ageRange: ageRange || "",
        categories: parseArray(categories),
        tags: parseArray(tags),
        paymentMethods: parseArray(paymentMethods),
        dateRange: dateRange || "",
      })

      res.json(result)
    } catch (error) {
      console.error("API Error:", error)
      res.status(500).json({ error: "Internal server error", message: error.message })
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