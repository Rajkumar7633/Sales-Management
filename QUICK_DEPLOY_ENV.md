# Quick Environment Variables Setup for Live Backend

## For Render.com - Copy & Paste These Variables

Go to Render Dashboard → Your Service → Environment → Add these:

```
DB_HOST=your-mysql-host.com
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=sales_management
DB_PORT=3306
NODE_ENV=production
PORT=10000
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

**Replace:**
- `your-mysql-host.com` → Your MySQL database host
- `your_username` → Your MySQL username
- `your_password` → Your MySQL password
- `https://your-frontend.vercel.app` → Your actual Vercel frontend URL

**Note:** Render automatically sets PORT to 10000, but include it anyway for clarity.

## Steps:

1. **Set up MySQL database** (local or cloud)
2. **Import CSV data** using: `npm run import:mysql`
3. **Add environment variables** in your hosting platform
4. **Deploy** - your backend will connect to MySQL automatically
5. **Update frontend** `NEXT_PUBLIC_API_URL` to point to your backend

## Verify:

After deployment, check:
- Health endpoint: `https://your-backend.onrender.com/api/health`
- Should show: `{"status":"ok","database":"connected","dataLoaded":true}`

## Need Help?

See detailed guides:
- `MYSQL_SETUP.md` - Local MySQL setup
- `DEPLOYMENT_MYSQL.md` - Full deployment guide
- `backend/ENV_VARIABLES.md` - Environment variables reference

