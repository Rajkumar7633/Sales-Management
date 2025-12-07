import { parse } from "csv-parse/sync"
import { readFileSync, existsSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let cachedData = null

// Memory-efficient CSV loading for Render free tier (512MB limit)
export function generateSalesData() {
  // Return cached data if available
  if (cachedData) {
    return cachedData
  }

  try {
    const csvPath = join(__dirname, "..", "..", "..", "truestate_assignment_dataset.csv")
    
    if (!existsSync(csvPath)) {
      console.error(`CSV file not found at: ${csvPath}`)
      throw new Error(`CSV file not found at ${csvPath}`)
    }
    
    console.log(`Loading CSV from: ${csvPath}`)
    console.log(`⚠️  Using memory-efficient loading for Render free tier...`)
    const loadStartTime = Date.now()
    
    // Use sync parsing but process in smaller chunks to reduce memory spikes
    console.log("Reading CSV file...")
    const fileContent = readFileSync(csvPath, "utf-8")
    const readTime = ((Date.now() - loadStartTime) / 1000).toFixed(2)
    console.log(`CSV file read in ${readTime}s, parsing...`)

    // Parse CSV with optimized settings
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      bom: true,
      cast: false,
    })

    console.log(`Parsing ${records.length} records...`)
    const transformStartTime = Date.now()
    
    // Transform in batches to reduce memory pressure
    const batchSize = 10000
    const transformedData = []
    
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      const transformedBatch = batch.map((record) => ({
        "Transaction ID": record["Transaction ID"],
        Date: record["Date"],
        "Customer ID": record["Customer ID"],
        "Customer name": record["Customer Name"] || "",
        "Phone Number": record["Phone Number"] || "",
        Gender: record["Gender"] || "",
        Age: parseInt(record["Age"], 10) || 0,
        "Customer region": record["Customer Region"] || "",
        "Product ID": record["Product ID"] || "",
        "Product Category": record["Product Category"] || "",
        Quantity: parseInt(record["Quantity"], 10) || 0,
        "Price per Unit": parseFloat(record["Price per Unit"]) || 0,
        "Total Amount": parseFloat(record["Total Amount"]) || 0,
        "Final Amount": parseFloat(record["Final Amount"]) || 0,
        "Payment Method": record["Payment Method"] || "",
        Tags: record["Tags"] || "",
        "Employee name": record["Employee Name"] || "",
        "Customer Type": record["Customer Type"] || "",
        "Product Name": record["Product Name"] || "",
        Brand: record["Brand"] || "",
        "Discount Percentage": parseFloat(record["Discount Percentage"]) || 0,
        "Order Status": record["Order Status"] || "",
        "Delivery Type": record["Delivery Type"] || "",
        "Store ID": record["Store ID"] || "",
        "Store Location": record["Store Location"] || "",
        "Salesperson ID": record["Salesperson ID"] || "",
      }))
      transformedData.push(...transformedBatch)
      
      // Force garbage collection hint between batches
      if (global.gc && i % (batchSize * 5) === 0) {
        global.gc()
      }
    }
    
    const transformTime = ((Date.now() - transformStartTime) / 1000).toFixed(2)
    console.log(`Data transformation completed in ${transformTime}s`)

    // Cache the data
    cachedData = transformedData
    const totalTime = ((Date.now() - loadStartTime) / 1000).toFixed(2)
    console.log(`✅ Loaded ${transformedData.length} records from CSV in ${totalTime}s`)
    return transformedData
  } catch (error) {
    console.error("Error reading CSV file:", error)
    if (error.message && error.message.includes("heap")) {
      console.error("❌ Out of memory! Consider upgrading Render plan or optimizing data loading.")
    }
    return []
  }
}

export function getFilterOptions(data) {
  if (!data || data.length === 0) {
    return {
      regions: [],
      genders: [],
      ageRanges: ["18-25", "26-35", "36-45", "46-55", "56+"],
      categories: [],
      tags: [],
      paymentMethods: [],
      dateRanges: ["Last 7 days", "Last 30 days", "Last 90 days", "Last year"],
    }
  }

  return {
    regions: [...new Set(data.map((item) => item["Customer region"]).filter(Boolean))].sort(),
    genders: [...new Set(data.map((item) => item.Gender).filter(Boolean))].sort(),
    ageRanges: ["18-25", "26-35", "36-45", "46-55", "56+"],
    categories: [...new Set(data.map((item) => item["Product Category"]).filter(Boolean))].sort(),
    tags: [...new Set(data.map((item) => item.Tags).filter(Boolean))].sort(),
    paymentMethods: [...new Set(data.map((item) => item["Payment Method"]).filter(Boolean))].sort(),
    dateRanges: ["Last 7 days", "Last 30 days", "Last 90 days", "Last year"],
  }
}
