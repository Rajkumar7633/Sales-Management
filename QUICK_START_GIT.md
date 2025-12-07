# Quick Git Setup for GitHub

## Step 1: Initialize Git Repository

```bash
cd /Users/apple/Downloads/sales-management-system
git init
```

## Step 2: Add All Files

```bash
git add .
```

## Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: Sales Management System with CSV data loading"
```

## Step 4: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `sales-management-system` (or your preferred name)
3. Description: "Retail Sales Management System - TruEstate Assignment"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 5: Connect and Push

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/sales-management-system.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## What Will Be Pushed

✅ **Included:**
- All source code (backend/src/, frontend/src/)
- Configuration files
- Documentation (README.md, docs/)
- CSV data file (truestate_assignment_dataset.csv) - ~224MB
- Package.json files

❌ **Excluded (via .gitignore):**
- node_modules/ (482MB+ - users will install via npm)
- .next/ build directories
- .env files
- Log files
- OS/IDE files

## Repository Size

- **With node_modules excluded**: ~250MB (mostly CSV file)
- **First push time**: 5-10 minutes (depending on internet speed)

## After Pushing

Share your repository URL with:
```
https://github.com/YOUR_USERNAME/sales-management-system
```

## Common Git Commands

```bash
# Check status
git status

# Add specific files
git add filename

# Commit changes
git commit -m "Your message here"

# Push changes
git push

# Pull latest changes
git pull

# View commit history
git log

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout main
```

## Troubleshooting

### If push fails due to large file:
```bash
# The CSV file is large but should be fine
# If GitHub complains, you may need Git LFS (Large File Storage)
git lfs install
git lfs track "*.csv"
git add .gitattributes
git commit -m "Add Git LFS for CSV file"
```

### If you need to update .gitignore:
```bash
# Edit .gitignore, then:
git add .gitignore
git commit -m "Update .gitignore"
git push
```

