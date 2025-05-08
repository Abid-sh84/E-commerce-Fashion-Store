import axios from 'axios';
import { API_BASE_URL } from './config';

// Create an axios instance with the correct base URL and path prefix
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies/authentication
});

// Add request interceptor to include auth token in requests
apiClient.interceptors.request.use(
  (config) => {
    // Get fresh token on every request
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
      // For DELETE requests, ensure the token is included in URL params as well
      // This is a workaround for some server configurations that might not properly
      // process authorization headers for DELETE requests
      if (config.method === 'delete') {
        // Add auth token as a URL parameter for DELETE requests if not already present
        const separator = config.url.includes('?') ? '&' : '?';
        config.url = `${config.url}${separator}_auth=${token}`;
      }
    } else {
      console.warn('No authentication token found for request:', config.url);
    }
    
    if (import.meta.env.DEV) {
      console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('API Error:', error.message);
      
      // Add more detailed debugging information
      if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error(`Data:`, error.response.data);
        console.error(`Request URL: ${error.config.baseURL}${error.config.url}`);
        console.error(`Request Method: ${error.config.method.toUpperCase()}`);
        
        if (error.config.data) {
          try {
            const requestData = JSON.parse(error.config.data);
            console.error('Request Payload:', requestData);
          } catch (e) {
            console.error('Request Payload:', error.config.data);
          }
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
    }
    
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Don't redirect if already on login page to prevent redirect loops
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
