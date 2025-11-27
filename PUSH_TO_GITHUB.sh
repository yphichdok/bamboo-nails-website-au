#!/bin/bash

# Script to push Bamboo Nails Coomera website to GitHub
# Replace YOUR_USERNAME with your GitHub username
# Replace bamboo-nails-coomera with your repository name if different

echo "Setting up GitHub remote..."

# Add remote (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/bamboo-nails-coomera.git

# Verify remote was added
echo "Remote added. Verifying..."
git remote -v

echo ""
echo "Ready to push! Run the following command:"
echo "git push -u origin main"
echo ""
echo "If you need to authenticate, GitHub will prompt you for credentials."

