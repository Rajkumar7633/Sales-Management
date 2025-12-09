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

# Sales Management System

A full-stack sales management application with Node.js backend and React frontend, deployed on Render with AWS RDS MySQL database.

---

## 🚀 Features

- ✅ Sales tracking and management
- ✅ Real-time database synchronization
- ✅ Cloud-based MySQL database (AWS RDS)
- ✅ Production-ready deployment on Render
- ✅ Responsive frontend with React

---

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL (local development)
- AWS Account (for RDS)
- Git

---

## 🛠️ Local Development Setup

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone <your-github-repo>
   cd sales-management-system/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `backend` folder:

   ```dotenv
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=sales_management
   DB_PORT=3306
   PORT=5001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Create local MySQL database**

   ```bash
   mysql -u root -p
   CREATE DATABASE sales_management;
   exit
   ```

5. **Start the backend server**

   ```bash
   npm run dev
   ```

   Server runs on: `http://localhost:5001`

---

## 🌐 Production Deployment on Render

### Step 1: Set Up AWS RDS MySQL Database

#### Create AWS RDS Instance

1. Go to [AWS RDS Console](https://console.aws.amazon.com/rds)
2. Click **"Create database"**
3. Select **MySQL** engine (version 8.0)
4. Configure:
   - **DB instance identifier**: `sales-management`
   - **Master username**: `admin`
   - **Master password**: `Raj76330Raj` (no @ symbol)
   - **DB name**: `sales_management`
   - **Storage**: 20GB (free tier)
5. Click **"Create database"**
6. Wait 5-10 minutes for creation
7. Copy the **Endpoint** from RDS dashboard

#### Enable Public Access

1. Click on your RDS instance
2. Click **"Modify"**
3. Set **"Publicly accessible"** to **Yes**
4. Click **"Apply immediately"**

#### Configure Security Group

1. Go to **Connectivity & security** tab
2. Click the **Security Group** link
3. Click **"Edit inbound rules"**
4. Add rule:
   - **Type**: MySQL/Aurora
   - **Port**: 3306
   - **Source**: `0.0.0.0/0` (for development) or your IP
5. Click **"Save rules"**

---

### Step 2: Migrate Data to AWS RDS

#### Backup Local Database

```bash
mysqldump -u root -p sales_management > backup.sql
```

#### Import to AWS RDS

```bash
mysql -h YOUR_RDS_ENDPOINT -u admin -p sales_management < backup.sql
```

Replace `YOUR_RDS_ENDPOINT` with your actual AWS RDS endpoint (e.g., `sales-management.cmzaeeuwo1rc.us-east-1.rds.amazonaws.com`)

---

### Step 3: Deploy Backend to Render

1. **Push code to GitHub**

   ```bash
   git add .
   git commit -m "Deploy to Render with AWS RDS"
   git push origin main
   ```

2. **Create Render Service**

   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Select the `backend` directory

3. **Add Environment Variables**

   Go to **Environment** tab and add:

   | Key               | Value                                                       |
   | ----------------- | ----------------------------------------------------------- |
   | `DB_HOST`         | `sales-management.cmzaeeuwo1rc.us-east-1.rds.amazonaws.com` |
   | `DB_USER`         | `admin`                                                     |
   | `DB_PASSWORD`     | `Raj76330Raj`                                               |
   | `DB_NAME`         | `sales_management`                                          |
   | `DB_PORT`         | `3306`                                                      |
   | `NODE_ENV`        | `production`                                                |
   | `PORT`            | `10000`                                                     |
   | `ALLOWED_ORIGINS` | `https://your-frontend.vercel.app`                          |

4. **Deploy**

   - Click **"Save, rebuild, and deploy"**
   - Wait 2-3 minutes for deployment
   - Check **Logs** tab for any errors

5. **Get Your Backend URL**
   - Copy the Render service URL (e.g., `https://sales-management-xxx.onrender.com`)
   - Update your frontend API endpoint to this URL

---

### Step 4: Deploy Frontend to Vercel

1. **Configure API endpoint**

   ```javascript
   // src/api/config.js
   const API_BASE_URL =
     process.env.REACT_APP_API_URL ||
     "https://your-render-backend.onrender.com";
   ```

2. **Push to GitHub**

   ```bash
   cd ../frontend
   git add .
   git commit -m "Update API endpoint for production"
   git push origin main
   ```

3. **Deploy on Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **"Import Project"**
   - Select your GitHub repository
   - Set **Root Directory** to `frontend`
   - Add environment variable: `REACT_APP_API_URL=https://your-render-backend.onrender.com`
   - Click **"Deploy"**

---

## 📊 Database Schema

### Tables Created Automatically

Your backend automatically creates these tables:

- `sales` - Sales records
- `customers` - Customer information
- `products` - Product catalog
- `users` - User accounts

Run migrations if needed:

```bash
npm run migrate
```

---

## 🔗 API Endpoints

### Health Check

```bash
GET http://localhost:5001/api/health
```

### Sales Management

```bash
GET    /api/sales           # Get all sales
POST   /api/sales           # Create new sale
GET    /api/sales/:id       # Get sale by ID
PUT    /api/sales/:id       # Update sale
DELETE /api/sales/:id       # Delete sale
```

---

## 🐛 Troubleshooting

### Issue: "Unknown database 'sales_management'"

**Solution**: Create the database on AWS RDS

```bash
mysql -h YOUR_RDS_ENDPOINT -u admin -p -e "CREATE DATABASE sales_management;"
```

### Issue: "Access denied for user 'admin'"

**Solution**: Check RDS Security Group allows your IP

1. Go to RDS Security Group
2. Add inbound rule for MySQL (port 3306)
3. Set source to your IP or `0.0.0.0/0`

### Issue: Connection timeout (ERROR 2003)

**Solution**:

1. Verify RDS is "Publicly accessible"
2. Check Security Group inbound rules
3. Verify correct endpoint in `.env`

### Issue: Render deployment fails

**Solution**:

1. Check **Logs** tab in Render
2. Verify all environment variables are set
3. Ensure GitHub repository is synced
4. Check RDS security group allows Render's IP

---

## 📚 Documentation

- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [Render Deployment Guide](https://render.com/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

## 🔐 Security Notes

⚠️ **Never commit `.env` file to GitHub**

- `.env` is already in `.gitignore`
- Always use environment variables for secrets
- Use strong passwords for production

---

## 📝 Environment Variables Reference

| Variable      | Development             | Production       |
| ------------- | ----------------------- | ---------------- |
| `NODE_ENV`    | `development`           | `production`     |
| `PORT`        | `5001`                  | `10000`          |
| `DB_HOST`     | `localhost`             | AWS RDS endpoint |
| `CORS_ORIGIN` | `http://localhost:3000` | Your Vercel URL  |

---

## 🚀 Performance Tips

1. **Database Indexing**: Create indexes on frequently queried columns
2. **Connection Pooling**: Use connection pooling for better performance
3. **Caching**: Implement Redis caching for read-heavy operations
4. **Pagination**: Use pagination for large datasets

---

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review AWS RDS documentation
3. Check Render logs for deployment errors
4. Review backend console logs

---

## 📄 License

This project is licensed under the MIT License.

---

**Last Updated**: January 2025
**Database**: AWS RDS MySQL 8.0
**Deployment**: Render + Vercel
