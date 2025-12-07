# Getting Started - Sales Management System

## Quick Start (5 minutes)

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

### 3. Open Application
Navigate to \`http://localhost:3000\` in your browser

## What You'll See

- **Left Sidebar**: Navigation menu with Vault profile
- **Top Search**: Search by customer name or phone
- **Filter Bar**: Quick filters for Region, Gender, Age Range, Category, Tags, Payment Method, Date
- **Sort Dropdown**: Sort by Customer Name, Date, or Quantity
- **Metrics Cards**: Total Units Sold, Total Amount, Total Discount
- **Transaction Table**: Complete list of 10 transactions with all details
- **Pagination**: Navigate through pages with Previous/Next buttons

## Available Features

### Search
- Type a customer name or phone number
- Results update in real-time
- Case-insensitive matching

### Filters
- Customer Region (highlight with orange border)
- Gender
- Age Range
- Product Category
- Tags
- Payment Method
- Date Range

### Sorting
- By Customer Name (A-Z)
- By Date (Newest)
- By Quantity

### Pagination
- 10 items per page
- Navigate with Previous/Next buttons
- Page counter shows current position

## Backend Setup (Optional)

### Using Next.js API Routes (Default)
No setup needed - API routes are included in the frontend

### Using Standalone Node.js Server
\`\`\`bash
cd server
npm install
npm run dev
\`\`\`

Server runs on \`http://localhost:5001\`

## File Structure

\`\`\`
├── app/
│   ├── api/          # API endpoints
│   ├── page.tsx      # Main dashboard
│   └── layout.tsx    # Root layout
├── components/       # React components
├── lib/             # Business logic
├── server/          # Optional Node.js backend
└── docs/            # Documentation
\`\`\`

## Keyboard Shortcuts (Planned)
- Ctrl+F: Focus search
- Ctrl+Shift+X: Clear all filters

## Troubleshooting

### "Cannot find module" errors
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Port 3000 already in use
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

### API returns 500 error
- Check browser console for details
- Verify data generation in lib/data.ts
- Check API route implementation

## Next Steps

1. **Explore the UI**: Interact with all filters and search
2. **Check the Code**: Review how search/filters are implemented
3. **Read Documentation**: See docs/architecture.md for technical details
4. **Customize Data**: Modify lib/data.ts to change sample data
5. **Add Database**: Replace data.ts with your database queries

## Sample Data

The system generates 50 sample transactions with:
- Customer information (ID, name, phone, gender, age)
- Product details (category, quantity)
- Transaction details (date, amount, discount)
- Payment and delivery information
- Employee assignment

All data is randomized for variety.

## API Examples

### Fetch all sales
\`\`\`bash
curl "http://localhost:3000/api/sales"
\`\`\`

### Search for customer
\`\`\`bash
curl "http://localhost:3000/api/sales?search=neha"
\`\`\`

### Filter by region
\`\`\`bash
curl "http://localhost:3000/api/sales?regions[]=North&regions[]=South"
\`\`\`

### Sort by date (descending)
\`\`\`bash
curl "http://localhost:3000/api/sales?sortBy=date&sortOrder=desc"
\`\`\```

### Get filter options
\`\`\`bash
curl "http://localhost:3000/api/filter-options"
\`\`\`

## Performance Tips

- Search is optimized for 50-1000 items
- For larger datasets, integrate with a database
- Filters work best with 20-100 unique values per dimension
- Pagination keeps memory usage constant regardless of dataset size

## Support

- **Documentation**: See README.md and docs/architecture.md
- **Issues**: Check the troubleshooting section
- **Code**: Review component implementations for examples
