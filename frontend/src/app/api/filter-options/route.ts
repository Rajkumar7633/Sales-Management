import { NextResponse } from "next/server"

// Proxy to backend API for filter options
export async function GET() {
  try {
    // Get backend URL from environment or use default
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://sales-management-backend-noas.onrender.com"
    const backendApiUrl = `${backendUrl}/api/sales/filter-options`
    
    console.log("Proxying filter options request to backend:", backendApiUrl)
    
    // Fetch from backend
    const response = await fetch(backendApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(30000), // 30 second timeout
    })

    if (!response.ok) {
      console.error("Backend returned error:", response.status, response.statusText)
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error proxying filter options to backend:", error)
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: "Backend request timeout" },
        { status: 504 }
      )
    }
    
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
