# Architecture Document - Sales Management System

## System Overview

The Sales Management System is a modern full-stack application built with Next.js that manages retail sales data with advanced filtering, searching, and sorting capabilities. The architecture emphasizes clean separation of concerns, reusable logic, and scalable patterns.

## Backend Architecture

### API Routes (`app/api/`)

**Sales Data Endpoint** (`/api/sales`)
- Accepts query parameters for search, filters, sorting, and pagination
- Orchestrates data retrieval, filtering, and pagination
- Returns paginated results with metadata (total units, amounts, discounts)
- Handles all query parameter parsing and validation

**Filter Options Endpoint** (`/api/filter-options`)
- Provides available filter options (regions, genders, categories, tags, etc.)
- Used by frontend on initial load to populate filter UI
- Extracts unique values from the sales dataset

### Data Layer (`lib/data.ts`)

**Core Functions:**
- `getSalesData()`: Retrieves sales data (currently generates sample data; can be extended for database/CSV)
- `generateSampleData()`: Creates 50 realistic sample transactions for testing
- `getFilterOptions()`: Extracts unique values for filter dropdowns

**Data Structure**: Each transaction contains customer, product, sales, and operational fields following the TruEstate dataset specification.

### Filtering and Sorting (`lib/filters.ts`)

**Core Functions:**
- `filterAndSortData()`: Main processing pipeline that applies all filters, sorting, and returns final dataset
- Sequential filter application: search → region → gender → age → category → tags → payment → date → sort

**Filter Processing:**
- Search: Case-insensitive substring matching on customer name and phone
- Multi-select filters: Array inclusion checks for region, gender, category, tags, payment method
- Age range: Numeric range validation (18-25, 26-35, etc.)
- Date range: String comparison for date filtering

**Sorting:**
- Date: Converts to timestamp and sorts descending (newest first)
- Quantity: Direct numeric sort
- Customer Name: Case-insensitive alphabetic sort

### State Management (`lib/store.ts`)

Zustand store (`useSalesStore`) manages:
- Search query
- Current page
- Sort field and order
- All active filters (regions, genders, age range, categories, tags, payment methods, date range)
- Helper functions: `setSearch()`, `setPage()`, `setSortBy()`, `setSortOrder()`, `setFilter()`, `resetFilters()`

## Frontend Architecture

### Components Structure

**Page Component** (`app/page.tsx`)
- Main dashboard orchestrator
- Fetches data from `/api/sales` based on store state
- Manages loading and error states
- Passes data to child components

**SearchBar Component** (`components/search-bar.tsx`)
- Controlled input for search query
- Updates store on input change
- Features clear search icon and placeholder

**FilterPanel Component** (`components/filter-panel.tsx`)
- Expandable filter sections for each dimension
- Multi-select checkboxes for most filters
- Radio buttons for age range (single selection)
- Reset filters button with visual feedback
- Sticky positioning for mobile friendliness

**TransactionTable Component** (`components/transaction-table.tsx`)
- Responsive table displaying transaction data
- 11 columns: Transaction ID, Date, Customer Name, Phone, Gender, Age, Category, Qty, Amount, Region, Employee
- Hover effects for better UX
- Handles empty state gracefully

**MetricsCards Component** (`components/metrics-cards.tsx`)
- Three cards showing KPIs: Total Units, Total Amount, Total Discount
- Color-coded with gradient backgrounds
- Updates based on filtered data

**Pagination Component** (`components/pagination.tsx`)
- Previous/Next buttons
- Disabled state at boundaries
- Page information display

### Data Flow

\`\`\`
User Interaction
    ↓
Zustand Store Update
    ↓
useEffect Triggers
    ↓
Build Query Parameters
    ↓
Fetch /api/sales
    ↓
Server-side Filtering & Sorting
    ↓
Pagination Applied
    ↓
Return to Frontend
    ↓
Update Components & UI
\`\`\`

## Folder Structure

\`\`\`
root/
├── app/
│   ├── api/
│   │   ├── sales/
│   │   │   └── route.ts          # Main API endpoint
│   │   └── filter-options/
│   │       └── route.ts          # Filter options endpoint
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── page.tsx                  # Dashboard page
├── components/
│   ├── search-bar.tsx            # Search input component
│   ├── filter-panel.tsx          # Filter sidebar component
│   ├── transaction-table.tsx     # Data table component
│   ├── metrics-cards.tsx         # KPI cards component
│   └── pagination.tsx            # Pagination controls
├── lib/
│   ├── data.ts                   # Data layer & generation
│   ├── filters.ts                # Filter & sort logic
│   └── store.ts                  # Zustand store
├── docs/
│   └── architecture.md           # This file
├── README.md                     # Project documentation
├── package.json
└── tsconfig.json
\`\`\`

## Module Responsibilities

### API Layer
- **Responsibility**: Request routing and response formatting
- **Does**: Parse query parameters, call business logic, return JSON
- **Doesn't**: Implement filtering logic, manage UI state

### Business Logic Layer (`filters.ts`)
- **Responsibility**: Data processing and filtering
- **Does**: Apply filters, sort data, handle edge cases
- **Doesn't**: Manage UI, handle HTTP requests

### Data Layer (`data.ts`)
- **Responsibility**: Data retrieval and structure
- **Does**: Generate or fetch data, provide filter options
- **Doesn't**: Process or filter data

### Frontend Components
- **Responsibility**: UI rendering and user interaction
- **Does**: Display data, collect filters, trigger updates
- **Doesn't**: Process data, duplicate filtering logic

### State Management (`store.ts`)
- **Responsibility**: Application state
- **Does**: Store and update application state
- **Doesn't**: Fetch data, perform business logic

## Edge Case Handling

1. **No Search Results**: Displays "No transactions found" message, pagination hidden
2. **Conflicting Filters**: All filters work together; users can combine any filters
3. **Invalid Numeric Ranges**: Age range uses predefined options, no invalid input possible
4. **Large Filter Combinations**: Filters applied sequentially for efficiency
5. **Missing Optional Fields**: All required fields present in dataset; graceful handling for missing data
6. **Empty Datasets**: Backend returns empty array with correct pagination metadata

## Performance Considerations

- **Server-side Filtering**: Reduces data transfer and computation on client
- **Pagination**: Only 10 items returned per request
- **Zustand Store**: Lightweight state management with minimal re-renders
- **Memoization**: Components use stable references for filter options
- **Query Parameters**: Stateless API design allows caching

## Scalability Path

1. **Database Integration**: Replace `getSalesData()` with database queries (PostgreSQL, MongoDB)
2. **Caching**: Add Redis for filter options and frequently accessed data
3. **Indexing**: Create database indexes on frequently filtered fields
4. **API Optimization**: Implement batch queries and GraphQL if needed
5. **Frontend Caching**: Add SWR or React Query for client-side caching
\`\`\`

```typescript file="" isHidden
