/**
 * API Configuration
 * 
 * This file centralizes the API URL configuration for the application.
 * It uses environment variables to determine the API URL based on the environment.
 * 
 * In development: Uses localhost
 * In production: Uses the deployed backend URL from environment variables
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3490/api';

export default API_URL; 