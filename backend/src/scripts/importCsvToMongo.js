import fs from 'fs';
import { parse } from 'csv-parse/sync';
import mongoose from 'mongoose';
import Sales from '../models/Sales.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function connectToMongo() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

async function main() {
  try {
    // Connect to MongoDB
    await connectToMongo();

    // Read and parse the CSV file
    const csvFilePath = path.join(__dirname, '../../../truestate_assignment_dataset.csv');
    console.log('Reading CSV file from:', csvFilePath);
    
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_quotes: true
    });

    console.log(`Found ${records.length} records to import`);

    // Clear existing data
    console.log('Clearing existing data...');
    await Sales.deleteMany({});
    console.log('Existing data cleared');

    // Transform and insert records in batches
    const batchSize = 500;
    let importedCount = 0;

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      
      const salesToInsert = batch.map(record => {
        // Debug: Log the first record to see its structure
        if (i === 0 && importedCount === 0) {
          console.log('Sample record:', record);
        }
        
        return {
          date: new Date(record.date || record.Date || new Date()),
          customerName: record.customerName || record.CustomerName || record['Customer Name'] || 'Unknown',
          productName: record.productName || record.ProductName || record['Product Name'] || 'Unknown',
          category: record.category || record.Category || 'Other',
          price: parseFloat(record.price || record.Price || 0),
          quantity: parseInt(record.quantity || record.Quantity || 1, 10),
          total: parseFloat(record.total || record.Total || 0),
          paymentMethod: record.paymentMethod || record.PaymentMethod || record['Payment Method'] || 'Unknown',
          region: record.region || record.Region || 'Unknown',
        };
      });

      try {
        await Sales.insertMany(salesToInsert);
        importedCount += salesToInsert.length;
        console.log(`Imported ${importedCount} of ${records.length} records`);
      } catch (insertError) {
        console.error('Error inserting batch:', insertError);
        // Try inserting one by one to find the problematic record
        for (const sale of salesToInsert) {
          try {
            await new Sales(sale).save();
            importedCount++;
          } catch (singleError) {
            console.error('Failed to insert record:', sale);
            console.error('Error:', singleError);
          }
        }
      }
    }

    console.log('Import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();
