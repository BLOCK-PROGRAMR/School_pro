#!/bin/bash

# Vidyanidhi Project Deployment Script
# This script helps automate the deployment process for both backend and frontend

echo "=== Vidyanidhi Project Deployment Script ==="
echo ""

# Function to deploy backend
deploy_backend() {
    echo "=== Deploying Backend ==="
    cd backend

    # Install dependencies
    echo "Installing backend dependencies..."
    npm install

    # Create Procfile if it doesn't exist
    if [ ! -f "Procfile" ]; then
        echo "Creating Procfile..."
        echo "web: node index.js" > Procfile
    fi

    # Check if Heroku CLI is installed
    if command -v heroku &> /dev/null; then
        echo "Deploying to Heroku..."
        
        # Check if already logged in to Heroku
        if ! heroku auth:whoami &> /dev/null; then
            heroku login
        fi
        
        # Create Heroku app if it doesn't exist
        if ! heroku apps:info vidyanidhi-backend &> /dev/null; then
            heroku create vidyanidhi-backend
        fi
        
        # Set environment variables
        echo "Setting environment variables..."
        heroku config:set MONGODB_URI="$MONGODB_URI" --app vidyanidhi-backend
        heroku config:set JWT_SECRET="$JWT_SECRET" --app vidyanidhi-backend
        heroku config:set CLOUDINARY_CLOUD_NAME="$CLOUDINARY_CLOUD_NAME" --app vidyanidhi-backend
        heroku config:set CLOUDINARY_API_KEY="$CLOUDINARY_API_KEY" --app vidyanidhi-backend
        heroku config:set CLOUDINARY_API_SECRET="$CLOUDINARY_API_SECRET" --app vidyanidhi-backend
        heroku config:set FRONTEND_URL="$FRONTEND_URL" --app vidyanidhi-backend
        
        # Deploy to Heroku
        git add .
        git commit -m "Prepare for deployment"
        git push heroku main
    else
        echo "Heroku CLI not found. Please install it or deploy manually."
        echo "Follow the instructions in deployment-guide.md"
    fi
    
    cd ..
    echo "Backend deployment process completed."
}

# Function to deploy frontend
deploy_frontend() {
    echo "=== Deploying Frontend ==="
    cd frontend
    
    # Install dependencies
    echo "Installing frontend dependencies..."
    npm install
    
    # Create production environment file
    echo "Creating production environment file..."
    cat > .env.production << EOL
VITE_API_URL=$BACKEND_URL/api
VITE_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME
VITE_UPLOAD_PRESET=$CLOUDINARY_UPLOAD_PRESET
EOL
    
    # Build the frontend
    echo "Building frontend..."
    npm run build
    
    # Check if Vercel CLI is installed
    if command -v vercel &> /dev/null; then
        echo "Deploying to Vercel..."
        vercel --prod
    else
        echo "Vercel CLI not found. Please install it or deploy manually."
        echo "Follow the instructions in deployment-guide.md"
    fi
    
    cd ..
    echo "Frontend deployment process completed."
}

# Main script
echo "What would you like to deploy?"
echo "1. Backend only"
echo "2. Frontend only"
echo "3. Both backend and frontend"
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        # Get backend environment variables
        read -p "Enter MongoDB URI: " MONGODB_URI
        read -p "Enter JWT Secret: " JWT_SECRET
        read -p "Enter Cloudinary Cloud Name: " CLOUDINARY_CLOUD_NAME
        read -p "Enter Cloudinary API Key: " CLOUDINARY_API_KEY
        read -p "Enter Cloudinary API Secret: " CLOUDINARY_API_SECRET
        read -p "Enter Frontend URL (e.g., https://vidyanidhi.vercel.app): " FRONTEND_URL
        
        deploy_backend
        ;;
    2)
        # Get frontend environment variables
        read -p "Enter Backend URL (e.g., https://vidyanidhi-backend.herokuapp.com): " BACKEND_URL
        read -p "Enter Cloudinary Cloud Name: " CLOUDINARY_CLOUD_NAME
        read -p "Enter Cloudinary Upload Preset: " CLOUDINARY_UPLOAD_PRESET
        
        deploy_frontend
        ;;
    3)
        # Get all environment variables
        read -p "Enter MongoDB URI: " MONGODB_URI
        read -p "Enter JWT Secret: " JWT_SECRET
        read -p "Enter Cloudinary Cloud Name: " CLOUDINARY_CLOUD_NAME
        read -p "Enter Cloudinary API Key: " CLOUDINARY_API_KEY
        read -p "Enter Cloudinary API Secret: " CLOUDINARY_API_SECRET
        read -p "Enter Cloudinary Upload Preset: " CLOUDINARY_UPLOAD_PRESET
        
        deploy_backend
        
        # Set backend URL for frontend deployment
        if command -v heroku &> /dev/null; then
            BACKEND_URL=$(heroku info -s vidyanidhi-backend | grep web_url | cut -d= -f2 | tr -d '\n')
        else
            read -p "Enter Backend URL (e.g., https://vidyanidhi-backend.herokuapp.com): " BACKEND_URL
        fi
        
        FRONTEND_URL="https://vidyanidhi.vercel.app"  # Default frontend URL
        
        deploy_frontend
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo "=== Deployment Complete ==="
echo "Please check deployment-guide.md for post-deployment steps and troubleshooting." 