import Sales from "../models/Sales.js"

export class SalesController {
  constructor() {
    this.salesModel = Sales  // Use the MySQL-based Sales model
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

      // Get filtered sales data from MySQL
      const salesData = await this.salesModel.getFilteredSales({
        search: search.trim(),
        page: Number.parseInt(page) || 1,
        limit: Number.parseInt(pageSize) || 10,
        sortBy: sortBy || "date",
        sortOrder: sortOrder || "desc",
        regions: parseArray(regions),
        genders: parseArray(genders),
        ageRange: ageRange || "",
        categories: parseArray(categories),
        tags: parseArray(tags),
        paymentMethods: parseArray(paymentMethods),
        dateRange: dateRange || "",
      });

      // Get total count for pagination
      const total = await this.salesModel.getCount({
        search: search.trim(),
        regions: parseArray(regions),
        genders: parseArray(genders),
        ageRange: ageRange || "",
        categories: parseArray(categories),
        tags: parseArray(tags),
        paymentMethods: parseArray(paymentMethods),
        dateRange: dateRange || "",
      });

      // Get metadata (aggregations)
      const metadata = await this.salesModel.getMetadata({
        search: search.trim(),
        regions: parseArray(regions),
        genders: parseArray(genders),
        ageRange: ageRange || "",
        categories: parseArray(categories),
        tags: parseArray(tags),
        paymentMethods: parseArray(paymentMethods),
        dateRange: dateRange || "",
      });

      const currentPage = Number.parseInt(page) || 1;
      const limit = Number.parseInt(pageSize) || 10;

      res.json({
        data: salesData,
        pagination: {
          page: currentPage,
          limit: limit,
          total: total,
          totalPages: Math.ceil(total / limit)
        },
        aggregations: {
          totalSales: metadata.totalAmount || 0,
          totalItems: metadata.totalUnits || 0,
          avgOrderValue: salesData.length > 0 ? (metadata.totalAmount || 0) / salesData.length : 0
        }
      })
    } catch (error) {
      console.error("API Error:", error)
      res.status(500).json({ error: "Internal server error", message: error.message })
    }
  }

  async getFilterOptions(req, res) {
    try {
      const options = await this.salesModel.getFilterOptions()
      res.json(options)
    } catch (error) {
      console.error("Filter Options Error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  }
}