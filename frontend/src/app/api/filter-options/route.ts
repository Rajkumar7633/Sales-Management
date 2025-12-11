import { NextResponse } from "next/server"

// Proxy to backend API for filter options from AWS MySQL
export async function GET() {
  try {
    // Get backend URL from environment or use default
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://sales-management-backend-noas.onrender.com"
    const backendApiUrl = `${backendUrl}/api/sales/filter-options`

    console.log("🔄 Proxying filter options request to backend:", backendApiUrl)

    // Fetch from backend (AWS MySQL)
    const response = await fetch(backendApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(30000), // 30 second timeout
    })

    if (!response.ok) {
      console.error("❌ Backend returned error:", response.status, response.statusText)
      // Return empty options on error instead of failing
      return NextResponse.json({
        regions: [],
        genders: [],
        ageRanges: ["18-25", "26-35", "36-45", "46-55", "56+"],
        categories: [],
        tags: [],
        paymentMethods: [],
      })
    }

    const data = await response.json()
    console.log("✅ Filter options received from backend")
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("❌ Error proxying filter options to backend:", error)

    // Return empty options on error
    return NextResponse.json({
      regions: [],
      genders: [],
      ageRanges: ["18-25", "26-35", "36-45", "46-55", "56+"],
      categories: [],
      tags: [],
      paymentMethods: [],
    })
  }
}
