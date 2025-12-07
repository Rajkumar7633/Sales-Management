"use client"

import { useSalesStore } from "@/lib/store"

export function SearchBar() {
  const store = useSalesStore()

  return (
    <div className="relative w-96">
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="Name, Phone no."
        value={store.search}
        onChange={(e) => store.setSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg bg-white placeholder-slate-400 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
    </div>
  )
}
