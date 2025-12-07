# 🚀 Vercel Environment Variable Setup

## ⚠️ IMPORTANT: Connect Frontend to Backend

Your frontend is deployed on Vercel but can't connect to your backend because the API URL is not configured.

## ✅ Quick Fix (2 minutes)

### Step 1: Get Your Backend URL

Your Render backend URL is:
```
https://sales-management-backend-fndm.onrender.com
```

### Step 2: Set Environment Variable in Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: `sales-management-zeta` (or your project name)
3. **Go to Settings** → **Environment Variables**
4. **Add New Variable**:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://sales-management-backend-fndm.onrender.com`
   - **Environment**: Select all (Production, Preview, Development)
5. **Save**
6. **Redeploy**: Go to **Deployments** → Click the **3 dots** on latest deployment → **Redeploy**

### Step 3: Verify

After redeploy (2-3 minutes):
1. Visit your Vercel URL: `https://sales-management-zeta.vercel.app`
2. Open browser console (F12)
3. You should see: `API Base URL: https://sales-management-backend-fndm.onrender.com`
4. The app should load data!

---

## 🔍 How to Check if It's Working

### In Browser Console:
```javascript
// Should show your Render backend URL
console.log("API Base URL:", API_BASE_URL)
```

### Test Backend Directly:
Visit: `https://sales-management-backend-fndm.onrender.com/api/health`

Should return:
```json
{
  "status": "ok",
  "message": "Sales Management System Backend",
  "dataLoaded": true,
  "recordCount": 1234567
}
```

---

## 🐛 If Still Not Working

1. **Check Vercel Logs**:
   - Vercel Dashboard → Your Project → **Deployments** → Click latest → **Logs**
   - Look for errors

2. **Check Browser Console**:
   - Open DevTools (F12) → Console tab
   - Look for CORS errors or connection errors

3. **Verify Backend is Running**:
   - Visit: `https://sales-management-backend-fndm.onrender.com/api/health`
   - If it doesn't load, backend might be sleeping (Render free tier)

4. **Check CORS**:
   - Backend should allow your Vercel URL
   - Check Render logs for CORS errors

---

## 📝 Alternative: Hardcode (Not Recommended)

If environment variables don't work, you can temporarily hardcode in `frontend/src/lib/config.ts`:

```typescript
export const API_BASE_URL = "https://sales-management-backend-fndm.onrender.com"
```

Then commit and push - Vercel will auto-redeploy.

