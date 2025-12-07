#!/bin/bash

echo "🚀 Starting automated GitHub push for Sales Management System..."
echo ""

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
    echo ""
fi

# Stage all files
echo "📦 Staging all files..."
git add .
echo "✅ All files staged"
echo ""

# Create commit with timestamp
COMMIT_MESSAGE="Deploy Sales Management System - $(date '+%Y-%m-%d %H:%M:%S')"
echo "💾 Creating commit..."
git commit -m "$COMMIT_MESSAGE"
echo "✅ Commit created"
echo ""

# Set branch to main
echo "🔀 Setting branch to main..."
git branch -M main
echo "✅ Branch set to main"
echo ""

# Add remote if not exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin https://github.com/Rajkumar7633/Sales-Management.git
    echo "✅ Remote added"
else
    echo "ℹ️  Remote already configured"
fi
echo ""

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main
echo ""
echo "✅ Successfully pushed to GitHub!"
echo "📍 Repository: https://github.com/Rajkumar7633/Sales-Management"
echo "✨ Your code is now live!"
