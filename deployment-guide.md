# Deployment Guide for Vidyanidhi Project

This guide will walk you through deploying both the backend and frontend of the Vidyanidhi application.

## Backend Deployment (Node.js/Express)

### Option 1: Deploy to Render.com (Recommended)

1. **Create a Render account**
   - Sign up at [render.com](https://render.com)

2. **Create a new Web Service**
   - Click "New" and select "Web Service"
   - Connect your GitHub repository or use the manual deploy option

3. **Configure the service**
   - Name: `vidyanidhi-backend` (or your preferred name)
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Select the appropriate plan (Free tier is available)

4. **Set environment variables**
   - Go to the "Environment" tab and add the following variables:
     ```
     PORT=10000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     ```
   - Note: Use port 10000 instead of 3490 as some platforms restrict certain ports

5. **Deploy**
   - Click "Create Web Service" and wait for the deployment to complete

### Option 2: Deploy to Heroku

1. **Create a Heroku account**
   - Sign up at [heroku.com](https://heroku.com)

2. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

3. **Login to Heroku**
   ```bash
   heroku login
   ```

4. **Create a new Heroku app**
   ```bash
   cd backend
   heroku create vidyanidhi-backend
   ```

5. **Add a Procfile**
   - Create a file named `Procfile` in the backend directory with:
   ```
   web: node index.js
   ```

6. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   heroku config:set CLOUDINARY_API_KEY=your_cloudinary_api_key
   heroku config:set CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

7. **Deploy to Heroku**
   ```bash
   git subtree push --prefix backend heroku main
   ```

## Frontend Deployment (React/Vite)

### Option 1: Deploy to Vercel (Recommended)

1. **Create a Vercel account**
   - Sign up at [vercel.com](https://vercel.com)

2. **Install Vercel CLI (optional)**
   ```bash
   npm install -g vercel
   ```

3. **Configure environment variables**
   - Create a `.env.production` file in the frontend directory:
   ```
   VITE_API_URL=https://your-backend-url.render.com/api
   VITE_CLOUD_NAME=your_cloudinary_cloud_name
   VITE_UPLOAD_PRESET=your_upload_preset
   ```

4. **Deploy to Vercel**
   - Using Vercel Dashboard:
     - Import your GitHub repository
     - Set the root directory to `frontend`
     - Configure build settings:
       - Build Command: `npm run build`
       - Output Directory: `dist`
     - Add environment variables
     - Deploy

   - Or using Vercel CLI:
     ```bash
     cd frontend
     vercel
     ```

### Option 2: Deploy to Netlify

1. **Create a Netlify account**
   - Sign up at [netlify.com](https://netlify.com)

2. **Configure environment variables**
   - Same as for Vercel, create a `.env.production` file

3. **Deploy to Netlify**
   - Using Netlify Dashboard:
     - Import your GitHub repository
     - Set the build command to `cd frontend && npm install && npm run build`
     - Set the publish directory to `frontend/dist`
     - Add environment variables
     - Deploy

   - Or using Netlify CLI:
     ```bash
     npm install -g netlify-cli
     cd frontend
     netlify deploy
     ```

## Connecting Frontend to Backend

Before deploying, you need to update your frontend code to use the deployed backend URL:

1. **Create an API configuration file**
   - Create a file at `frontend/src/config/api.js`:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3490/api';
   
   export default API_URL;
   ```

2. **Update all API calls**
   - Make sure all API calls in your frontend code use this API_URL

## Post-Deployment Steps

1. **Test the application**
   - Verify all features work correctly
   - Test user authentication
   - Test data retrieval and submission

2. **Set up monitoring**
   - Consider setting up monitoring tools like Sentry or LogRocket

3. **Set up a custom domain (optional)**
   - Configure a custom domain for both frontend and backend

## Troubleshooting

- **CORS issues**: Ensure your backend has proper CORS configuration
- **Environment variables**: Double-check all environment variables are set correctly
- **Build errors**: Check build logs for any errors
- **API connection issues**: Verify the API URL is correct and accessible

## Maintenance

- Regularly update dependencies
- Monitor application performance
- Back up your database regularly 