import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Routes
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import visitorRoutes from './routes/visitorRoutes.js';

// Load env vars
dotenv.config();

// Check if essential environment variables exist, but don't expose them in code
if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID.trim() === '') {
  console.warn('Warning: GOOGLE_CLIENT_ID environment variable is not set. OAuth functionality may not work properly.');
  // Don't set default values in code - use .env file instead
}

if (!process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET.trim() === '') {
  console.warn('Warning: GOOGLE_CLIENT_SECRET environment variable is not set. OAuth functionality may not work properly.');
}

if (!process.env.GOOGLE_REDIRECT_URI || process.env.GOOGLE_REDIRECT_URI.trim() === '') {
  console.warn('Warning: GOOGLE_REDIRECT_URI environment variable is not set. Using default value.');
  process.env.GOOGLE_REDIRECT_URI = process.env.API_URL ? `${process.env.API_URL}/api/users/google/callback` : 'http://localhost:5000/api/users/google/callback';
}

if (!process.env.FRONTEND_URL) {
  console.warn('Warning: FRONTEND_URL environment variable is not set. Using default value.');
  process.env.FRONTEND_URL = 'http://localhost:5173';
}

// Log configuration but hide sensitive values
console.log('==== OAuth Configuration ====');
console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID ? '[SET]' : '[MISSING]');
console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? '[SET]' : '[MISSING]');
console.log('Google Redirect URI:', process.env.GOOGLE_REDIRECT_URI);
console.log('Frontend URL:', process.env.FRONTEND_URL);
console.log('===========================');

// Import and run Google OAuth config verification
import verifyGoogleConfig from './utils/verifyGoogleConfig.js';
verifyGoogleConfig();

// Connect to database
connectDB();

const app = express();

// CORS Configuration - Updated to properly handle CORS issues
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Allow your frontend origin
  credentials: true, // Allow cookies/credentials to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'] // Allowed headers
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/visitors', visitorRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`CORS enabled for origin: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});
