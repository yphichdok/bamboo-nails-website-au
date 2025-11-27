#!/bin/bash

# Script to push Bamboo Nails website to GitHub
# Make sure the repository exists on GitHub first!

echo "🚀 Pushing Bamboo Nails website to GitHub..."
echo ""

# Set remote
git remote set-url origin https://github.com/yphichdok/bamboo-nails-website-au.git

# Show current status
echo "📊 Current git status:"
git status
echo ""

# Show commits to be pushed
echo "📝 Commits to push:"
git log --oneline -5
echo ""

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 Repository: https://github.com/yphichdok/bamboo-nails-website-au"
else
    echo ""
    echo "❌ Push failed. Possible reasons:"
    echo "   1. Repository doesn't exist - Create it at: https://github.com/new"
    echo "   2. Token doesn't have write permissions - Check token scopes"
    echo "   3. Authentication failed - Verify your token"
    echo ""
    echo "💡 To push manually, run:"
    echo "   git push -u origin main"
    echo "   (Enter username: yphichdok, password: your token)"
fi

