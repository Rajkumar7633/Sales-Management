"use client"

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 bg-slate-900 text-white flex flex-col">
      {/* Logo and User Profile */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold">V</span>
          </div>
          <div>
            <p className="font-semibold text-sm">Vault</p>
            <p className="text-xs text-slate-400">Anurag Yadav</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavItem icon="dashboard" label="Dashboard" active />
        <NavItem icon="nexus" label="Nexus" />
        <NavItem icon="intake" label="Intake" />

        {/* Services Expandable */}
        <div className="mt-6">
          <div className="px-3 py-2 text-slate-400 text-sm font-medium flex items-center justify-between cursor-pointer hover:text-slate-200 transition-colors">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Services
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <div className="ml-6 mt-1 space-y-1">
            <NavSubItem label="Pre-active" />
            <NavSubItem label="Active" />
            <NavSubItem label="Blocked" />
            <NavSubItem label="Closed" />
          </div>
        </div>

        {/* Invoices Expandable */}
        <div className="mt-6">
          <div className="px-3 py-2 text-slate-400 text-sm font-medium flex items-center justify-between cursor-pointer hover:text-slate-200 transition-colors">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Invoices
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <div className="ml-6 mt-1 space-y-1">
            <NavSubItem label="Proforma Invoices" />
            <NavSubItem label="Final Invoices" />
          </div>
        </div>
      </nav>
    </aside>
  )
}

function NavItem({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
        active ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
      }`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
        />
      </svg>
      {label}
    </button>
  )
}

function NavSubItem({ label }: { label: string }) {
  return (
    <button className="w-full px-3 py-1.5 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-left flex items-center gap-2">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 10l5 5 5-5z" />
      </svg>
      {label}
    </button>
  )
}
