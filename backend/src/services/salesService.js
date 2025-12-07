import { generateSalesData, getFilterOptions as getFilterOptionsFromData } from "./data.js"
import { filterAndSortData } from "../utils/filters.js"

export class SalesService {
  constructor() {
    this.salesData = null
  }

  getSalesData() {
    if (!this.salesData) {
      console.log("Initializing sales data from CSV...")
      const startTime = Date.now()
      this.salesData = generateSalesData()
      const loadTime = ((Date.now() - startTime) / 1000).toFixed(2)
      console.log(`✅ Sales data initialized: ${this.salesData.length} records in ${loadTime}s`)
    }
    return this.salesData
  }
  
  async preloadData() {
    return new Promise((resolve, reject) => {
      try {
        if (!this.salesData) {
          console.log("Pre-loading CSV data on server startup...")
          const startTime = Date.now()
          this.salesData = generateSalesData()
          const loadTime = ((Date.now() - startTime) / 1000).toFixed(2)
          console.log(`✅ Pre-loaded ${this.salesData.length} records in ${loadTime}s`)
        }
        resolve(this.salesData)
      } catch (error) {
        reject(error)
      }
    })
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
    const salesData = this.getSalesData()

    // Set default sort order based on sortBy
    const defaultSortOrder = sortOrder || (sortBy === "customerName" ? "asc" : "desc")

    // Convert single values to arrays if needed
    const regionsArray = regions ? (Array.isArray(regions) ? regions : [regions]) : []
    const gendersArray = genders ? (Array.isArray(genders) ? genders : [genders]) : []
    const categoriesArray = categories ? (Array.isArray(categories) ? categories : [categories]) : []
    const tagsArray = tags ? (Array.isArray(tags) ? tags : [tags]) : []
    const paymentMethodsArray = paymentMethods
      ? Array.isArray(paymentMethods)
        ? paymentMethods
        : [paymentMethods]
      : []

    // Apply filters and sorting
    const filtered = filterAndSortData(salesData, {
      search,
      regions: regionsArray.length > 0 ? regionsArray : undefined,
      genders: gendersArray.length > 0 ? gendersArray : undefined,
      ageRange: ageRange || undefined,
      categories: categoriesArray.length > 0 ? categoriesArray : undefined,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
      paymentMethods: paymentMethodsArray.length > 0 ? paymentMethodsArray : undefined,
      dateRange: dateRange || undefined,
      sortBy,
      sortOrder: defaultSortOrder,
    })

    // Apply pagination
    const pageSize = 10
    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / pageSize)
    const startIndex = (page - 1) * pageSize
    const paginatedData = filtered.slice(startIndex, startIndex + pageSize)

    return {
      data: paginatedData,
      pagination: {
        page: Number.parseInt(page),
        pageSize,
        totalItems,
        totalPages,
      },
      metadata: {
        totalUnits: filtered.reduce((sum, item) => sum + item.Quantity, 0),
        totalAmount: filtered.reduce((sum, item) => sum + item["Total Amount"], 0),
        totalDiscount: filtered.reduce((sum, item) => sum + (item["Total Amount"] - item["Final Amount"]), 0),
      },
    }
  }

  getFilterOptions() {
    const salesData = this.getSalesData()
    return getFilterOptionsFromData(salesData)
  }
}

