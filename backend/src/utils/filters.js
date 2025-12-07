export function filterAndSortData(data, filters) {
  let filtered = data

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        (item["Customer name"] && item["Customer name"].toLowerCase().includes(searchLower)) ||
        (item["Phone Number"] && item["Phone Number"].toLowerCase().includes(searchLower)),
    )
  }

  // Region filter
  if (filters.regions && filters.regions.length > 0) {
    filtered = filtered.filter((item) => filters.regions.includes(item["Customer region"]))
  }

  // Gender filter
  if (filters.genders && filters.genders.length > 0) {
    filtered = filtered.filter((item) => filters.genders.includes(item.Gender))
  }

  // Category filter
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter((item) => filters.categories.includes(item["Product Category"]))
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((item) => filters.tags.includes(item.Tags))
  }

  // Payment method filter
  if (filters.paymentMethods && filters.paymentMethods.length > 0) {
    filtered = filtered.filter((item) => filters.paymentMethods.includes(item["Payment Method"]))
  }

  // Age range filter
  if (filters.ageRange) {
    if (filters.ageRange === "56+") {
      filtered = filtered.filter((item) => item.Age >= 56)
    } else {
      const [minAge, maxAge] = filters.ageRange.split("-").map(Number)
      filtered = filtered.filter((item) => item.Age >= minAge && item.Age <= maxAge)
    }
  }

  // Date range filter
  if (filters.dateRange) {
    const [startDate, endDate] = filters.dateRange.split(",")
    filtered = filtered.filter((item) => item.Date >= startDate && item.Date <= endDate)
  }

  // Sorting
  filtered.sort((a, b) => {
    let compareValue = 0

    switch (filters.sortBy) {
      case "date":
        compareValue = new Date(a.Date) - new Date(b.Date)
        break
      case "quantity":
        compareValue = a.Quantity - b.Quantity
        break
      case "customerName":
        compareValue = (a["Customer name"] || "").localeCompare(b["Customer name"] || "")
        break
      default:
        compareValue = 0
    }

    return filters.sortOrder === "asc" ? compareValue : -compareValue
  })

  return filtered
}
