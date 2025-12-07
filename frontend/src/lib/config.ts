// API Configuration
// Change this to point to your backend server
export const API_BASE_URL =
  (typeof window !== 'undefined' && (window as any).__API_BASE_URL__) ||
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) ||
  "http://localhost:5001"

// API Endpoints
export const API_ENDPOINTS = {
  sales: `${API_BASE_URL}/api/sales`,
  filterOptions: `${API_BASE_URL}/api/sales/filter-options`,
  health: `${API_BASE_URL}/api/health`,
}

// Log for debugging
if (typeof window !== 'undefined') {
  console.log("API Base URL:", API_BASE_URL)
  console.log("API Endpoints:", API_ENDPOINTS)
}

