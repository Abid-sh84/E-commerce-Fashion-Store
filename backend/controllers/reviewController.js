import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import mongoose from 'mongoose';

// @desc    Get all reviews for admin
// @route   GET /api/reviews
// @access  Private/Admin
const getAllReviews = asyncHandler(async (req, res) => {
  // Filter by rating if provided
  let query = {};
  if (req.query.rating) {
    query = { 'reviews.rating': Number(req.query.rating) };
  }
  
  // Find all products with reviews
  const products = await Product.find(query);
  
  // Extract all reviews from products with product information
  let allReviews = [];
  
  products.forEach(product => {
    // Skip products with no reviews
    if (!product.reviews || product.reviews.length === 0) return;
    
    // Map reviews to include product info
    const productReviews = product.reviews.map(review => {
      // Convert to plain object
      const reviewObj = review.toObject();
      
      // Add product info
      reviewObj.product = {
        _id: product._id,
        name: product.name,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        price: product.price,
      };
      
      return reviewObj;
    });
    
    allReviews = [...allReviews, ...productReviews];
  });
  
  // Sort reviews by date (newest first)
  allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json(allReviews);
});

// @desc    Get product reviews
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  
  const product = await Product.findById(productId);
  
  if (product) {
    // Map reviews to include stringified user IDs for easier frontend comparison
    const reviewsWithStringIds = product.reviews.map(review => {
      // Convert to plain object to avoid mongoose document methods
      const plainReview = review.toObject();
      // Add stringified user ID for frontend comparison
      plainReview.userIdString = review.user.toString();
      return plainReview;
    });
    
    res.json(reviewsWithStringIds);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create product review
// @route   POST /api/reviews/:productId
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, title, comment } = req.body;
  
  const product = await Product.findById(productId);
  
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    
    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }
    
    const review = {
      user: req.user._id,
      name: req.user.name,
      avatar: req.user.avatar,
      rating: Number(rating),
      title,
      comment,
    };
    
    product.reviews.push(review);
    product.reviewCount = product.reviews.length;
    product.rating = (
      product.reviews.reduce((acc, review) => acc + review.rating, 0) / 
      product.reviews.length
    ).toFixed(1);
    
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Update product review
// @route   PUT /api/reviews/:productId/:reviewId
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.params;
  const { rating, title, comment } = req.body;
  
  const product = await Product.findById(productId);
  
  if (product) {
    const reviewToUpdate = product.reviews.id(reviewId);
    
    if (!reviewToUpdate) {
      res.status(404);
      throw new Error('Review not found');
    }
    
    if (reviewToUpdate.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You can only update your own reviews');
    }
    
    reviewToUpdate.rating = Number(rating);
    reviewToUpdate.title = title;
    reviewToUpdate.comment = comment;
    
    // Update product rating
    product.rating = (
      product.reviews.reduce((acc, review) => acc + review.rating, 0) / 
      product.reviews.length
    ).toFixed(1);
    
    await product.save();
    res.json({ message: 'Review updated' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete product review
// @route   DELETE /api/reviews/:productId/:reviewId
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const { productId, reviewId } = req.params;
  
  const product = await Product.findById(productId);
  
  if (product) {
    const reviewToDelete = product.reviews.id(reviewId);
    
    if (!reviewToDelete) {
      res.status(404);
      throw new Error('Review not found');
    }
    
    if (
      reviewToDelete.user.toString() !== req.user._id.toString() && 
      !req.user.isAdmin
    ) {
      res.status(403);
      throw new Error('Not authorized');
    }
    
    // Filter out the review to delete
    product.reviews = product.reviews.filter(
      (review) => review._id.toString() !== reviewId
    );
    
    product.reviewCount = product.reviews.length;
    
    if (product.reviews.length > 0) {
      product.rating = (
        product.reviews.reduce((acc, review) => acc + review.rating, 0) / 
        product.reviews.length
      ).toFixed(1);
    } else {
      product.rating = 0;
    }
    
    await product.save();
    res.json({ message: 'Review removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export {
  getAllReviews,
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
};
