export function MetricsCards({ metadata }: { metadata: any }) {
  return (
    <div className="flex gap-6">
      <div className="bg-white rounded-lg border-2 border-green-500 p-6 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600 font-medium">Total units sold</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{metadata.totalUnits}</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600 font-medium">Total Amount</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              ₹{(metadata.totalAmount || 0).toLocaleString()}{" "}
              <span className="text-sm text-slate-600 font-normal">(19 SRs)</span>
            </p>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600 font-medium">Total Discount</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              ₹{(metadata.totalDiscount || 0).toLocaleString()}{" "}
              <span className="text-sm text-slate-600 font-normal">(45 SRs)</span>
            </p>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
