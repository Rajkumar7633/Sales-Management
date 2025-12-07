# Troubleshooting "Failed to fetch" Error

## Quick Fixes

### 1. Make sure backend is running
```bash
cd server
npm run dev
```

You should see:
```
Loading sales data from CSV...
Loaded 1000000 records from CSV
Sales Management System Backend running on http://localhost:5001
```

### 2. Check if backend is accessible
Open in browser or run:
```bash
curl http://localhost:5001/api/health
```

Should return: `{"status":"ok","message":"Sales Management System Backend"}`

### 3. Check browser console
Open browser DevTools (F12) and check:
- Console tab for errors
- Network tab to see if requests are being made
- Check if requests show CORS errors

### 4. Verify CORS is working
The backend should allow requests from `http://localhost:3000`. Check the server logs when making a request.

### 5. Restart both servers
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd ..  # (go back to root)
npm run dev
```

### 6. Clear browser cache
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or clear browser cache completely

### 7. Check firewall/antivirus
Some security software blocks localhost connections. Try temporarily disabling it.

### 8. Try different browser
Sometimes browser extensions can interfere. Try:
- Incognito/Private mode
- Different browser
- Disable extensions

## Common Issues

### Issue: "Failed to fetch" immediately
**Solution**: Backend is not running. Start it first.

### Issue: CORS error in console
**Solution**: Backend CORS is configured. Make sure backend is running on port 5001.

### Issue: Network error
**Solution**: Check if port 5001 is accessible:
```bash
lsof -i:5001
```

### Issue: Connection refused
**Solution**: Backend crashed or not started. Check backend terminal for errors.

## Debug Steps

1. **Check backend logs** - Look for any errors in the backend terminal
2. **Check frontend console** - Look for the exact error message
3. **Test API directly** - Use curl or Postman to test the API
4. **Check network tab** - See the actual request/response in browser DevTools

## Still Not Working?

1. Check if both servers are on the same machine
2. Verify no proxy is interfering
3. Check if port 5001 is blocked by firewall
4. Try using `127.0.0.1` instead of `localhost` in the config

