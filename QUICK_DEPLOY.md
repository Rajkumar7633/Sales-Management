# ⚡ Quick Deployment Guide

## 🎯 Step-by-Step: Deploy in 10 Minutes

### Part 1: Deploy Backend (Railway) - 5 minutes

1. **Go to**: https://railway.app
2. **Login** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select**: Your `Sales-Management` repository
5. **Settings** → **Root Directory**: Set to `backend`
6. **Variables** → Add:
   ```
   NODE_ENV=production
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
   (You'll update the frontend URL after deploying frontend)
7. **Wait for deployment** (5-10 min)
8. **Copy your Railway URL**: `https://your-app.railway.app`

---

### Part 2: Deploy Frontend (Vercel) - 5 minutes

1. **Go to**: https://vercel.com
2. **Login** with GitHub
3. **Add New** → **Project**
4. **Import** your `Sales-Management` repository
5. **Configure**:
   - **Root Directory**: `frontend`
   - **Framework**: Next.js (auto-detected)
6. **Environment Variables** → Add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```
   (Use the Railway URL from Part 1)
7. **Deploy**
8. **Copy your Vercel URL**: `https://your-app.vercel.app`

---

### Part 3: Connect Them - 2 minutes

1. **Go back to Railway** → Your backend service
2. **Variables** → Update `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
   (Use the Vercel URL from Part 2)
3. **Railway will auto-redeploy**

---

### ✅ Done!

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`

Both are now connected! 🎉

---

## 🔍 Test Your Deployment

1. **Backend Health Check**:
   ```
   https://your-backend.railway.app/api/health
   ```
   Should return: `{"status":"ok","dataLoaded":true}`

2. **Frontend**:
   ```
   https://your-frontend.vercel.app
   ```
   Should load and show transactions

---

## 🆘 Common Issues

**CORS Error?**
- Make sure `ALLOWED_ORIGINS` in Railway includes your Vercel URL
- Redeploy backend after updating

**Frontend can't connect?**
- Check `NEXT_PUBLIC_API_URL` in Vercel matches your Railway URL
- Redeploy frontend after updating

**Backend not loading data?**
- Check Railway logs
- CSV file should be in repository (tracked with Git LFS)
- First load takes 30-60 seconds (normal)

---

For detailed instructions, see `DEPLOYMENT_GUIDE.md`

