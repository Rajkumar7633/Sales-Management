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
  const [filterOptions, setFilterOptions] = useState<any>(null)

  const store = useSalesStore()

  // Fetch data whenever store changes
  useEffect(() => {
    fetchData()
  }, [store.search, store.page, store.sortBy, store.sortOrder, store.filters])

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
      
      try {
        // First check if backend data is loaded
        const healthRes = await fetch(API_ENDPOINTS.health, {
          method: "GET",
          mode: "cors",
        })
        
        if (healthRes.ok) {
          const health = await healthRes.json()
          if (!health.dataLoaded) {
            console.log("Backend data is still loading, will retry in 2 seconds...")
            // Retry after 2 seconds if data not loaded
            setTimeout(() => fetchOptions(), 2000)
            return
          }
        }
        
        // Fetch filter options
        await fetchOptions()
      } catch (error) {
        console.error("Error checking backend:", error)
        // Still try to fetch options
        fetchOptions()
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
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin mb-4">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full" />
                </div>
                <p className="text-lg font-medium text-slate-900 mb-2">Loading transactions...</p>
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
