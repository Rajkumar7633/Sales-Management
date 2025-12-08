# Deployment Guide - MySQL Backend

This guide covers deploying the Sales Management System backend with MySQL to a live server (e.g., Render, Railway, or any Node.js hosting).

## Prerequisites

- MySQL database (local or cloud-hosted like PlanetScale, AWS RDS, etc.)
- Node.js hosting service (Render, Railway, Heroku, etc.)
- CSV file imported to MySQL (see `MYSQL_SETUP.md`)

## Step 1: Set Up MySQL Database

### Option A: Local MySQL
1. Install MySQL on your server
2. Create database:
   ```sql
   CREATE DATABASE sales_management;
   ```

### Option B: Cloud MySQL (Recommended for Production)
- **PlanetScale**: https://planetscale.com (Free tier available)
- **AWS RDS**: https://aws.amazon.com/rds/
- **DigitalOcean Managed Database**: https://www.digitalocean.com/products/managed-databases
- **Render PostgreSQL** (if you want to use PostgreSQL instead)

## Step 2: Import CSV Data

1. **On your local machine**, run the import script:
   ```bash
   cd backend
   npm install
   npm run import:mysql
   ```

2. **Or import directly on server**:
   - Upload CSV file to server
   - SSH into server
   - Run import script

## Step 3: Configure Environment Variables

### For Render.com

1. Go to your Render dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Add these environment variables:

```env
# Database Configuration
DB_HOST=your-mysql-host.com
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=sales_management
DB_PORT=3306

# Server Configuration
PORT=10000
NODE_ENV=production

# CORS Configuration
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-domain.com
```

**Important Notes:**
- Render automatically sets `PORT` to 10000, but you can override it
- Replace `your-mysql-host.com` with your actual MySQL host
- Add your frontend URL(s) to `ALLOWED_ORIGINS`

### For Railway.app

1. Go to your Railway project
2. Select your backend service
3. Go to **Variables** tab
4. Add the same environment variables as above

### For Other Platforms

Add the environment variables in your platform's dashboard or configuration file.

## Step 4: Update render.yaml (if using Render)

If you're using Render's Blueprint (render.yaml), update it:

```yaml
services:
  - type: web
    name: sales-management-backend
    env: node
    rootDir: backend
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DB_HOST
        value: your-mysql-host.com
      - key: DB_USER
        value: your_username
      - key: DB_PASSWORD
        value: your_password
      - key: DB_NAME
        value: sales_management
      - key: DB_PORT
        value: 3306
      - key: ALLOWED_ORIGINS
        value: https://your-frontend.vercel.app
    healthCheckPath: /api/health
    plan: free
```

## Step 5: Deploy

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add MySQL integration and deployment config"
   git push origin main
   ```

2. **Connect to Render/Railway**:
   - Connect your GitHub repository
   - Select the backend directory as root
   - Render/Railway will auto-detect and deploy

3. **Verify Deployment**:
   - Check health endpoint: `https://your-backend.onrender.com/api/health`
   - Should return: `{"status":"ok","database":"connected","dataLoaded":true}`

## Step 6: Update Frontend Environment Variables

In your frontend deployment (Vercel):

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add/Update:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   ```

## Troubleshooting

### Database Connection Failed
- Verify MySQL host, username, password, and database name
- Check if MySQL allows connections from your server IP
- For cloud MySQL, ensure firewall rules allow your server IP

### CORS Errors
- Add your frontend URL to `ALLOWED_ORIGINS`
- Check that `NEXT_PUBLIC_API_URL` in frontend matches backend URL

### Out of Memory
- Render free tier has 512MB limit
- The backend is configured to use 400MB for Node.js
- If issues persist, upgrade to paid plan or optimize queries

### Health Check Fails
- Verify database connection
- Check that data was imported successfully
- Review server logs for errors

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | MySQL server hostname | `mysql.example.com` |
| `DB_USER` | MySQL username | `admin` |
| `DB_PASSWORD` | MySQL password | `secure_password` |
| `DB_NAME` | Database name | `sales_management` |
| `DB_PORT` | MySQL port | `3306` |
| `PORT` | Backend server port | `10000` (Render) or `5001` (local) |
| `NODE_ENV` | Environment | `production` |
| `ALLOWED_ORIGINS` | Comma-separated frontend URLs | `https://app.vercel.app` |

## Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use strong database passwords**
3. **Enable SSL for MySQL connections** (if supported)
4. **Restrict database access** to only your backend server IP
5. **Use environment variables** for all sensitive data
6. **Regular backups** of your MySQL database

## Next Steps

- Monitor your backend logs for errors
- Set up database backups
- Consider upgrading to paid plans for better performance
- Add monitoring/alerting (e.g., Sentry, LogRocket)

