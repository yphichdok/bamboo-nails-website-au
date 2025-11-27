#!/bin/bash

# Script to push Bamboo Nails Coomera website to GitHub

echo "Setting up GitHub remote..."

# Add remote
git remote add origin https://github.com/yphichdok/bamboo-nails-website-au.git

# Verify remote was added
echo "Remote added. Verifying..."
git remote -v

echo ""
echo "Ready to push! Run the following command:"
echo "git push -u origin main"
echo ""
echo "If you need to authenticate, GitHub will prompt you for credentials."

