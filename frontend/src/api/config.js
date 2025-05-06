// API configuration constants
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_BASE_URL = `${API_URL}/api`;

// Other configuration constants
export const APP_NAME = 'Your E-commerce Store';
export const ITEMS_PER_PAGE = 12;
export const PLACEHOLDER_IMAGE = '/placeholder.jpg';

// Cloudinary configuration
export const CLOUDINARY_CLOUD_NAME = 'your-cloud-name'; // Replace with your actual Cloudinary cloud name

// Other environment-specific configurations
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';