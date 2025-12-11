import { type NextRequest, NextResponse } from "next/server"
import { getSalesData } from "@/lib/data"
import { filterAndSortData } from "@/lib/filters"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Get query parameters
    const search = searchParams.get("search") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const sortBy = searchParams.get("sortBy") || "customerName"
    const sortOrder = searchParams.get("sortOrder")

    // Parse filter parameters
    const regions = searchParams.getAll("regions[]")
    const genders = searchParams.getAll("genders[]")
    const ageRange = searchParams.get("ageRange") || searchParams.get("ageRange[]") || ""
    const categories = searchParams.getAll("categories[]")
    const tags = searchParams.getAll("tags[]")
    const paymentMethods = searchParams.getAll("paymentMethods[]")
    const dateRange = searchParams.get("dateRange") || searchParams.get("dateRange[]") || ""

    // Get raw sales data
    const allData = await getSalesData()

    // Determine default sort order based on sortBy
    let defaultSortOrder = sortOrder as "asc" | "desc"
    if (!sortOrder || sortOrder === "undefined") {
      defaultSortOrder = sortBy === "customerName" ? "asc" : "desc"
    }

    // Apply filters and sorting
    const filtered = filterAndSortData(allData, {
      search,
      regions: regions.length > 0 ? regions : undefined,
      genders: genders.length > 0 ? genders : undefined,
      ageRange: ageRange || undefined,
      categories: categories.length > 0 ? categories : undefined,
      tags: tags.length > 0 ? tags : undefined,
      paymentMethods: paymentMethods.length > 0 ? paymentMethods : undefined,
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

    return NextResponse.json({
      data: paginatedData,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
      },
      metadata: {
        totalUnits: filtered.reduce((sum, item) => sum + item.Quantity, 0),
        totalAmount: filtered.reduce((sum, item) => sum + item["Total Amount"], 0),
        totalDiscount: filtered.reduce((sum, item) => sum + (item["Total Amount"] - item["Final Amount"]), 0),
      },
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
