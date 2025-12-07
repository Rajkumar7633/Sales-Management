# Sales Management System - TruEstate

A production-grade retail sales management system demonstrating advanced search, filtering, sorting, and pagination capabilities. Built with Next.js for the frontend and Node.js/Express for the backend.

## Project Structure

```
sales-management-system/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   ├── routes/          # API routes
│   │   └── index.js         # Entry point
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js pages
│   │   ├── components/      # React components
│   │   ├── lib/             # Business logic
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   ├── utils/            # Utilities
│   │   └── styles/          # Styles
│   ├── public/              # Static assets
│   ├── package.json
│   └── README.md
├── docs/
│   └── architecture.md      # Architecture documentation
├── truestate_assignment_dataset.csv  # Sales data (1M+ records)
└── README.md
```

## Features

✓ **Full-text Search**: Case-insensitive search across customer names and phone numbers
✓ **Multi-Select Filtering**: 7 filter dimensions (Region, Gender, Age Range, Category, Tags, Payment Method, Date Range)
✓ **Advanced Sorting**: Sort by Date, Quantity, or Customer Name (A-Z)
✓ **Pagination**: 10 items per page with Next/Previous navigation
✓ **State Preservation**: All filters, search, sort, and page state maintained across interactions
✓ **Edge Case Handling**: Handles empty results, conflicting filters, invalid ranges, and large combinations
✓ **Clean Architecture**: Separation of concerns with modular components

## Tech Stack

**Frontend**:
- Next.js 16+ with App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Zustand (state management)

**Backend**:
- Node.js/Express
- CSV parsing for data loading
- RESTful API architecture

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the server**:
```bash
npm run dev
```

The backend runs on `http://localhost:5001`

### Frontend Setup

1. **Navigate to frontend directory** (in a new terminal):
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm run dev
```

The frontend runs on `http://localhost:3000`

4. **Open your browser**:
Navigate to `http://localhost:3000`

## Data Source

The application uses `truestate_assignment_dataset.csv` located in the project root. This CSV file contains approximately 1 million sales transaction records.

## API Endpoints

### Backend API (Port 5001)

- `GET /api/sales` - Get filtered and paginated sales data
- `GET /api/sales/filter-options` - Get available filter options
- `GET /api/health` - Health check

See [backend/README.md](./backend/README.md) for detailed API documentation.

## Project Organization

### Backend Architecture
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and data processing
- **Utils**: Reusable utility functions (filtering, sorting)
- **Routes**: Define API endpoints

### Frontend Architecture
- **App Router**: Next.js 16 App Router for routing
- **Components**: Reusable UI components
- **State Management**: Zustand for global state
- **Services**: API communication layer

## Development

### Running Both Servers

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

### Building for Production

**Backend**:
```bash
cd backend
npm start
```

**Frontend**:
```bash
cd frontend
npm run build
npm start
```

## Configuration

### Backend
- Port: Set `PORT` environment variable (default: 5001)
- CSV Path: Automatically loads from project root

### Frontend
- API URL: Configure in `src/lib/config.ts` or set `NEXT_PUBLIC_API_URL` environment variable
- Default: `http://localhost:5001`

## Documentation

- [Backend README](./backend/README.md) - Backend setup and API documentation
- [Frontend README](./frontend/README.md) - Frontend setup and development guide
- [Architecture Documentation](./docs/architecture.md) - System architecture details

## Submission Requirements

This project follows the required structure:
- ✅ Single repository with `backend/` and `frontend/` directories
- ✅ Proper separation of concerns (controllers, services, utils, routes)
- ✅ Clean, maintainable code
- ✅ Comprehensive documentation
- ✅ All functionality working correctly

## License

MIT

## Author

TruEstate - SDE Intern Assignment
