import asyncHandler from 'express-async-handler';
import Coupon from '../models/couponModel.js';
import Product from '../models/productModel.js';

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.json(coupons);
});

// @desc    Get a single coupon by code
// @route   GET /api/coupons/:code
// @access  Public
const getCouponByCode = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase() });
  
  if (coupon) {
    res.json({
      _id: coupon._id,
      code: coupon.code,
      discount: coupon.discount,
      minAmount: coupon.minAmount,
      isValid: coupon.isValid(),
      applicableCategories: coupon.applicableCategories,
      isGlobal: coupon.isGlobal
    });
  } else {
    res.status(404);
    throw new Error('Coupon not found');
  }
});

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const { 
    code, 
    discount, 
    minAmount, 
    maxUses, 
    expiryDate, 
    active, 
    description,
    isGlobal,
    applicableCategories 
  } = req.body;

  // Check if coupon code already exists
  const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
  
  if (couponExists) {
    res.status(400);
    throw new Error('Coupon code already exists');
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discount,
    minAmount: minAmount || 0,
    maxUses: maxUses || 0,
    uses: 0,
    expiryDate: expiryDate || null,
    active: active !== undefined ? active : true,
    description: description || '',
    isGlobal: isGlobal !== undefined ? isGlobal : true,
    applicableCategories: applicableCategories || []
  });

  if (coupon) {
    res.status(201).json(coupon);
  } else {
    res.status(400);
    throw new Error('Invalid coupon data');
  }
});

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = asyncHandler(async (req, res) => {
  const { 
    code, 
    discount, 
    minAmount, 
    maxUses, 
    expiryDate, 
    active, 
    description,
    isGlobal,
    applicableCategories 
  } = req.body;

  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    // If code is being changed, check if new code already exists
    if (code && code !== coupon.code) {
      const codeExists = await Coupon.findOne({ code: code.toUpperCase() });
      if (codeExists) {
        res.status(400);
        throw new Error('Coupon code already exists');
      }
      coupon.code = code.toUpperCase();
    }

    coupon.discount = discount !== undefined ? discount : coupon.discount;
    coupon.minAmount = minAmount !== undefined ? minAmount : coupon.minAmount;
    coupon.maxUses = maxUses !== undefined ? maxUses : coupon.maxUses;
    coupon.expiryDate = expiryDate !== undefined ? expiryDate : coupon.expiryDate;
    coupon.active = active !== undefined ? active : coupon.active;
    coupon.description = description !== undefined ? description : coupon.description;
    coupon.isGlobal = isGlobal !== undefined ? isGlobal : coupon.isGlobal;
    coupon.applicableCategories = applicableCategories !== undefined ? applicableCategories : coupon.applicableCategories;

    const updatedCoupon = await coupon.save();
    res.json(updatedCoupon);
  } else {
    res.status(404);
    throw new Error('Coupon not found');
  }
});

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    await coupon.deleteOne();
    res.json({ message: 'Coupon removed' });
  } else {
    res.status(404);
    throw new Error('Coupon not found');
  }
});

// @desc    Validate coupon and get discount amount
// @route   POST /api/coupons/validate
// @access  Public
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, cartTotal, cartItems } = req.body;

  if (!code) {
    res.status(400);
    throw new Error('Please provide a coupon code');
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    res.status(404);
    throw new Error('Invalid coupon code');
  }

  // Check if coupon is valid
  if (!coupon.isValid()) {
    let errorMessage = 'This coupon is no longer valid';
    
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      errorMessage = 'This coupon has expired';
    } else if (coupon.maxUses > 0 && coupon.uses >= coupon.maxUses) {
      errorMessage = 'This coupon has reached its maximum uses';
    } else if (!coupon.active) {
      errorMessage = 'This coupon is inactive';
    }
    
    res.status(400);
    throw new Error(errorMessage);
  }

  // Check minimum amount if applicable
  if (coupon.minAmount > 0 && cartTotal < coupon.minAmount) {
    res.status(400);
    throw new Error(`This coupon requires a minimum purchase of $${coupon.minAmount}`);
  }

  // Check category restrictions if this is not a global coupon
  if (!coupon.isGlobal && coupon.applicableCategories.length > 0 && cartItems) {
    // Get all product IDs from cart
    const productIds = cartItems.map(item => item.product);
    
    // Find all products in cart to get their categories
    const products = await Product.find({ _id: { $in: productIds } });
    
    // Create a map of product ID to product for easier lookup
    const productMap = {};
    products.forEach(product => {
      productMap[product._id.toString()] = product;
    });
    
    // Check if at least one product in cart belongs to applicable categories
    const hasApplicableProduct = cartItems.some(item => {
      const product = productMap[item.product.toString()];
      return product && coupon.applicableCategories.includes(product.category);
    });
    
    if (!hasApplicableProduct) {
      res.status(400);
      throw new Error(`This coupon is only applicable to specific product categories: ${coupon.applicableCategories.join(', ')}`);
    }
    
    // Calculate discount amount only for applicable products
    let applicableTotal = 0;
    cartItems.forEach(item => {
      const product = productMap[item.product.toString()];
      if (product && coupon.applicableCategories.includes(product.category)) {
        applicableTotal += item.price * item.qty;
      }
    });
    
    const discountAmount = (applicableTotal * coupon.discount) / 100;
    
    res.json({
      valid: true,
      code: coupon.code,
      discount: coupon.discount,
      discountAmount,
      message: `${coupon.discount}% discount applied to eligible products!`,
      categorySpecific: true,
      applicableCategories: coupon.applicableCategories
    });
    
    return;
  }

  // For global coupons, calculate discount on entire cart
  const discountAmount = (cartTotal * coupon.discount) / 100;

  res.json({
    valid: true,
    code: coupon.code,
    discount: coupon.discount,
    discountAmount,
    message: `${coupon.discount}% discount applied successfully!`,
    categorySpecific: false
  });
});

// @desc    Get all available product categories (for coupon creation)
// @route   GET /api/coupons/categories
// @access  Private/Admin
const getProductCategories = asyncHandler(async (req, res) => {
  // Find all distinct categories from products
  const categories = await Product.distinct('category');
  
  // Filter out null or empty categories
  const validCategories = categories.filter(category => category && category.trim() !== '');
  
  res.json(validCategories);
});

// @desc    Get active coupons count for dashboard
// @route   GET /api/coupons/count
// @access  Private/Admin
const getCouponsCount = asyncHandler(async (req, res) => {
  const now = new Date();
  
  const activeCoupons = await Coupon.countDocuments({
    active: true,
    $or: [
      { expiryDate: null },
      { expiryDate: { $gt: now } }
    ]
  });
  
  res.json({ activeCoupons });
});

export {
  getCoupons,
  getCouponByCode,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getProductCategories,
  getCouponsCount
};