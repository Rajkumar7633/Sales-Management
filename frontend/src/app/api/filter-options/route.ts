import { getSalesData, getFilterOptions } from "@/lib/data"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const data = await getSalesData()
    const options = getFilterOptions(data)
    return NextResponse.json(options)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
