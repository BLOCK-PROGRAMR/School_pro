#!/bin/bash
# Custom build script for Render deployment

# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Install dependencies
npm install

# Build the application
npm run build

# Output success message
echo "Build completed successfully!" 