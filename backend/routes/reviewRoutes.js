import express from 'express';
import {
  getAllReviews,
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin route to get all reviews
router.route('/')
  .get(protect, admin, getAllReviews);

router.route('/:productId')
  .get(getProductReviews)
  .post(protect, createReview);

router.route('/:productId/:reviewId')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

export default router;
