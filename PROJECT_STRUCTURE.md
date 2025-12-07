# Project Structure

This document outlines the complete project structure as per submission requirements.

## Root Directory

```
sales-management-system/
├── backend/                    # Backend server
├── frontend/                   # Frontend application
├── docs/                       # Documentation
├── truestate_assignment_dataset.csv  # Data source
├── README.md                   # Main README
└── PROJECT_STRUCTURE.md        # This file
```

## Backend Structure

```
backend/
├── src/
│   ├── controllers/           # Request handlers
│   │   └── salesController.js
│   ├── services/              # Business logic
│   │   ├── data.js           # CSV data loading
│   │   └── salesService.js   # Sales business logic
│   ├── utils/                # Utility functions
│   │   └── filters.js        # Filtering and sorting
│   ├── routes/               # API routes
│   │   └── sales.js          # Sales routes
│   ├── models/               # Data models (if required)
│   └── index.js             # Entry point
├── package.json
└── README.md
```

## Frontend Structure

```
frontend/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API routes (optional)
│   │   ├── page.tsx          # Main dashboard
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── search-bar.tsx
│   │   ├── transaction-table.tsx
│   │   ├── pagination.tsx
│   │   ├── metrics-cards.tsx
│   │   ├── sidebar.tsx
│   │   └── ui/              # UI component library
│   ├── lib/                 # Business logic
│   │   ├── config.ts        # API configuration
│   │   ├── store.ts         # State management
│   │   ├── filters.ts       # Filtering logic
│   │   └── utils.ts         # Utilities
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API service functions
│   ├── utils/               # Utility functions
│   ├── styles/              # Additional styles
│   └── pages/               # Additional pages (if needed)
├── public/                  # Static assets
├── package.json
├── tsconfig.json
├── next.config.mjs
└── README.md
```

## Documentation Structure

```
docs/
└── architecture.md          # Architecture documentation
```

## Key Files

### Backend
- `backend/src/index.js` - Server entry point
- `backend/src/controllers/salesController.js` - Request handlers
- `backend/src/services/salesService.js` - Business logic
- `backend/src/services/data.js` - Data loading from CSV
- `backend/src/utils/filters.js` - Filtering and sorting logic
- `backend/src/routes/sales.js` - API route definitions

### Frontend
- `frontend/src/app/page.tsx` - Main dashboard page
- `frontend/src/lib/store.ts` - State management (Zustand)
- `frontend/src/lib/config.ts` - API configuration
- `frontend/src/components/` - All React components

## Module Responsibilities

### Backend

**Controllers** (`controllers/`):
- Handle HTTP requests and responses
- Validate input parameters
- Call appropriate services
- Return formatted responses

**Services** (`services/`):
- Contain business logic
- Process data
- Handle data loading from CSV
- Perform data transformations

**Utils** (`utils/`):
- Reusable utility functions
- Filtering logic
- Sorting logic
- Data manipulation helpers

**Routes** (`routes/`):
- Define API endpoints
- Map routes to controllers
- Handle route-specific middleware

### Frontend

**App** (`app/`):
- Next.js pages and routing
- API routes (if using Next.js API)
- Layout components

**Components** (`components/`):
- Reusable UI components
- Presentational components
- UI component library

**Lib** (`lib/`):
- State management
- Business logic
- API configuration
- Utility functions

**Hooks** (`hooks/`):
- Custom React hooks
- Reusable hook logic

**Services** (`services/`):
- API communication
- Data fetching logic

## Data Flow

1. **Frontend** → User interaction (search, filter, sort)
2. **Frontend** → API request to backend
3. **Backend** → Controller receives request
4. **Backend** → Service processes request
5. **Backend** → Utils apply filters/sorting
6. **Backend** → Service returns paginated data
7. **Backend** → Controller sends response
8. **Frontend** → Updates UI with new data

## Submission Checklist

✅ Single repository structure  
✅ `backend/` directory with `src/` subdirectory  
✅ `frontend/` directory with `src/` subdirectory  
✅ Proper folder organization (controllers, services, utils, routes)  
✅ `docs/architecture.md` exists  
✅ README files in both backend and frontend  
✅ Root README.md with overview  
✅ All code properly organized  
✅ Clean separation of concerns  

