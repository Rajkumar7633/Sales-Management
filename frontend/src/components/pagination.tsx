"use client"

import { useSalesStore } from "@/lib/store"

export function Pagination({ pagination }: { pagination: any }) {
  const store = useSalesStore()

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-slate-600">
        Page <span className="font-semibold">{pagination.page}</span> of{" "}
        <span className="font-semibold">{pagination.totalPages}</span>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => store.setPage(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => store.setPage(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}
