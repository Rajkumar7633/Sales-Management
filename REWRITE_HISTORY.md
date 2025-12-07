# Fix: Remove Large File from Git History

## Problem
The CSV file is still in your first commit, so GitHub will reject the push even though we've moved it to Git LFS.

## Solution: Rewrite Git History

We need to remove the CSV from the first commit and re-add it with Git LFS.

### Option 1: Interactive Rebase (Recommended)

```bash
cd /Users/apple/Downloads/sales-management-system

# Start interactive rebase from the beginning
git rebase -i --root

# In the editor that opens:
# - Change the first commit from "pick" to "edit"
# - Save and close

# Remove the CSV from that commit
git rm --cached truestate_assignment_dataset.csv
git commit --amend --no-edit

# Continue the rebase
git rebase --continue

# Now add the CSV with LFS
git add truestate_assignment_dataset.csv
git commit --amend -m "Initial commit: Sales Management System (CSV in LFS)"

# Push (force push required since we rewrote history)
git push origin main --force
```

### Option 2: Reset and Recommit (Simpler, but loses commit history)

```bash
cd /Users/apple/Downloads/sales-management-system

# Save current state
git log --oneline > commits_backup.txt

# Reset to before any commits (keep files)
git update-ref -d HEAD

# Add everything fresh (CSV will use LFS automatically)
git add .
git commit -m "Initial commit: Sales Management System"

# Force push (since we're rewriting history)
git push origin main --force
```

### Option 3: Use BFG Repo-Cleaner (Best for large repos)

```bash
# Install BFG
brew install bfg

# Remove large files from history
bfg --strip-blobs-bigger-than 100M

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Push
git push origin main --force
```

## ⚠️ Important Notes

1. **Force Push**: All options require `--force` push since we're rewriting history
2. **Backup**: Make sure you have a backup of your code
3. **Collaboration**: If others have cloned the repo, they'll need to re-clone

## Recommended: Option 2 (Simplest)

Since you just started and have only 2 commits, Option 2 is the simplest and safest.

