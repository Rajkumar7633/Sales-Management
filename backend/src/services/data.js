import { parse } from "csv-parse"
import { createReadStream, existsSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { pipeline } from "stream/promises"
import { Transform } from "stream"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let cachedData = null
let isLoading = false
let loadingPromise = null

// Memory-efficient streaming CSV loading for Render free tier (512MB limit)
export async function generateSalesData() {
  // Return cached data if available
  if (cachedData) {
    return cachedData
  }

  // If already loading, return the promise
  if (isLoading && loadingPromise) {
    return loadingPromise
  }

  isLoading = true
  loadingPromise = (async () => {
    try {
      const csvPath = join(__dirname, "..", "..", "..", "truestate_assignment_dataset.csv")
    
      if (!existsSync(csvPath)) {
        console.error(`CSV file not found at: ${csvPath}`)
        throw new Error(`CSV file not found at ${csvPath}`)
      }
      
      console.log(`Loading CSV from: ${csvPath}`)
      console.log(`⚠️  Using streaming CSV parsing for memory efficiency...`)
      const loadStartTime = Date.now()
      
      const records = []
      let recordCount = 0
      let headerSkipped = false

      // Transform stream to process CSV records one by one
      const transformer = new Transform({
        objectMode: true,
        transform(chunk, encoding, callback) {
          // Skip header row
          if (!headerSkipped) {
            headerSkipped = true
            return callback()
          }

          // Transform CSV record to match expected format
          const transformedRecord = {
            "Transaction ID": chunk["Transaction ID"] || "",
            Date: chunk["Date"] || "",
            "Customer ID": chunk["Customer ID"] || "",
            "Customer name": chunk["Customer Name"] || "",
            "Phone Number": chunk["Phone Number"] || "",
            Gender: chunk["Gender"] || "",
            Age: parseInt(chunk["Age"], 10) || 0,
            "Customer region": chunk["Customer Region"] || "",
            "Product ID": chunk["Product ID"] || "",
            "Product Category": chunk["Product Category"] || "",
            Quantity: parseInt(chunk["Quantity"], 10) || 0,
            "Price per Unit": parseFloat(chunk["Price per Unit"]) || 0,
            "Total Amount": parseFloat(chunk["Total Amount"]) || 0,
            "Final Amount": parseFloat(chunk["Final Amount"]) || 0,
            "Payment Method": chunk["Payment Method"] || "",
            Tags: chunk["Tags"] || "",
            "Employee name": chunk["Employee Name"] || "",
            "Customer Type": chunk["Customer Type"] || "",
            "Product Name": chunk["Product Name"] || "",
            Brand: chunk["Brand"] || "",
            "Discount Percentage": parseFloat(chunk["Discount Percentage"]) || 0,
            "Order Status": chunk["Order Status"] || "",
            "Delivery Type": chunk["Delivery Type"] || "",
            "Store ID": chunk["Store ID"] || "",
            "Store Location": chunk["Store Location"] || "",
            "Salesperson ID": chunk["Salesperson ID"] || "",
          }
          
          records.push(transformedRecord)
          recordCount++
          
          // Log progress every 100k records
          if (recordCount % 100000 === 0) {
            console.log(`  Processed ${recordCount.toLocaleString()} records...`)
          }
          
          callback()
        },
      })

      // Stream CSV file through parser and transformer
      await pipeline(
        createReadStream(csvPath),
        parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
          bom: true,
          cast: false, // Don't auto-cast to reduce memory
        }),
        transformer
      )

      cachedData = records
      const totalTime = ((Date.now() - loadStartTime) / 1000).toFixed(2)
      console.log(`✅ Loaded ${cachedData.length.toLocaleString()} records from CSV in ${totalTime}s`)
      return cachedData
  } catch (error) {
    console.error("Error reading CSV file:", error)
      if (error.message && error.message.includes("heap")) {
        console.error("❌ Out of memory! The CSV file is too large for the current memory limit.")
      }
      cachedData = []
    return []
    } finally {
      isLoading = false
      loadingPromise = null
  }
  })()

  return loadingPromise
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
