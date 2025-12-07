# Fix: GitHub File Size Limit Error

## Problem
GitHub rejected the push because `truestate_assignment_dataset.csv` is **223.15 MB**, which exceeds GitHub's **100 MB file size limit**.

## Solution: Use Git LFS (Large File Storage)

### Step 1: Install Git LFS

**On macOS:**
```bash
brew install git-lfs
```

**Or download from:**
https://git-lfs.github.com/

### Step 2: Setup Git LFS in Your Repository

```bash
cd /Users/apple/Downloads/sales-management-system

# Initialize Git LFS
git lfs install

# Track CSV files with Git LFS
git lfs track "*.csv"

# Add the .gitattributes file (this was created automatically)
git add .gitattributes

# Remove the CSV from Git history (but keep the local file)
git rm --cached truestate_assignment_dataset.csv

# Re-add it (now it will use LFS)
git add truestate_assignment_dataset.csv

# Commit the changes
git commit -m "Move CSV file to Git LFS"

# Push to GitHub
git push origin main
```

### Step 3: If You Need to Remove from Git History

If the CSV is already in your Git history, you may need to remove it:

```bash
# Remove from last commit (if it was just added)
git reset HEAD~1

# Or use BFG Repo-Cleaner for deeper history cleanup
# (Only if you have multiple commits with the large file)
```

## Alternative: Exclude CSV from Git

If you don't want to use Git LFS, you can exclude the CSV:

```bash
# Add to .gitignore
echo "truestate_assignment_dataset.csv" >> .gitignore

# Remove from Git (but keep local file)
git rm --cached truestate_assignment_dataset.csv

# Commit
git commit -m "Remove CSV from Git (too large)"

# Push
git push origin main
```

Then add instructions in README for users to add their own CSV file.

## Recommendation

**Use Git LFS** - It's the best solution for large data files that need to be version controlled.

