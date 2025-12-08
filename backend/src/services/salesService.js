import { getDbPool } from "../db/mysql.js"

export class SalesService {
  constructor() {
    this.pool = getDbPool()
  }

  async getFilteredSales({
    search,
    page,
    sortBy,
    sortOrder,
    regions,
    genders,
    ageRange,
    categories,
    tags,
    paymentMethods,
    dateRange,
  }) {
    const pageSize = 10
    const offset = (page - 1) * pageSize

    const whereClauses = []
    const params = []

    // Search by customer name or phone number
    if (search) {
      whereClauses.push("(customer_name LIKE ? OR phone_number LIKE ?)")
      const like = `%${search}%`
      params.push(like, like)
    }

    // Regions
    const regionsArray = this.normalizeToArray(regions)
    if (regionsArray.length > 0) {
      whereClauses.push(`customer_region IN (${regionsArray.map(() => "?").join(",")})`)
      params.push(...regionsArray)
    }

    // Genders
    const gendersArray = this.normalizeToArray(genders)
    if (gendersArray.length > 0) {
      whereClauses.push(`gender IN (${gendersArray.map(() => "?").join(",")})`)
      params.push(...gendersArray)
    }

    // Categories
    const categoriesArray = this.normalizeToArray(categories)
    if (categoriesArray.length > 0) {
      whereClauses.push(`product_category IN (${categoriesArray.map(() => "?").join(",")})`)
      params.push(...categoriesArray)
    }

    // Tags (exact match; could be improved to LIKE search if needed)
    const tagsArray = this.normalizeToArray(tags)
    if (tagsArray.length > 0) {
      whereClauses.push(`tags IN (${tagsArray.map(() => "?").join(",")})`)
      params.push(...tagsArray)
    }

    // Payment methods
    const paymentMethodsArray = this.normalizeToArray(paymentMethods)
    if (paymentMethodsArray.length > 0) {
      whereClauses.push(`payment_method IN (${paymentMethodsArray.map(() => "?").join(",")})`)
      params.push(...paymentMethodsArray)
    }

    // Age range
    if (ageRange) {
      if (ageRange === "56+") {
        whereClauses.push("age >= 56")
      } else {
        const [minAge, maxAge] = ageRange.split("-").map(Number)
        whereClauses.push("age BETWEEN ? AND ?")
        params.push(minAge, maxAge)
      }
    }

    // Date range (expects "YYYY-MM-DD,YYYY-MM-DD")
    if (dateRange) {
      const [startDate, endDate] = dateRange.split(",")
      if (startDate && endDate) {
        whereClauses.push("date BETWEEN ? AND ?")
        params.push(startDate, endDate)
      }
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : ""

    // Sorting
    const sortColumn = this.getSortColumn(sortBy)
    const finalSortOrder = (sortOrder || (sortBy === "customerName" ? "asc" : "desc")).toUpperCase() === "ASC" ? "ASC" : "DESC"
    const orderSql = `ORDER BY ${sortColumn} ${finalSortOrder}`

    // Total count and aggregates
    const countSql = `
      SELECT
        COUNT(*) as totalItems,
        COALESCE(SUM(quantity), 0) as totalUnits,
        COALESCE(SUM(total_amount), 0) as totalAmount,
        COALESCE(SUM(total_amount - final_amount), 0) as totalDiscount
      FROM sales_transactions
      ${whereSql}
    `

    const [countRows] = await this.pool.query(countSql, params)
    const { totalItems, totalUnits, totalAmount, totalDiscount } = countRows[0]

    const totalPages = Math.ceil(totalItems / pageSize) || 1

    // Page data
    const dataSql = `
      SELECT
        transaction_id AS "Transaction ID",
        date AS Date,
        customer_id AS "Customer ID",
        customer_name AS "Customer name",
        phone_number AS "Phone Number",
        gender AS Gender,
        age AS Age,
        customer_region AS "Customer region",
        customer_type AS "Customer Type",
        product_id AS "Product ID",
        product_name AS "Product Name",
        brand AS Brand,
        product_category AS "Product Category",
        tags AS Tags,
        quantity AS Quantity,
        price_per_unit AS "Price per Unit",
        discount_percentage AS "Discount Percentage",
        total_amount AS "Total Amount",
        final_amount AS "Final Amount",
        payment_method AS "Payment Method",
        order_status AS "Order Status",
        delivery_type AS "Delivery Type",
        store_id AS "Store ID",
        store_location AS "Store Location",
        salesperson_id AS "Salesperson ID",
        employee_name AS "Employee name"
      FROM sales_transactions
      ${whereSql}
      ${orderSql}
      LIMIT ? OFFSET ?
    `

    const dataParams = [...params, pageSize, offset]
    const [rows] = await this.pool.query(dataSql, dataParams)

    return {
      data: rows,
      pagination: {
        page: Number.parseInt(page, 10),
        pageSize,
        totalItems,
        totalPages,
      },
      metadata: {
        totalUnits,
        totalAmount,
        totalDiscount,
      },
    }
  }

  async getFilterOptions() {
    const queries = [
      "SELECT DISTINCT customer_region FROM sales_transactions WHERE customer_region IS NOT NULL AND customer_region <> '' ORDER BY customer_region",
      "SELECT DISTINCT gender FROM sales_transactions WHERE gender IS NOT NULL AND gender <> '' ORDER BY gender",
      "SELECT DISTINCT product_category FROM sales_transactions WHERE product_category IS NOT NULL AND product_category <> '' ORDER BY product_category",
      "SELECT DISTINCT tags FROM sales_transactions WHERE tags IS NOT NULL AND tags <> '' ORDER BY tags",
      "SELECT DISTINCT payment_method FROM sales_transactions WHERE payment_method IS NOT NULL AND payment_method <> '' ORDER BY payment_method",
    ]

    const [regionsRows, gendersRows, categoriesRows, tagsRows, paymentRows] = await Promise.all(
      queries.map((q) => this.pool.query(q).then(([rows]) => rows)),
    )

    return {
      regions: regionsRows.map((r) => r.customer_region),
      genders: gendersRows.map((g) => g.gender),
      ageRanges: ["18-25", "26-35", "36-45", "46-55", "56+"],
      categories: categoriesRows.map((c) => c.product_category),
      tags: tagsRows.map((t) => t.tags),
      paymentMethods: paymentRows.map((p) => p.payment_method),
      dateRanges: ["Last 7 days", "Last 30 days", "Last 90 days", "Last year"],
    }
  }

  normalizeToArray(value) {
    if (!value) return []
    if (Array.isArray(value)) return value
    return [value]
  }

  getSortColumn(sortBy) {
    switch (sortBy) {
      case "date":
        return "date"
      case "quantity":
        return "quantity"
      case "customerName":
        return "customer_name"
      default:
        return "date"
    }
  }
}

