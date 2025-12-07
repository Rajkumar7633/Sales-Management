# How to Run Backend and Frontend

## Option 1: Run Frontend Only (Recommended for Development)

The frontend includes Next.js API routes, so you can run just the frontend and it will work independently.

### Steps:

1. **Install dependencies** (if not already done):
```bash
npm install
```

2. **Start the development server**:
```bash
npm run dev
```

3. **Open your browser**:
Navigate to `http://localhost:3000`

The frontend will automatically load data from the CSV file and handle all API requests through Next.js API routes.

---

## Option 2: Run Both Frontend and Backend Separately

If you want to use the standalone Express backend server:

### Terminal 1 - Start Backend Server:

1. **Navigate to server directory**:
```bash
cd server
```

2. **Install dependencies** (if not already done):
```bash
npm install
```

3. **Start the backend server**:
```bash
npm run dev
```

You should see:
```
Loading sales data from CSV...
Loaded 1000000 records from CSV
Sales Management System Backend running on http://localhost:5000
```

The backend runs on **http://localhost:5000**

### Terminal 2 - Start Frontend:

1. **Go back to root directory** (if you're in server folder):
```bash
cd ..
```

2. **Start the frontend**:
```bash
npm run dev
```

The frontend runs on **http://localhost:3000**

---

## Quick Start Commands Summary

### Frontend Only (Easiest):
```bash
# In root directory
npm install
npm run dev
# Open http://localhost:3000
```

### Both Frontend and Backend:
```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend  
cd ..  # (if you're in server folder)
npm install
npm run dev
```

---

## Important Notes:

1. **CSV File Location**: Make sure `truestate_assignment_dataset.csv` is in the root directory of the project.

2. **Memory Requirements**: The CSV file has ~1 million rows, so the application uses increased memory (4GB). This is already configured in the scripts.

3. **First Load**: The first time you start the server, it will take some time to load the CSV file into memory. Subsequent requests will be fast.

4. **Ports**:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`

5. **API Endpoints**:
   - Next.js API Routes: `http://localhost:3000/api/sales` and `http://localhost:3000/api/filter-options`
   - Express Backend: `http://localhost:5000/api/sales` and `http://localhost:5000/api/filter-options`

---

## Troubleshooting

### If you get "Cannot find module" errors:
```bash
# Reinstall dependencies
npm install
cd server
npm install
```

### If you get "Out of memory" errors:
The scripts already include increased memory limits. If you still have issues, you can increase it further:
```bash
# For frontend
NODE_OPTIONS='--max-old-space-size=8192' npm run dev

# For backend
cd server
NODE_OPTIONS='--max-old-space-size=8192' npm run dev
```

### If CSV file is not found:
Make sure `truestate_assignment_dataset.csv` is in the root directory:
```bash
ls truestate_assignment_dataset.csv
```

---

## Production Build

### Frontend:
```bash
npm run build
npm start
```

### Backend:
```bash
cd server
npm start
```

