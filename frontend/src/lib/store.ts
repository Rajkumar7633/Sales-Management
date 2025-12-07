import { create } from "zustand"

interface SalesStore {
  search: string
  page: number
  sortBy: string
  sortOrder: "asc" | "desc"
  filters: {
    regions: string[]
    genders: string[]
    ageRange: string
    categories: string[]
    tags: string[]
    paymentMethods: string[]
    dateRange: string
  }
  setSearch: (search: string) => void
  setPage: (page: number) => void
  setSortBy: (sortBy: string) => void
  setSortByAndOrder: (sortBy: string, sortOrder: "asc" | "desc") => void
  setSortOrder: (order: "asc" | "desc") => void
  setFilter: (filterName: string, value: any) => void
  resetFilters: () => void
}

const initialFilters = {
  regions: [],
  genders: [],
  ageRange: "",
  categories: [],
  tags: [],
  paymentMethods: [],
  dateRange: "",
}

export const useSalesStore = create<SalesStore>((set) => ({
  search: "",
  page: 1,
  sortBy: "customerName",
  sortOrder: "asc",
  filters: initialFilters,
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
  setSortBy: (sortBy) => {
    const defaultOrder = sortBy === "customerName" ? "asc" : sortBy === "date" ? "desc" : "asc"
    set({ sortBy, sortOrder: defaultOrder, page: 1 })
  },
  setSortByAndOrder: (sortBy, sortOrder) => set({ sortBy, sortOrder, page: 1 }),
  setSortOrder: (sortOrder) => set({ sortOrder, page: 1 }),
  setFilter: (filterName, value) =>
    set((state) => ({
      filters: { ...state.filters, [filterName]: value },
      page: 1,
    })),
  resetFilters: () =>
    set({
      search: "",
      page: 1,
      sortBy: "customerName",
      sortOrder: "asc",
      filters: initialFilters,
    }),
}))
