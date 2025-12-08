import { parse } from "csv-parse"
import { createReadStream, existsSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { getDbPool } from "../db/mysql.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function main() {
  const csvPath = join(__dirname, "..", "..", "..", "truestate_assignment_dataset.csv")

  if (!existsSync(csvPath)) {
    console.error(`CSV file not found at: ${csvPath}`)
    process.exit(1)
  }

  console.log("Connecting to MySQL...")
  const pool = getDbPool()

  const createTableSql = `
    CREATE TABLE IF NOT EXISTS sales_transactions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      transaction_id INT,
      date DATE,
      customer_id VARCHAR(50),
      customer_name VARCHAR(255),
      phone_number VARCHAR(50),
      gender VARCHAR(10),
      age INT,
      customer_region VARCHAR(50),
      customer_type VARCHAR(50),
      product_id VARCHAR(50),
      product_name VARCHAR(255),
      brand VARCHAR(100),
      product_category VARCHAR(100),
      tags TEXT,
      quantity INT,
      price_per_unit DECIMAL(15,2),
      discount_percentage DECIMAL(5,2),
      total_amount DECIMAL(15,2),
      final_amount DECIMAL(15,2),
      payment_method VARCHAR(50),
      order_status VARCHAR(50),
      delivery_type VARCHAR(50),
      store_id VARCHAR(50),
      store_location VARCHAR(100),
      salesperson_id VARCHAR(50),
      employee_name VARCHAR(255)
    );
  `

  await pool.execute(createTableSql)
  console.log("Ensured sales_transactions table exists")

  console.log(`Reading CSV from: ${csvPath}`)

  const parser = createReadStream(csvPath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      bom: true,
    })
  )

  const batchSize = 1000
  let batch = []
  let count = 0

  for await (const row of parser) {
    batch.push([
      Number(row["Transaction ID"] || 0) || null,
      row["Date"] || null,
      row["Customer ID"] || null,
      row["Customer Name"] || null,
      row["Phone Number"] || null,
      row["Gender"] || null,
      Number(row["Age"] || 0) || null,
      row["Customer Region"] || null,
      row["Customer Type"] || null,
      row["Product ID"] || null,
      row["Product Name"] || null,
      row["Brand"] || null,
      row["Product Category"] || null,
      row["Tags"] || null,
      Number(row["Quantity"] || 0) || null,
      Number(row["Price per Unit"] || 0) || null,
      Number(row["Discount Percentage"] || 0) || null,
      Number(row["Total Amount"] || 0) || null,
      Number(row["Final Amount"] || 0) || null,
      row["Payment Method"] || null,
      row["Order Status"] || null,
      row["Delivery Type"] || null,
      row["Store ID"] || null,
      row["Store Location"] || null,
      row["Salesperson ID"] || null,
      row["Employee Name"] || null,
    ])

    if (batch.length >= batchSize) {
      await insertBatch(pool, batch)
      count += batch.length
      console.log(`Inserted ${count} rows...`)
      batch = []
    }
  }

  if (batch.length > 0) {
    await insertBatch(pool, batch)
    count += batch.length
  }

  console.log(`✅ Finished importing ${count} rows into MySQL`)
  await pool.end()
}

async function insertBatch(pool, batch) {
  const sql = `
    INSERT INTO sales_transactions (
      transaction_id,
      date,
      customer_id,
      customer_name,
      phone_number,
      gender,
      age,
      customer_region,
      customer_type,
      product_id,
      product_name,
      brand,
      product_category,
      tags,
      quantity,
      price_per_unit,
      discount_percentage,
      total_amount,
      final_amount,
      payment_method,
      order_status,
      delivery_type,
      store_id,
      store_location,
      salesperson_id,
      employee_name
    ) VALUES ?
  `

  await pool.query(sql, [batch])
}

main().catch((err) => {
  console.error("Import failed:", err)
  process.exit(1)
})
