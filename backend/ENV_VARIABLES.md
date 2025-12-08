# Environment Variables Reference

Create a `.env` file in the `backend/` directory with these variables:

```env
# Database Configuration (REQUIRED)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sales_management
DB_PORT=3306

# Server Configuration
PORT=5001
NODE_ENV=development

# CORS Configuration
# For production, set this to your frontend URL(s), comma-separated
# Example: ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-domain.com
ALLOWED_ORIGINS=
```

## For Live Deployment (Render/Railway/etc.)

When deploying to a live server, set these in your platform's environment variables:

### Required Variables:
- `DB_HOST` - Your MySQL host (e.g., `mysql.example.com` or `your-db.render.com`)
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - Database name (e.g., `sales_management`)
- `DB_PORT` - Usually `3306` for MySQL

### Optional Variables:
- `PORT` - Server port (Render uses `10000` automatically)
- `NODE_ENV` - Set to `production` for live deployment
- `ALLOWED_ORIGINS` - Comma-separated list of frontend URLs (e.g., `https://your-app.vercel.app`)

## Example for Render.com:

Copy these into Render Dashboard → Environment Variables:

```
DB_HOST=your-mysql-host.com
DB_USER=admin
DB_PASSWORD=secure_password_123
DB_NAME=sales_management
DB_PORT=3306
NODE_ENV=production
PORT=10000
ALLOWED_ORIGINS=https://sales-management.vercel.app
```

**All 7 variables are required for Render deployment.**

## Example for Local Development:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sales_management
DB_PORT=3306
NODE_ENV=development
ALLOWED_ORIGINS=
```

**Note**: Never commit your `.env` file to Git. It's already in `.gitignore`.

