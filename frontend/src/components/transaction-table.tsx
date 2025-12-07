"use client"

export function TransactionTable({ data }: { data: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Transaction ID</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Date</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Customer ID</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Customer name</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Phone Number</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Gender</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Age</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Product Category</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Total Amount</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Customer region</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Product ID</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Employee name</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm text-slate-900 font-medium">{item["Transaction ID"]}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{item["Date"]}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{item["Customer ID"]}</td>
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{item["Customer name"]}</td>
              <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-1">
                {item["Phone Number"]}
                <button className="text-slate-400 hover:text-slate-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{item["Gender"]}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{item["Age"]}</td>
              <td className="px-6 py-4 text-sm">
                <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  {item["Product Category"]}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-slate-900">
                {String(item["Quantity"]).padStart(2, "0")}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-slate-900">
                ₹{item["Total Amount"]?.toLocaleString() || "0"}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{item["Customer region"]}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{item["Product ID"]}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{item["Employee name"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
