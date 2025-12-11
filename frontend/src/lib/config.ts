// API Configuration
// Use relative URLs to call Next.js API routes (which proxy to backend)
// This works in both development and production
export const API_BASE_URL = typeof window !== 'undefined' ? '' : "http://localhost:5001"

// Backend URL for direct health checks (optional)
export const BACKEND_URL =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) ||
  "https://sales-management-backend-noas.onrender.com"

// API Endpoints - Use Next.js API routes which proxy to backend
export const API_ENDPOINTS = {
  sales: `/api/sales`, // Calls Next.js route which proxies to backend
  filterOptions: `/api/filter-options`, // Calls Next.js route which proxies to backend
  health: `${BACKEND_URL}/api/health`, // Direct backend health check
}

// Log for debugging
if (typeof window !== 'undefined') {
  console.log("API Base URL:", API_BASE_URL)
  console.log("API Endpoints:", API_ENDPOINTS)
}

