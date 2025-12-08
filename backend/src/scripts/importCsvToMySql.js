// /backend/src/scripts/importCsvToMySql.js
import mysql from 'mysql2/promise';
import fs from 'fs';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const batchSize = 1000;

async function createTable(pool) {
  // Drop table if it exists to ensure clean schema
  console.log('🗑️  Dropping existing sales table if it exists...');
  await pool.query('DROP TABLE IF EXISTS sales');
  
  // Create table with correct schema
  await pool.query(`
    CREATE TABLE sales (
      id INT AUTO_INCREMENT PRIMARY KEY,
      transactionId VARCHAR(50),
      date DATE,
      customerId VARCHAR(50),
      customerName VARCHAR(255),
      phoneNumber VARCHAR(50),
      gender VARCHAR(20),
      age INT,
      customerRegion VARCHAR(100),
      productId VARCHAR(50),
      productCategory VARCHAR(100),
      productName VARCHAR(255),
      brand VARCHAR(100),
      quantity INT,
      pricePerUnit DECIMAL(10, 2),
      totalAmount DECIMAL(10, 2),
      finalAmount DECIMAL(10, 2),
      discountPercentage DECIMAL(5, 2),
      paymentMethod VARCHAR(50),
      tags TEXT,
      employeeName VARCHAR(255),
      customerType VARCHAR(50),
      orderStatus VARCHAR(50),
      deliveryType VARCHAR(50),
      storeId VARCHAR(50),
      storeLocation VARCHAR(100),
      salespersonId VARCHAR(50),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_date (date),
      INDEX idx_region (customerRegion),
      INDEX idx_category (productCategory),
      INDEX idx_payment_method (paymentMethod),
      INDEX idx_gender (gender),
      INDEX idx_age (age),
      INDEX idx_tags (tags(255))
    )
  `);
}

async function insertBatch(pool, batch) {
  if (batch.length === 0) return;
  
  const query = `
    INSERT INTO sales (
      \`transactionId\`, \`date\`, \`customerId\`, \`customerName\`, \`phoneNumber\`,
      \`gender\`, \`age\`, \`customerRegion\`, \`productId\`, \`productCategory\`,
      \`productName\`, \`brand\`, \`quantity\`, \`pricePerUnit\`, \`totalAmount\`,
      \`finalAmount\`, \`discountPercentage\`, \`paymentMethod\`, \`tags\`,
      \`employeeName\`, \`customerType\`, \`orderStatus\`, \`deliveryType\`,
      \`storeId\`, \`storeLocation\`, \`salespersonId\`
    ) VALUES ?
  `;
  
  await pool.query(query, [batch]);
}

async function main() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    console.log('📊 Creating sales table...');
    await createTable(pool);
    console.log('✅ Table created successfully');
    
    const filePath = path.join(__dirname, '../../../truestate_assignment_dataset.csv');
    if (!fs.existsSync(filePath)) {
      throw new Error(`CSV file not found at: ${filePath}`);
    }

    console.log(`📂 Reading CSV from: ${filePath}`);
    const batch = [];
    let count = 0;

    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      bom: true,
    });

    await new Promise((resolve, reject) => {
      createReadStream(filePath)
        .pipe(parser)
        .on('data', async (row) => {
          batch.push([
            row["Transaction ID"] || null,
            row["Date"] ? new Date(row["Date"]) : null,
            row["Customer ID"] || null,
            row["Customer Name"] || null,
            row["Phone Number"] || null,
            row["Gender"] || null,
            row["Age"] ? parseInt(row["Age"], 10) : null,
            row["Customer Region"] || null,
            row["Product ID"] || null,
            row["Product Category"] || null,
            row["Product Name"] || null,
            row["Brand"] || null,
            row["Quantity"] ? parseInt(row["Quantity"], 10) : 0,
            row["Price per Unit"] ? parseFloat(row["Price per Unit"]) : 0,
            row["Total Amount"] ? parseFloat(row["Total Amount"]) : 0,
            row["Final Amount"] ? parseFloat(row["Final Amount"]) : 0,
            row["Discount Percentage"] ? parseFloat(row["Discount Percentage"]) : 0,
            row["Payment Method"] || null,
            row["Tags"] || null,
            row["Employee Name"] || null,
            row["Customer Type"] || null,
            row["Order Status"] || null,
            row["Delivery Type"] || null,
            row["Store ID"] || null,
            row["Store Location"] || null,
            row["Salesperson ID"] || null,
          ]);

          if (batch.length >= batchSize) {
            const currentBatch = [...batch];
            batch.length = 0;
            try {
              await insertBatch(pool, currentBatch);
              count += currentBatch.length;
              console.log(`✅ Processed ${count.toLocaleString()} records...`);
            } catch (err) {
              console.error('Error inserting batch:', err.message);
              reject(err);
            }
          }
        })
        .on('end', async () => {
          if (batch.length > 0) {
            try {
              await insertBatch(pool, batch);
              count += batch.length;
            } catch (err) {
              console.error('Error inserting final batch:', err.message);
              reject(err);
              return;
            }
          }
          console.log(`\n✅ Successfully imported ${count.toLocaleString()} records into MySQL`);
          resolve();
        })
        .on('error', reject);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);