import { type NextRequest, NextResponse } from "next/server"

// Proxy to backend API - fetch data from AWS MySQL via Render backend
export async function GET(request: NextRequest) {
  try {
    // Get backend URL from environment or use default
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://sales-management-backend-noas.onrender.com"
    const backendApiUrl = `${backendUrl}/api/sales`

    // Forward all query parameters to backend
    const searchParams = request.nextUrl.searchParams
    const backendUrlWithParams = `${backendApiUrl}?${searchParams.toString()}`

    console.log("🔄 Proxying request to backend:", backendUrlWithParams)

    // Fetch from backend (AWS MySQL)
    const response = await fetch(backendUrlWithParams, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add timeout
      signal: AbortSignal.timeout(30000), // 30 second timeout
    })

    if (!response.ok) {
      console.error("❌ Backend returned error:", response.status, response.statusText)
      const errorText = await response.text()
      console.error("Error details:", errorText)
      return NextResponse.json(
        { error: `Backend error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log("✅ Backend response received, data count:", data.data?.length || 0)

    // Transform backend response to match frontend expectations
    return NextResponse.json({
      data: data.data || [],
      pagination: {
        page: data.pagination?.page || 1,
        pageSize: data.pagination?.limit || data.pagination?.pageSize || 10,
        totalItems: data.pagination?.total || data.pagination?.totalItems || 0,
        totalPages: data.pagination?.totalPages || 0,
      },
      metadata: {
        totalUnits: data.aggregations?.totalItems || data.metadata?.totalUnits || 0,
        totalAmount: data.aggregations?.totalSales || data.metadata?.totalAmount || 0,
        totalDiscount: data.metadata?.totalDiscount || 0,
      },
    })
  } catch (error: any) {
    console.error("❌ Error proxying to backend:", error)

    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: "Backend request timeout. Backend may be slow to respond." },
        { status: 504 }
      )
    }

    return NextResponse.json(
      { error: "Failed to connect to backend", details: error.message },
      { status: 500 }
    )
  }
}
