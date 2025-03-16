#!/bin/bash
# Frontend build script for Render deployment

# Set Node options for increased memory
export NODE_OPTIONS="--max-old-space-size=4096"

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building application..."
npm run build

# Verify the build output
if [ -d "dist" ]; then
  echo "Build successful! dist directory created."
  # List the contents of the dist directory
  ls -la dist
else
  echo "Build failed! dist directory not found."
  exit 1
fi 