import { type NextRequest, NextResponse } from "next/server"

// Proxy to backend API - forward all requests to the actual backend
export async function GET(request: NextRequest) {
  try {
    // Get backend URL from environment or use default
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://sales-management-backend-noas.onrender.com"
    const backendApiUrl = `${backendUrl}/api/sales`
    
    // Forward all query parameters to backend
    const searchParams = request.nextUrl.searchParams
    const backendUrlWithParams = `${backendApiUrl}?${searchParams.toString()}`
    
    console.log("Proxying request to backend:", backendUrlWithParams)
    
    // Fetch from backend
    const response = await fetch(backendUrlWithParams, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add timeout
      signal: AbortSignal.timeout(30000), // 30 second timeout
    })

    if (!response.ok) {
      console.error("Backend returned error:", response.status, response.statusText)
      return NextResponse.json(
        { error: `Backend error: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error proxying to backend:", error)
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: "Backend request timeout" },
        { status: 504 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to connect to backend", details: error.message },
      { status: 500 }
    )
  }
}
