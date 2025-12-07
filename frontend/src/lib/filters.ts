export interface FilterOptions {
  search?: string
  regions?: string[]
  genders?: string[]
  ageRange?: string
  categories?: string[]
  tags?: string[]
  paymentMethods?: string[]
  dateRange?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export function filterAndSortData(data: any[], filters: FilterOptions) {
  let filtered = [...data]

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        (item["Customer name"] && item["Customer name"].toLowerCase().includes(searchLower)) ||
        (item["Phone Number"] && item["Phone Number"].toLowerCase().includes(searchLower)),
    )
  }

  // Apply region filter
  if (filters.regions && filters.regions.length > 0) {
    filtered = filtered.filter((item) => filters.regions!.includes(item["Customer region"]))
  }

  // Apply gender filter
  if (filters.genders && filters.genders.length > 0) {
    filtered = filtered.filter((item) => filters.genders!.includes(item["Gender"]))
  }

  // Apply age range filter
  if (filters.ageRange) {
    if (filters.ageRange === "56+") {
      filtered = filtered.filter((item) => item["Age"] >= 56)
    } else {
      const [minAge, maxAge] = filters.ageRange.split("-").map(Number)
      filtered = filtered.filter((item) => item["Age"] >= minAge && item["Age"] <= maxAge)
    }
  }

  // Apply product category filter
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter((item) => filters.categories!.includes(item["Product Category"]))
  }

  // Apply tags filter
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((item) => filters.tags!.includes(item["Tags"]))
  }

  // Apply payment method filter
  if (filters.paymentMethods && filters.paymentMethods.length > 0) {
    filtered = filtered.filter((item) => filters.paymentMethods!.includes(item["Payment Method"]))
  }

  // Apply date range filter
  if (filters.dateRange) {
    const [startDate, endDate] = filters.dateRange.split(",")
    filtered = filtered.filter((item) => item["Date"] >= startDate && item["Date"] <= endDate)
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aVal: any
    let bVal: any

    switch (filters.sortBy) {
      case "date":
        aVal = new Date(a["Date"]).getTime()
        bVal = new Date(b["Date"]).getTime()
        break
      case "quantity":
        aVal = a["Quantity"]
        bVal = b["Quantity"]
        break
      case "customerName":
        aVal = (a["Customer name"] || "").toLowerCase()
        bVal = (b["Customer name"] || "").toLowerCase()
        break
      default:
        return 0
    }

    if (filters.sortOrder === "asc") {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
    }
  })

  return filtered
}

// Helper to extract unique values for filter dropdowns
export function getFilterOptions(data: any[]) {
  return {
    regions: [...new Set(data.map((d) => d["Customer region"]))].sort(),
    genders: [...new Set(data.map((d) => d["Gender"]))].sort(),
    categories: [...new Set(data.map((d) => d["Product Category"]))].sort(),
    tags: [...new Set(data.map((d) => d["Tags"]))].sort(),
    paymentMethods: [...new Set(data.map((d) => d["Payment Method"]))].sort(),
    ageRanges: ["18-25", "26-35", "36-45", "46-55", "56+"],
  }
}
