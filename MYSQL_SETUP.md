# MySQL Setup Guide

This guide will help you set up the MySQL database for the Sales Management System.

## Prerequisites

- MySQL Server installed and running
- Node.js and npm installed
- CSV file `truestate_assignment_dataset.csv` in the project root

## Step 1: Create Database

```sql
CREATE DATABASE sales_management;
```

## Step 2: Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sales_management
DB_PORT=3306
PORT=5001
NODE_ENV=development
ALLOWED_ORIGINS=
```

## Step 3: Install Dependencies

```bash
cd backend
npm install
```

## Step 4: Import CSV Data

Run the import script to load data from CSV into MySQL:

```bash
npm run import:mysql
```

This will:
- Create the `sales` table with all required columns and indexes
- Import all records from `truestate_assignment_dataset.csv`
- Show progress as it processes in batches of 1000 records

**Note**: The import script checks if data already exists. To re-import, you'll need to drop or truncate the table first.

## Step 5: Start the Backend Server

```bash
npm run dev    # Development mode (2GB memory)
npm start      # Production mode (400MB memory)
```

## Verification

1. Check database connection:
   ```bash
   curl http://localhost:5001/api/health
   ```

2. Check if data is loaded:
   ```bash
   curl http://localhost:5001/api/sales/filter-options
   ```

## Features

✅ **Multiple Filter Selection**: Select multiple options within a single filter (e.g., multiple tags, categories, regions)

✅ **Combined Filters**: Apply multiple different filters simultaneously (e.g., Tags + Category + Date Range + Gender)

✅ **Efficient Querying**: Uses indexed MySQL queries for fast filtering and sorting

✅ **Tag Filtering**: Handles comma-separated tags in the database using FIND_IN_SET

## Troubleshooting

### Database Connection Error
- Verify MySQL is running: `mysql -u root -p`
- Check environment variables in `.env` file
- Ensure database exists: `SHOW DATABASES;`

### Import Fails
- Verify CSV file exists at project root: `truestate_assignment_dataset.csv`
- Check file permissions
- Ensure database is empty or drop the table first

### Out of Memory
- For local development, use `npm run dev` (2GB memory)
- For production/Render, use `npm start` (400MB memory)

## Database Schema

The `sales` table includes:
- Transaction details (ID, date, customer info)
- Product information (category, name, brand)
- Customer demographics (age, gender, region)
- Financial data (amounts, discounts, payment method)
- Tags (comma-separated string)
- Store and employee information

All filterable fields are indexed for optimal query performance.

