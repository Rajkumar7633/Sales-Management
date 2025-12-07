# 🚀 Deployment Guide: Sales Management System

Complete guide to deploy your frontend on **Vercel** and backend on **Railway** (or Render).

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment (Railway)](#backend-deployment-railway)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Connecting Frontend to Backend](#connecting-frontend-to-backend)
5. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

- GitHub account (your code should be on GitHub)
- Vercel account (free): https://vercel.com
- Railway account (free): https://railway.app (or Render: https://render.com)

---

## 🔧 Backend Deployment (Railway)

### Step 1: Prepare Backend for Deployment

1. **Create `railway.json` or use Railway's auto-detection**

Railway will auto-detect Node.js projects, but you can create a `Procfile` or use package.json scripts.

2. **Ensure CSV file is accessible**

The CSV file should be in the repository root (which it is, tracked with Git LFS).

### Step 2: Deploy to Railway

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** with GitHub
3. **Create New Project** → "Deploy from GitHub repo"
4. **Select your repository**: `Sales-Management`
5. **Configure the service**:
   - **Root Directory**: `backend` (important!)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Port**: Railway will auto-detect (usually 5001)

6. **Set Environment Variables**:
   - Click on your service → **Variables** tab
   - Add:
     ```
     NODE_ENV=production
     PORT=5001
     ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-frontend-domain.vercel.app
     ```
   - Replace `your-frontend.vercel.app` with your actual Vercel URL (you'll get this after deploying frontend)

7. **Deploy**:
   - Railway will automatically deploy
   - Wait for deployment to complete (5-10 minutes for first deploy)
   - **Copy your Railway URL** (e.g., `https://your-app.railway.app`)

### Step 3: Verify Backend

1. Visit: `https://your-backend-url.railway.app/api/health`
2. You should see:
   ```json
   {
     "status": "ok",
     "message": "Sales Management System Backend",
     "dataLoaded": true
   }
   ```

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

The frontend is already configured to use environment variables for the API URL.

### Step 2: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with GitHub
3. **Import Project**:
   - Click "Add New" → "Project"
   - Select your GitHub repository: `Sales-Management`
   - **Configure Project**:
     - **Framework Preset**: Next.js
     - **Root Directory**: `frontend` (important!)
     - **Build Command**: `npm run build` (or leave default)
     - **Output Directory**: `.next` (or leave default)
     - **Install Command**: `npm install`

4. **Set Environment Variables**:
   - In project settings, go to **Environment Variables**
   - Add:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
     ```
   - Replace with your actual Railway backend URL

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)
   - **Copy your Vercel URL** (e.g., `https://sales-management.vercel.app`)

### Step 3: Update Backend CORS

1. Go back to **Railway** → Your backend service → **Variables**
2. Update `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-frontend-preview.vercel.app
   ```
3. **Redeploy** the backend (Railway will auto-redeploy when you save variables)

---

## 🔗 Connecting Frontend to Backend

### Option 1: Environment Variables (Recommended)

1. **Frontend (Vercel)**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL=https://your-backend.railway.app`
   - Redeploy

2. **Backend (Railway)**:
   - Go to Railway Dashboard → Your Service → Variables
   - Add: `ALLOWED_ORIGINS=https://your-frontend.vercel.app`
   - Redeploy

### Option 2: Update Code Directly

If you want to hardcode (not recommended), update `frontend/src/lib/config.ts`:

```typescript
export const API_BASE_URL = "https://your-backend.railway.app"
```

---

## 🔄 Alternative: Backend on Render

If you prefer Render instead of Railway:

### Step 1: Deploy to Render

1. **Go to Render**: https://render.com
2. **Sign up/Login** with GitHub
3. **New** → **Web Service**
4. **Connect your repository**
5. **Configure**:
   - **Name**: `sales-management-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)

6. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```

7. **Deploy** and copy your Render URL

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend not loading CSV
- **Solution**: Ensure CSV file is in repository root and Git LFS is working
- Check Railway logs: Railway Dashboard → Your Service → Logs

**Problem**: CORS errors
- **Solution**: Update `ALLOWED_ORIGINS` in Railway with your Vercel URL
- Check backend logs for CORS errors

**Problem**: Out of memory
- **Solution**: Railway free tier has memory limits. Consider upgrading or using Render's paid tier

### Frontend Issues

**Problem**: Frontend can't connect to backend
- **Solution**: 
  1. Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
  2. Verify backend is running (check Railway/Render dashboard)
  3. Check browser console for CORS errors

**Problem**: Build fails on Vercel
- **Solution**: 
  1. Ensure `Root Directory` is set to `frontend`
  2. Check Vercel build logs
  3. Verify all dependencies are in `package.json`

### General Issues

**Problem**: Slow initial load
- **Solution**: This is normal - CSV file is large (224MB). Backend pre-loads data on startup (30-60 seconds)

**Problem**: API returns 404
- **Solution**: 
  1. Verify backend URL is correct
  2. Check backend routes are `/api/sales` and `/api/sales/filter-options`
  3. Test backend health endpoint: `https://your-backend-url/api/health`

---

## 📝 Quick Checklist

- [ ] Backend deployed on Railway/Render
- [ ] Backend health endpoint works: `/api/health`
- [ ] Frontend deployed on Vercel
- [ ] `NEXT_PUBLIC_API_URL` set in Vercel
- [ ] `ALLOWED_ORIGINS` set in Railway/Render with Vercel URL
- [ ] Both services redeployed after setting environment variables
- [ ] Frontend can fetch data from backend

---

## 🎉 Success!

Once everything is deployed:
- Your frontend will be live at: `https://your-app.vercel.app`
- Your backend will be live at: `https://your-app.railway.app` (or `.render.com`)

Both services are now connected and working in production! 🚀

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

