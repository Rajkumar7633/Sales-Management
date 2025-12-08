# Quick Environment Variables Setup for Live Backend

## For Render.com / Railway.app / Any Node.js Hosting

Go to your platform's dashboard → Environment Variables section and add:

### Required Database Variables:
```
DB_HOST=your-mysql-host.com
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=sales_management
DB_PORT=3306
```

### Required Server Variables:
```
NODE_ENV=production
PORT=10000
```

**Note**: Render automatically sets PORT to 10000, but you can set it explicitly.

### Required CORS Variable:
```
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

Replace `https://your-frontend.vercel.app` with your actual frontend URL.

## Example Complete Setup:

```
DB_HOST=mysql.example.com
DB_USER=admin
DB_PASSWORD=MySecurePassword123
DB_NAME=sales_management
DB_PORT=3306
NODE_ENV=production
PORT=10000
ALLOWED_ORIGINS=https://sales-management-system.vercel.app
```

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

