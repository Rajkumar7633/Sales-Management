# GitHub Setup Guide

## Pre-Push Checklist

✅ **Project Structure**
- [x] Backend in `backend/` directory
- [x] Frontend in `frontend/` directory
- [x] Documentation in `docs/` directory
- [x] CSV file in root directory

✅ **Files to Include**
- [x] All source code files
- [x] `package.json` files (backend and frontend)
- [x] Configuration files (tsconfig.json, next.config.mjs, etc.)
- [x] README.md files
- [x] Documentation files
- [x] CSV data file (`truestate_assignment_dataset.csv`)

✅ **Files to Exclude (via .gitignore)**
- [x] `node_modules/` directories
- [x] `.next/` build directories
- [x] Environment files (`.env`)
- [x] Log files
- [x] OS files (`.DS_Store`)
- [x] IDE files (`.vscode/`, `.idea/`)
- [x] Lock files (optional - you can keep them)

## Git Commands

### Initial Setup

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Sales Management System"

# Add remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/sales-management-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Subsequent Updates

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push
```

## Important Notes

1. **CSV File**: The `truestate_assignment_dataset.csv` file is **included** in the repository as it's the data source. It's ~224MB, so the first push may take some time.

2. **Node Modules**: Never commit `node_modules/`. Users should run `npm install` in both `backend/` and `frontend/` directories.

3. **Environment Variables**: If you have any sensitive configuration, use `.env` files (which are gitignored) or environment variables.

4. **Build Files**: `.next/` and other build directories are excluded. Users should run `npm run build` to generate them.

## Repository Structure for GitHub

```
sales-management-system/
├── .gitignore          ✅ Git ignore rules
├── .gitattributes      ✅ Git attributes
├── README.md           ✅ Main README
├── backend/            ✅ Backend code
│   ├── src/
│   ├── package.json
│   └── README.md
├── frontend/           ✅ Frontend code
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
├── docs/               ✅ Documentation
│   └── architecture.md
├── truestate_assignment_dataset.csv  ✅ Data file
└── [other documentation files]
```

## What Gets Pushed

✅ **Included:**
- All source code
- Configuration files
- Documentation
- CSV data file
- README files

❌ **Excluded (via .gitignore):**
- `node_modules/`
- `.next/`
- `.env` files
- Log files
- Build artifacts
- OS/IDE files

## After Pushing to GitHub

Users cloning your repository should:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/sales-management-system.git
   cd sales-management-system
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Run the application:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

## File Sizes

- CSV file: ~224MB (will be included)
- Total repository size: ~225-250MB (mostly the CSV file)
- First push may take 5-10 minutes depending on internet speed

## Best Practices

1. **Commit Messages**: Use clear, descriptive commit messages
2. **Branching**: Consider using branches for features
3. **Documentation**: Keep README files updated
4. **License**: Consider adding a LICENSE file
5. **Contributing**: Consider adding CONTRIBUTING.md if others will contribute

