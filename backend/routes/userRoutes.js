import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  getAddresses,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getUsers,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  googleAuth,
  googleCallback,
  getCurrentUser,
  addToRecentlyViewed,
  getRecentlyViewed,
  getUserById,
  updateUserById,
  deleteUser
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(registerUser)
  .get(protect, admin, getUsers);

router.post('/login', authUser);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/addresses')
  .get(protect, getAddresses)
  .post(protect, addAddress);

router.route('/addresses/:id')
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

router.route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.route('/wishlist/:id')
  .delete(protect, removeFromWishlist);

// Recently viewed products routes
router.route('/recently-viewed')
  .get(protect, getRecentlyViewed)
  .post(protect, addToRecentlyViewed);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.get('/reset-password/:token/verify', verifyResetToken);
router.post('/reset-password/:token', resetPassword);

// Add route for current user
router.get('/me', protect, getCurrentUser);

// Google authentication routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// User routes by ID
router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUserById)
  .delete(protect, admin, deleteUser);

export default router;

