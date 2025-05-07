import express from 'express';
import {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getMyOrders,
  getOrders,
  requestOrderCancellation,
  processCancellationRequest,
  getCancellationRequests,
  cancelOrder,
  markCashOnDeliveryOrderAsPaid,
  deleteOrder,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import mongoose from 'mongoose';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getOrders);

router.route('/myorders')
  .get(protect, getMyOrders);

// Order cancellation routes - MOVED BEFORE /:id to prevent param confusion
router.route('/cancellations')
  .get(protect, admin, getCancellationRequests);

router.route('/:id')
  .get(protect, getOrderById)
  .delete(protect, admin, deleteOrder);

router.route('/:id/pay')
  .put(protect, updateOrderToPaid);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

router.route('/:id/mark-paid')
  .put(protect, admin, markCashOnDeliveryOrderAsPaid);

router.route('/:id/cancel-request')
  .post(protect, requestOrderCancellation);

router.route('/:id/cancel-process')
  .put(protect, admin, processCancellationRequest);

router.route('/:id/cancel')
  .put(protect, cancelOrder);

// Add a debug route to validate order data
router.post('/debug', protect, (req, res) => {
  const { orderItems } = req.body;
  
  const validationResults = orderItems.map(item => ({
    originalId: item.product,
    isValid: mongoose.Types.ObjectId.isValid(item.product),
    convertedId: mongoose.Types.ObjectId.isValid(item.product) ? 
      item.product : 
      'Invalid format for ObjectId'
  }));
  
  res.json({ 
    validationResults,
    message: 'This endpoint helps debug order data validation issues'
  });
});

export default router;
