"use client"

import { useState, useEffect } from "react"
import { SearchBar } from "@/components/search-bar"
import { TransactionTable } from "@/components/transaction-table"
import { Pagination } from "@/components/pagination"
import { MetricsCards } from "@/components/metrics-cards"
import { Sidebar } from "@/components/sidebar"
import { useSalesStore } from "@/lib/store"
import { API_ENDPOINTS, API_BASE_URL } from "@/lib/config"

export default function Dashboard() {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalItems: 0, totalPages: 0 })
  const [metadata, setMetadata] = useState({ totalUnits: 0, totalAmount: 0, totalDiscount: 0 })
  const [loading, setLoading] = useState(true)
  const [backendLoading, setBackendLoading] = useState(true)
  const [filterOptions, setFilterOptions] = useState<any>(null)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  const store = useSalesStore()

  // Fetch data whenever store changes (but wait for backend to be ready)
  useEffect(() => {
    if (!backendLoading && !connectionError) {
    fetchData()
    }
  }, [store.search, store.page, store.sortBy, store.sortOrder, store.filters, backendLoading, connectionError])

  // Check backend status and fetch filter options on mount
  useEffect(() => {
    const checkBackendAndFetch = async () => {
    const fetchOptions = async () => {
      try {
        console.log("Fetching filter options from:", API_ENDPOINTS.filterOptions)
        const res = await fetch(API_ENDPOINTS.filterOptions, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          credentials: "omit",
        })

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        setFilterOptions(data)
      } catch (error) {
        console.error("Error fetching filter options:", error)
        console.error("API URL:", API_ENDPOINTS.filterOptions)
        // Set empty options on error
        setFilterOptions({
          regions: [],
          genders: [],
          ageRanges: ["18-25", "26-35", "36-45", "46-55", "56+"],
          categories: [],
          tags: [],
          paymentMethods: [],
        })
      }
    }
      
      // Check if API URL is configured (not localhost in production)
      if (typeof window !== 'undefined' && API_BASE_URL.includes('localhost')) {
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
        if (isProduction) {
          setConnectionError("⚠️ Backend API URL not configured! Please set NEXT_PUBLIC_API_URL in Vercel environment variables.")
          setBackendLoading(false)
          console.error("❌ API URL is localhost in production!")
          console.error("Please set NEXT_PUBLIC_API_URL in Vercel to: https://sales-management-backend-fndm.onrender.com")
          return
        }
      }

      try {
        // First check if backend data is loaded
        console.log("Checking backend health at:", API_ENDPOINTS.health)
        const healthRes = await fetch(API_ENDPOINTS.health, {
          method: "GET",
          mode: "cors",
          signal: AbortSignal.timeout(10000), // 10 second timeout
        })
        
        if (healthRes.ok) {
          const health = await healthRes.json()
          console.log("Backend health:", health)
          // Health endpoint returns { ok: true, db: true } - if db is true, backend is ready
          if (health.ok && health.db) {
            console.log("✅ Backend is ready and connected to database")
            setConnectionError(null) // Clear any previous errors
          } else {
            console.log("⚠️ Backend health check passed but database not connected")
            setConnectionError("Backend database not connected. Please check backend logs.")
          }
        } else {
          console.error("Backend health check failed:", healthRes.status, healthRes.statusText)
          setConnectionError(`Backend returned error: ${healthRes.status}`)
        }
        
        // Fetch filter options
        await fetchOptions()
        setBackendLoading(false)
        setConnectionError(null)
      } catch (error: any) {
        console.error("Error checking backend:", error)
        console.error("API Base URL:", API_BASE_URL)
        
        // Set user-friendly error message
        if (error.name === 'AbortError') {
          setConnectionError("Connection timeout. Backend may be slow to respond.")
        } else if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
          setConnectionError("Cannot connect to backend. Check if backend is running and CORS is configured.")
        } else {
          setConnectionError(`Connection error: ${error.message || 'Unknown error'}`)
        }
        
        setBackendLoading(false)
        
        // Still try to fetch options, but it will likely fail
        try {
          await fetchOptions()
        } catch (e) {
          console.error("Failed to fetch options:", e)
        }
      }
    }
    
    checkBackendAndFetch()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search: store.search,
        page: store.page.toString(),
        pageSize: "10",
        sortBy: store.sortBy,
        sortOrder: store.sortOrder,
      })

      if (store.filters.regions.length > 0) {
        store.filters.regions.forEach((r) => params.append("regions[]", r))
      }
      if (store.filters.genders.length > 0) {
        store.filters.genders.forEach((g) => params.append("genders[]", g))
      }
      if (store.filters.ageRange) {
        params.append("ageRange", store.filters.ageRange)
      }
      if (store.filters.categories.length > 0) {
        store.filters.categories.forEach((c) => params.append("categories[]", c))
      }
      if (store.filters.tags.length > 0) {
        store.filters.tags.forEach((t) => params.append("tags[]", t))
      }
      if (store.filters.paymentMethods.length > 0) {
        store.filters.paymentMethods.forEach((pm) => params.append("paymentMethods[]", pm))
      }
      if (store.filters.dateRange) {
        params.append("dateRange", store.filters.dateRange)
      }

      const url = `${API_ENDPOINTS.sales}?${params}`
      console.log("Fetching from:", url)
      
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const result = await res.json()

      setData(result.data || [])
      setPagination(result.pagination || { page: 1, pageSize: 10, totalItems: 0, totalPages: 0 })
      setMetadata(result.metadata || { totalUnits: 0, totalAmount: 0, totalDiscount: 0 })
    } catch (error) {
      console.error("Error fetching data:", error)
      console.error("API URL:", API_ENDPOINTS.sales)
      // Set empty data on error
      setData([])
      setPagination({ page: 1, pageSize: 10, totalItems: 0, totalPages: 0 })
      setMetadata({ totalUnits: 0, totalAmount: 0, totalDiscount: 0 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto flex flex-col">
        <header className="border-b border-slate-200 bg-white sticky top-0 z-10 px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Sales Management System</h1>
            <SearchBar />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <select
                value={store.filters.regions.length > 0 ? store.filters.regions[0] : ""}
                onChange={(e) => {
                  if (e.target.value) {
                    store.setFilter("regions", [e.target.value])
                  } else {
                    store.setFilter("regions", [])
                  }
                }}
                className="appearance-none px-4 py-2 pr-8 border-2 border-orange-500 rounded-lg text-sm font-medium text-slate-900 bg-white cursor-pointer hover:border-orange-600 transition-colors"
              >
                <option value="">Customer Region</option>
                {filterOptions?.regions?.map((r: string) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            <div className="relative">
              <select
                value={store.filters.genders.length > 0 ? store.filters.genders[0] : ""}
                onChange={(e) => {
                  if (e.target.value) {
                    store.setFilter("genders", [e.target.value])
                  } else {
                    store.setFilter("genders", [])
                  }
                }}
                className="appearance-none px-4 py-2 pr-8 border border-slate-300 rounded-lg text-sm font-medium text-slate-900 bg-white cursor-pointer hover:border-slate-400 transition-colors"
              >
                <option value="">Gender</option>
                {filterOptions?.genders?.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            <div className="relative">
              <select
                value={store.filters.ageRange}
                onChange={(e) => {
                  store.setFilter("ageRange", e.target.value)
                }}
                className="appearance-none px-4 py-2 pr-8 border border-slate-300 rounded-lg text-sm font-medium text-slate-900 bg-white cursor-pointer hover:border-slate-400 transition-colors"
              >
                <option value="">Age Range</option>
                {filterOptions?.ageRanges?.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            <div className="relative">
              <select
                value={store.filters.categories.length > 0 ? store.filters.categories[0] : ""}
                onChange={(e) => {
                  if (e.target.value) {
                    store.setFilter("categories", [e.target.value])
                  } else {
                    store.setFilter("categories", [])
                  }
                }}
                className="appearance-none px-4 py-2 pr-8 border border-slate-300 rounded-lg text-sm font-medium text-slate-900 bg-white cursor-pointer hover:border-slate-400 transition-colors"
              >
                <option value="">Product Category</option>
                {filterOptions?.categories?.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            <div className="relative">
              <select
                value={store.filters.tags.length > 0 ? store.filters.tags[0] : ""}
                onChange={(e) => {
                  if (e.target.value) {
                    store.setFilter("tags", [e.target.value])
                  } else {
                    store.setFilter("tags", [])
                  }
                }}
                className="appearance-none px-4 py-2 pr-8 border border-slate-300 rounded-lg text-sm font-medium text-slate-900 bg-white cursor-pointer hover:border-slate-400 transition-colors"
              >
                <option value="">Tags</option>
                {filterOptions?.tags?.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            <div className="relative">
              <select
                value={store.filters.paymentMethods.length > 0 ? store.filters.paymentMethods[0] : ""}
                onChange={(e) => {
                  if (e.target.value) {
                    store.setFilter("paymentMethods", [e.target.value])
                  } else {
                    store.setFilter("paymentMethods", [])
                  }
                }}
                className="appearance-none px-4 py-2 pr-8 border border-slate-300 rounded-lg text-sm font-medium text-slate-900 bg-white cursor-pointer hover:border-slate-400 transition-colors"
              >
                <option value="">Payment Method</option>
                {filterOptions?.paymentMethods?.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            <div className="relative ml-auto">
              <select
                value={store.sortBy}
                onChange={(e) => {
                  const newSortBy = e.target.value
                  store.setSortBy(newSortBy)
                  // Set default sort order based on sort type
                  if (newSortBy === "customerName") {
                    store.setSortOrder("asc")
                  } else if (newSortBy === "date") {
                    store.setSortOrder("desc")
                  }
                }}
                className="appearance-none px-4 py-2 pr-8 border border-slate-300 rounded-lg text-sm font-medium text-slate-900 bg-white cursor-pointer hover:border-slate-400 transition-colors"
              >
                <option value="customerName">Sort by: Customer Name (A-Z)</option>
                <option value="date">Sort by: Date (Newest First)</option>
                <option value="quantity">Sort by: Quantity</option>
              </select>
              <svg
                className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </header>

        {/* Metrics Section */}
        <section className="border-b border-slate-200 bg-white px-8 py-6">
          <MetricsCards metadata={metadata} />
        </section>

        {/* Main Content */}
        <main className="flex-1 overflow-auto px-8 py-6">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            {connectionError ? (
              <div className="p-12 text-center">
                <div className="inline-block mb-4">
                  <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full" />
                </div>
                <p className="text-lg font-medium text-red-900 mb-2">Connection Error</p>
                <p className="text-sm text-red-700 mb-4">{connectionError}</p>
                {API_BASE_URL.includes('localhost') && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left max-w-2xl mx-auto">
                    <p className="text-sm font-semibold text-yellow-900 mb-2">🔧 Quick Fix:</p>
                    <ol className="text-sm text-yellow-800 list-decimal list-inside space-y-1">
                      <li>Go to Vercel Dashboard → Your Project → Settings → Environment Variables</li>
                      <li>Add: <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_API_URL</code> = <code className="bg-yellow-100 px-1 rounded">https://sales-management-backend-fndm.onrender.com</code></li>
                      <li>Redeploy your Vercel app</li>
                    </ol>
                  </div>
                )}
              </div>
            ) : loading || backendLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin mb-4">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full" />
                </div>
                <p className="text-lg font-medium text-slate-900 mb-2">
                  {backendLoading ? "Connecting to backend..." : "Loading transactions..."}
                </p>
                {pagination.totalItems > 0 ? (
                  <>
                    <p className="text-sm text-slate-500">Processing {pagination.totalItems.toLocaleString()} records</p>
                    <p className="text-xs text-slate-400 mt-2">Applying filters and sorting...</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-slate-500">Initializing data (first load may take 30-60 seconds)</p>
                    <p className="text-xs text-slate-400 mt-2">Loading 1,000,000+ records from CSV...</p>
                  </>
                )}
              </div>
            ) : data.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-slate-600">No transactions found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <TransactionTable data={data} />
                {data.length > 0 && (
                  <div className="border-t border-slate-200 px-8 py-4">
                    <Pagination pagination={pagination} />
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
