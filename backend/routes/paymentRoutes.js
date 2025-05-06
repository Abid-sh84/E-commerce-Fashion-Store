import express from 'express';
import {
  createPaymentIntent,
  validateCoupon,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/validate-coupon', validateCoupon);

export default router;
