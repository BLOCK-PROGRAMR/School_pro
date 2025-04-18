#!/bin/bash
# Custom build script for Render deployment

# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Clean cache and old dependencies
rm -rf node_modules package-lock.json

# Install dependencies
npm install --include=dev

# Build the application
npm run build

# Output success message
echo "Build completed successfully!"
