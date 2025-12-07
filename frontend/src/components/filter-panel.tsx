"use client"

import type React from "react"

import { useState } from "react"
import { useSalesStore } from "@/lib/store"

export function FilterPanel({ options }: { options: any }) {
  const store = useSalesStore()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  if (!options) return null

  const toggleSection = (section: string) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleMultiSelect = (field: string, value: string) => {
    const current = store.filters[field as keyof typeof store.filters] as string[]
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    store.setFilter(field, updated)
  }

  const handleRangeSelect = (value: string) => {
    store.setFilter("ageRange", store.filters.ageRange === value ? "" : value)
  }

  const hasActiveFilters =
    store.filters.regions.length > 0 ||
    store.filters.genders.length > 0 ||
    store.filters.ageRange !== "" ||
    store.filters.categories.length > 0 ||
    store.filters.tags.length > 0 ||
    store.filters.paymentMethods.length > 0 ||
    store.filters.dateRange !== ""

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900">Filters</h3>
        {hasActiveFilters && (
          <button onClick={() => store.resetFilters()} className="text-xs text-blue-600 hover:text-blue-700">
            Reset
          </button>
        )}
      </div>

      {/* Customer Region */}
      <FilterSection title="Customer Region" expanded={expanded["region"]} onToggle={() => toggleSection("region")}>
        {options.regions.map((region: string) => (
          <label
            key={region}
            className="flex items-center gap-2 py-2 cursor-pointer hover:bg-slate-50 px-2 -mx-2 rounded"
          >
            <input
              type="checkbox"
              checked={store.filters.regions.includes(region)}
              onChange={() => handleMultiSelect("regions", region)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded"
            />
            <span className="text-sm text-slate-700">{region}</span>
          </label>
        ))}
      </FilterSection>

      {/* Gender */}
      <FilterSection title="Gender" expanded={expanded["gender"]} onToggle={() => toggleSection("gender")}>
        {options.genders.map((gender: string) => (
          <label
            key={gender}
            className="flex items-center gap-2 py-2 cursor-pointer hover:bg-slate-50 px-2 -mx-2 rounded"
          >
            <input
              type="checkbox"
              checked={store.filters.genders.includes(gender)}
              onChange={() => handleMultiSelect("genders", gender)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded"
            />
            <span className="text-sm text-slate-700">{gender}</span>
          </label>
        ))}
      </FilterSection>

      {/* Age Range */}
      <FilterSection title="Age Range" expanded={expanded["age"]} onToggle={() => toggleSection("age")}>
        {options.ageRanges.map((range: string) => (
          <label
            key={range}
            className="flex items-center gap-2 py-2 cursor-pointer hover:bg-slate-50 px-2 -mx-2 rounded"
          >
            <input
              type="radio"
              name="ageRange"
              checked={store.filters.ageRange === range}
              onChange={() => handleRangeSelect(range)}
              className="w-4 h-4 text-blue-600 border-slate-300"
            />
            <span className="text-sm text-slate-700">{range}</span>
          </label>
        ))}
      </FilterSection>

      {/* Product Category */}
      <FilterSection
        title="Product Category"
        expanded={expanded["category"]}
        onToggle={() => toggleSection("category")}
      >
        {options.categories.map((category: string) => (
          <label
            key={category}
            className="flex items-center gap-2 py-2 cursor-pointer hover:bg-slate-50 px-2 -mx-2 rounded"
          >
            <input
              type="checkbox"
              checked={store.filters.categories.includes(category)}
              onChange={() => handleMultiSelect("categories", category)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded"
            />
            <span className="text-sm text-slate-700">{category}</span>
          </label>
        ))}
      </FilterSection>

      {/* Tags */}
      <FilterSection title="Tags" expanded={expanded["tags"]} onToggle={() => toggleSection("tags")}>
        {options.tags.map((tag: string) => (
          <label key={tag} className="flex items-center gap-2 py-2 cursor-pointer hover:bg-slate-50 px-2 -mx-2 rounded">
            <input
              type="checkbox"
              checked={store.filters.tags.includes(tag)}
              onChange={() => handleMultiSelect("tags", tag)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded"
            />
            <span className="text-sm text-slate-700">{tag}</span>
          </label>
        ))}
      </FilterSection>

      {/* Payment Method */}
      <FilterSection title="Payment Method" expanded={expanded["payment"]} onToggle={() => toggleSection("payment")}>
        {options.paymentMethods.map((method: string) => (
          <label
            key={method}
            className="flex items-center gap-2 py-2 cursor-pointer hover:bg-slate-50 px-2 -mx-2 rounded"
          >
            <input
              type="checkbox"
              checked={store.filters.paymentMethods.includes(method)}
              onChange={() => handleMultiSelect("paymentMethods", method)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded"
            />
            <span className="text-sm text-slate-700">{method}</span>
          </label>
        ))}
      </FilterSection>
    </div>
  )
}

function FilterSection({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border-t border-slate-200 last:border-b">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 px-2 hover:bg-slate-50 transition-colors"
      >
        <span className="font-medium text-sm text-slate-900">{title}</span>
        <svg
          className={`w-4 h-4 text-slate-600 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
      {expanded && <div className="px-2 pb-3 space-y-1">{children}</div>}
    </div>
  )
}
