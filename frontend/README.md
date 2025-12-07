# Sales Management System - Frontend

Next.js frontend application for the Sales Management System.

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes (optional)
│   │   ├── page.tsx      # Main dashboard
│   │   └── layout.tsx    # Root layout
│   ├── components/        # React components
│   │   ├── search-bar.tsx
│   │   ├── transaction-table.tsx
│   │   ├── pagination.tsx
│   │   └── ...
│   ├── lib/              # Business logic and utilities
│   │   ├── config.ts     # API configuration
│   │   ├── store.ts      # State management (Zustand)
│   │   ├── filters.ts    # Filtering logic
│   │   └── utils.ts      # Utility functions
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service functions
│   ├── utils/            # Utility functions
│   └── styles/           # Global styles
├── public/               # Static assets
├── package.json
└── README.md
```

## Setup

1. **Install dependencies**:
```bash
cd frontend
npm install
```

2. **Start development server**:
```bash
npm run dev
```

The application runs on `http://localhost:3000` by default.

3. **Build for production**:
```bash
npm run build
npm start
```

## Configuration

The frontend connects to the backend API. Configure the API URL in `src/lib/config.ts`:

```typescript
export const API_BASE_URL = "http://localhost:5001"
```

Or set environment variable:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5001 npm run dev
```

## Features

- **Search**: Full-text search across customer names and phone numbers
- **Filters**: Multi-select filters for regions, genders, categories, tags, payment methods
- **Age Range**: Single-select age range filter
- **Sorting**: Sort by date, quantity, or customer name
- **Pagination**: 10 items per page with navigation
- **Real-time Updates**: Filters, search, and sorting update results instantly

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Zustand** - State management
- **Radix UI** - Accessible component primitives

## Development

### Project Structure

- `src/app/` - Next.js pages and API routes
- `src/components/` - Reusable React components
- `src/lib/` - Business logic, state management, utilities
- `src/hooks/` - Custom React hooks
- `public/` - Static files (images, icons, etc.)

### State Management

State is managed using Zustand store (`src/lib/store.ts`):
- Search query
- Current page
- Sort configuration
- Active filters
- Filter state management

### API Integration

The frontend communicates with the backend API:
- `GET /api/sales` - Fetch filtered and paginated data
- `GET /api/sales/filter-options` - Get available filter options

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:5001)

