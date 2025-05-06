import express from 'express';
import {
  getCoupons,
  getCouponByCode,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getProductCategories,
  getCouponsCount
} from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes
router.route('/')
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);

// Get categories for coupon creation
router.get('/categories', protect, admin, getProductCategories);

// Get active coupons count for dashboard
router.get('/count', protect, admin, getCouponsCount);

// Public route to validate coupon
router.post('/validate', validateCoupon);

// Route to get coupon by code
router.get('/code/:code', getCouponByCode);

// Admin routes with ID parameter
router.route('/:id')
  .put(protect, admin, updateCoupon)
  .delete(protect, admin, deleteCoupon);

export default router;