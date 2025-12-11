# Render MySQL Database Setup Guide

This guide will help you set up a MySQL database on Render and connect your backend to it.

## Step 1: Create MySQL Database on Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. Click **"New +"** button (top right)
3. Select **"PostgreSQL"** or **"MySQL"** (if available)
   - **Note**: Render offers PostgreSQL by default. If you need MySQL specifically, you can:
     - Use **PlanetScale** (free tier): https://planetscale.com
     - Use **Railway MySQL**: https://railway.app
     - Use **Aiven MySQL** (free tier): https://aiven.io
     - Use **DigitalOcean Managed MySQL**: https://www.digitalocean.com/products/managed-databases

### Option A: Using Render PostgreSQL (Recommended - Free Tier Available)

If you want to use Render's built-in PostgreSQL:

1. Click **"New +"** → **"PostgreSQL"**
2. Fill in:
   - **Name**: `sales-management-db`
   - **Database**: `sales_management`
   - **User**: `sales_user` (or auto-generated)
   - **Region**: Choose closest to you
   - **Plan**: **Free** (for testing) or **Starter** ($7/month)
3. Click **"Create Database"**
4. Wait for database to be provisioned (2-3 minutes)

**After creation, you'll see:**
- **Internal Database URL**: `postgresql://user:password@hostname:5432/dbname`
- **External Connection String**: (for connecting from outside Render)

### Option B: Using PlanetScale MySQL (Free Tier)

1. Go to https://planetscale.com
2. Sign up for free account
3. Create a new database: `sales_management`
4. Copy the connection string (looks like: `mysql://user:password@host/database`)

### Option C: Using Railway MySQL

1. Go to https://railway.app
2. Create new project
3. Add **MySQL** service
4. Copy connection details from the service dashboard

## Step 2: Get Database Connection Details

After creating your database, you'll need these values:

### For Render PostgreSQL:
- **DB_HOST**: The hostname (e.g., `dpg-xxxxx-a.oregon-postgres.render.com`)
- **DB_USER**: The username
- **DB_PASSWORD**: The password
- **DB_NAME**: The database name (e.g., `sales_management`)
- **DB_PORT**: `5432` (for PostgreSQL) or `3306` (for MySQL)

### For PlanetScale MySQL:
- **DB_HOST**: The hostname (e.g., `aws.connect.psdb.cloud`)
- **DB_USER**: Your username
- **DB_PASSWORD**: Your password
- **DB_NAME**: Your database name
- **DB_PORT**: `3306`

## Step 3: Import CSV Data to Database

### If using MySQL (PlanetScale, Railway, etc.):

1. **On your local machine**, make sure you have the CSV file:
   ```bash
   cd /Users/apple/Downloads/sales-management-system
   ls truestate_assignment_dataset.csv  # Should exist
   ```

2. **Set up local environment variables** (temporarily):
   ```bash
   cd backend
   # Create .env file with your Render/PlanetScale MySQL credentials
   ```

3. **Run the import script**:
   ```bash
   npm run import:mysql
   ```

   This will:
   - Create the `sales` table
   - Import all 1M+ records from CSV
   - Show progress as it processes

### If using Render PostgreSQL:

You'll need to modify the import script to use PostgreSQL instead of MySQL, or use a migration tool.

## Step 4: Add Environment Variables to Render Backend

1. Go to your **Render Dashboard**
2. Select your **backend service** (e.g., `sales-management-backend`)
3. Go to **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add these variables one by one:

```
DB_HOST=your-database-host.com
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=sales_management
DB_PORT=3306
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

**Important:**
- Replace `your-database-host.com` with your actual database hostname
- Replace `your_username` and `your_password` with your actual credentials
- Replace `https://your-frontend.vercel.app` with your actual Vercel frontend URL
- For PostgreSQL, use `DB_PORT=5432` instead of `3306`

## Step 5: Verify Connection

1. After adding environment variables, Render will automatically restart your backend
2. Check the logs to see if connection is successful:
   - Go to your backend service → **"Logs"** tab
   - Look for: `✅ Database connection test successful`

3. Test the health endpoint:
   ```bash
   curl https://your-backend.onrender.com/api/health
   ```

   Should return:
   ```json
   {
     "status": "ok",
     "database": "connected",
     "dataLoaded": true,
     "salesCount": 1000000
   }
   ```

## Troubleshooting

### Error: "Database configuration missing"
- **Solution**: Make sure all environment variables (`DB_HOST`, `DB_USER`, `DB_NAME`) are set in Render dashboard

### Error: "Access denied for user"
- **Solution**: Double-check your `DB_USER` and `DB_PASSWORD` are correct

### Error: "Unknown database"
- **Solution**: Make sure `DB_NAME` matches the actual database name you created

### Error: "Connection timeout"
- **Solution**: 
  - Check if your database allows external connections (some require IP whitelisting)
  - For PlanetScale, make sure you're using the correct branch
  - For Render PostgreSQL, external connections might be restricted on free tier

### Data not loading
- **Solution**: Make sure you've run the import script (`npm run import:mysql`) to load data into the database

## Quick Reference: Environment Variables for Render

Copy-paste this template and fill in your values:

```
DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
DB_USER=sales_user
DB_PASSWORD=your_secure_password_here
DB_NAME=sales_management
DB_PORT=5432
NODE_ENV=production
ALLOWED_ORIGINS=https://sales-management.vercel.app
```

## Next Steps

1. ✅ Database created on Render/PlanetScale
2. ✅ CSV data imported to database
3. ✅ Environment variables added to Render backend
4. ✅ Backend connected and health check passing
5. ✅ Frontend connected to backend

Your Sales Management System should now be fully functional! 🎉

