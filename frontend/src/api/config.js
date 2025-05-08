// API configuration constants
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_BASE_URL = `${API_URL}/api`;

// Other configuration constants
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Fashion Store';
export const ITEMS_PER_PAGE = parseInt(import.meta.env.VITE_ITEMS_PER_PAGE || '12');
export const PLACEHOLDER_IMAGE = import.meta.env.VITE_PLACEHOLDER_IMAGE || '/placeholder.jpg';

// Cloudinary configuration
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';

// Other environment-specific configurations
export const IS_PRODUCTION = import.meta.env.MODE === 'production';