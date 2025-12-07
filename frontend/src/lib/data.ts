import { parse } from "csv-parse/sync"
import { readFileSync } from "fs"
import { join } from "path"

let cachedData: any[] | null = null

export async function getSalesData() {
  // Return cached data if available
  if (cachedData) {
    return cachedData
  }

  try {
    // Read CSV file from project root
    const csvPath = join(process.cwd(), "truestate_assignment_dataset.csv")
    const fileContent = readFileSync(csvPath, "utf-8")

    // Parse CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    // Transform CSV data to match expected format
    // CSV uses "Customer Name" but code expects "Customer name"
    // CSV uses "Customer Region" but code expects "Customer region"
    // CSV uses "Employee Name" but code expects "Employee name"
    const transformedData = records.map((record: any) => ({
      "Transaction ID": record["Transaction ID"],
      Date: record["Date"],
      "Customer ID": record["Customer ID"],
      "Customer name": record["Customer Name"], // Map Customer Name to Customer name
      "Phone Number": record["Phone Number"],
      Gender: record["Gender"],
      Age: parseInt(record["Age"], 10),
      "Customer region": record["Customer Region"], // Map Customer Region to Customer region
      "Product ID": record["Product ID"],
      "Product Category": record["Product Category"],
      Quantity: parseInt(record["Quantity"], 10),
      "Price per Unit": parseFloat(record["Price per Unit"]),
      "Total Amount": parseFloat(record["Total Amount"]),
      "Final Amount": parseFloat(record["Final Amount"]),
      "Payment Method": record["Payment Method"],
      Tags: record["Tags"],
      "Employee name": record["Employee Name"], // Map Employee Name to Employee name
      // Additional fields from CSV
      "Customer Type": record["Customer Type"],
      "Product Name": record["Product Name"],
      Brand: record["Brand"],
      "Discount Percentage": parseFloat(record["Discount Percentage"]),
      "Order Status": record["Order Status"],
      "Delivery Type": record["Delivery Type"],
      "Store ID": record["Store ID"],
      "Store Location": record["Store Location"],
      "Salesperson ID": record["Salesperson ID"],
    }))

    // Cache the data
    cachedData = transformedData
    return transformedData
  } catch (error) {
    console.error("Error reading CSV file:", error)
    // Fallback to empty array
    return []
  }
}

export function getFilterOptions(data: any[]) {
  if (!data || data.length === 0) {
    return {
      regions: [],
      genders: [],
      categories: [],
      tags: [],
      paymentMethods: [],
      ageRanges: ["18-25", "26-35", "36-45", "46-55", "56+"],
    }
  }

  return {
    regions: [...new Set(data.map((d) => d["Customer region"]).filter(Boolean))].sort(),
    genders: [...new Set(data.map((d) => d["Gender"]).filter(Boolean))].sort(),
    categories: [...new Set(data.map((d) => d["Product Category"]).filter(Boolean))].sort(),
    tags: [...new Set(data.map((d) => d["Tags"]).filter(Boolean))].sort(),
    paymentMethods: [...new Set(data.map((d) => d["Payment Method"]).filter(Boolean))].sort(),
    ageRanges: ["18-25", "26-35", "36-45", "46-55", "56+"],
  }
}
