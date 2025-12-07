# Sales Management System - Backend

Node.js/Express backend server for the Sales Management System.

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   │   └── salesController.js
│   ├── services/        # Business logic
│   │   ├── data.js      # CSV data loading
│   │   └── salesService.js
│   ├── utils/           # Utility functions
│   │   └── filters.js   # Filtering and sorting logic
│   ├── routes/          # API routes
│   │   └── sales.js
│   └── index.js         # Entry point
├── package.json
└── README.md
```

## Setup

1. **Install dependencies**:
```bash
cd backend
npm install
```

2. **Start the server**:
```bash
npm run dev    # Development with hot reload
npm start      # Production
```

The server runs on `http://localhost:5001` by default.

## API Endpoints

### GET /api/sales
Fetch paginated and filtered sales transactions.

**Query Parameters:**
- `search` - Search customer name or phone number
- `page` - Page number (default: 1)
- `sortBy` - Sort field: `date`, `quantity`, `customerName`
- `sortOrder` - `asc` or `desc`
- `regions[]` - Filter by regions
- `genders[]` - Filter by genders
- `ageRange` - Filter by age range (e.g., "18-25")
- `categories[]` - Filter by product categories
- `tags[]` - Filter by tags
- `paymentMethods[]` - Filter by payment methods
- `dateRange` - Filter by date range

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 1000000,
    "totalPages": 100000
  },
  "metadata": {
    "totalUnits": 3000491,
    "totalAmount": 7577394604,
    "totalDiscount": 1893939248
  }
}
```

### GET /api/sales/filter-options
Get available filter options for dropdown menus.

**Response:**
```json
{
  "regions": ["North", "South", "East", "West", "Central"],
  "genders": ["Male", "Female", "Other"],
  "ageRanges": ["18-25", "26-35", "36-45", "46-55", "56+"],
  "categories": ["Clothing", "Electronics", "Home", "Sports", "Beauty"],
  "tags": [...],
  "paymentMethods": [...]
}
```

### GET /api/health
Health check endpoint.

## Environment Variables

- `PORT` - Server port (default: 5001)

## Data Source

The backend loads data from `truestate_assignment_dataset.csv` located in the project root directory. The CSV file contains ~1 million sales transactions.

## Architecture

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and data processing
- **Utils**: Reusable utility functions (filtering, sorting)
- **Routes**: Define API endpoints and route handlers

