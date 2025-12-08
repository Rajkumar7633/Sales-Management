# Sales Management System - Backend

Node.js/Express backend server for the Sales Management System with MySQL database.

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   │   └── salesController.js
│   ├── db/              # Database configuration
│   │   └── mysql.js
│   ├── models/          # Database models
│   │   └── Sales.js
│   ├── services/        # Business logic
│   │   └── salesService.js
│   ├── scripts/         # Utility scripts
│   │   └── importCsvToMySql.js
│   ├── routes/          # API routes
│   │   └── sales.js
│   └── index.js         # Entry point
├── package.json
└── README.md
```

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

1. **Create MySQL Database**:
```sql
CREATE DATABASE sales_management;
```

2. **Configure Environment Variables**:
Create a `.env` file in the `backend/` directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sales_management
DB_PORT=3306
PORT=5001
NODE_ENV=development
ALLOWED_ORIGINS=
```

3. **Import CSV Data to MySQL**:
Make sure the CSV file `truestate_assignment_dataset.csv` is in the project root directory, then run:
```bash
npm run import:mysql
```

This will:
- Create the `sales` table with all required columns
- Import all records from the CSV file
- Show progress as it processes batches

### 3. Start the Server

```bash
npm run dev    # Development with hot reload (2GB memory)
npm start      # Production (400MB memory for Render)
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

- `DB_HOST` - MySQL host (default: localhost)
- `DB_USER` - MySQL username (required)
- `DB_PASSWORD` - MySQL password (default: empty)
- `DB_NAME` - MySQL database name (required)
- `DB_PORT` - MySQL port (default: 3306)
- `PORT` - Server port (default: 5001)
- `NODE_ENV` - Environment (development/production)
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins

## Data Source

The backend uses MySQL database. Data is imported from `truestate_assignment_dataset.csv` located in the project root directory using the import script.

## Features

- ✅ **Multiple Filter Selection**: Select multiple options within a single filter (e.g., multiple tags, categories)
- ✅ **Combined Filters**: Apply multiple different filters simultaneously (e.g., Tags + Category + Date Range)
- ✅ **Efficient Querying**: Uses indexed MySQL queries for fast filtering and sorting
- ✅ **Pagination**: Supports paginated results with metadata
- ✅ **Search**: Full-text search on customer name and phone number

## Architecture

- **Controllers**: Handle HTTP requests and responses
- **Models**: Database models with query methods
- **Services**: Business logic layer
- **Routes**: Define API endpoints and route handlers
- **DB**: Database connection pool configuration

