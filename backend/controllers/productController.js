import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.page) || 1;
  
  // Enhanced keyword search for better matching
  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { description: { $regex: req.query.keyword, $options: 'i' } },
          { universe: { $regex: req.query.keyword, $options: 'i' } },
          { type: { $regex: req.query.keyword, $options: 'i' } },
        ]
      }
    : {};
    
  // Enhanced case-insensitive filters
  const category = req.query.category ? { category: { $regex: `^${req.query.category}$`, $options: 'i' } } : {};
  const universe = req.query.universe ? { universe: { $regex: `^${req.query.universe}$`, $options: 'i' } } : {};
  const type = req.query.type ? { type: { $regex: `^${req.query.type}$`, $options: 'i' } } : {};
  
  // Enhanced price range filter
  let priceFilter = {};
  if (req.query.price) {
    // Handle predefined price ranges from frontend
    if (req.query.price === 'under-20') {
      priceFilter = { price: { $lt: 20 } };
    } else if (req.query.price === '20-30') {
      priceFilter = { price: { $gte: 20, $lte: 30 } };
    } else if (req.query.price === '30-40') {
      priceFilter = { price: { $gte: 30, $lte: 40 } };
    } else if (req.query.price === 'over-40') {
      priceFilter = { price: { $gt: 40 } };
    } else {
      // Default handling for custom ranges
      const [min, max] = req.query.price.split('-').map(Number);
      priceFilter = { price: { $gte: min || 0, $lte: max || Infinity } };
    }
    console.log('Applied price filter:', priceFilter);
  }
  
  // Combine all filters
  const filters = {
    ...keyword,
    ...category,
    ...universe,
    ...type,
    ...priceFilter,
  };
  
  console.log('Applied filters:', filters);
  
  const count = await Product.countDocuments(filters);
  const products = await Product.find(filters)
    .limit(pageSize)
    .skip(pageSize * (page - 1));
    
  // Apply sorting
  const sortBy = req.query.sort || 'newest';
  
  switch (sortBy) {
    case 'price-low':
      products.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      products.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      products.sort((a, b) => b.rating - a.rating);
      break;
    case 'popularity':
      products.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case 'newest':
    default:
      products.sort((a, b) => b.createdAt - a.createdAt);
      break;
  }

  res.json({ 
    products, 
    page, 
    pages: Math.ceil(count / pageSize),
    count
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    productId,
    name,
    price,
    description,
    images,
    category,
    universe,
    type,
    countInStock,
    sizes,
    discount,
    isNew,
  } = req.body;

  const product = new Product({
    productId,
    name,
    price,
    description,
    images,
    category,
    universe,
    type,
    countInStock,
    sizes,
    discount,
    isNew,
    rating: 0,
    reviewCount: 0,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    productId,
    name,
    price,
    description,
    images,
    category,
    universe,
    type,
    countInStock,
    sizes,
    discount,
    isNew,
  } = req.body;

  const product = await Product.findById(req.params.id);
  
  if (product) {
    product.productId = productId || product.productId;
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.images = images || product.images;
    product.category = category || product.category;
    product.universe = universe || product.universe;
    product.type = type || product.type;
    product.countInStock = countInStock || product.countInStock;
    product.sizes = sizes || product.sizes;
    product.discount = discount !== undefined ? discount : product.discount;
    product.isNew = isNew !== undefined ? isNew : product.isNew;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, title, comment } = req.body;

  const product = await Product.findById(req.params.id);
  
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      title,
      comment,
      user: req.user._id,
      avatar: req.user.avatar,
    };

    product.reviews.push(review);
    product.reviewCount = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(4);
  res.json(products);
});

// @desc    Get new arrivals
// @route   GET /api/products/new
// @access  Public
const getNewProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isNew: true }).sort({ createdAt: -1 }).limit(8);
  res.json(products);
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const products = await Product.find({ category });
  
  res.json(products);
});

// @desc    Get all product categories with counts
// @route   GET /api/products/categories
// @access  Public
const getProductCategories = asyncHandler(async (req, res) => {
  // Aggregate to get all categories and their counts
  const categories = await Product.aggregate([
    { $match: { 
      images: { $exists: true, $ne: [] } 
    }},
    { $group: { 
      _id: "$category", 
      name: { $first: "$category" },
      count: { $sum: 1 },
      // Get all potential images for this category
      allImages: { $push: "$images" }
    }},
    { $project: {
      _id: 1,
      name: 1,
      slug: "$_id",
      count: 1,
      // Create a flattened array of all images
      imageList: { $reduce: {
        input: "$allImages",
        initialValue: [],
        in: { $concatArrays: ["$$value", "$$this"] }
      }}
    }},
    { $addFields: {
      // Take the first image from the collected images
      image: { $arrayElemAt: ["$imageList", 0] }
    }}
  ]);
  
  // Define specific reliable fallback images for each category from third-party sources
  const categoryFallbacks = {
    dc: "https://tse1.mm.bing.net/th/id/OIP.aTVHU4q_hp5Z2Kcc7oQg3wHaHa?rs=1&pid=ImgDetMain",
    marvel: "https://m.media-amazon.com/images/I/71P5CeqBAgS._AC_UX679_.jpg",
    anime: "https://m.media-amazon.com/images/I/71SgfHQm+uL._AC_UX679_.jpg"
  };
  
  // Add fallback images for categories
  const categoriesWithFallbacks = categories.map(category => {
    // Use specific category fallback or a general one
    const fallbackImage = categoryFallbacks[category.slug] || "/placeholder.svg";
    
    return {
      ...category,
      image: category.image || fallbackImage
    };
  });
  
  res.json(categoriesWithFallbacks);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getNewProducts,
  getProductsByCategory,
  getProductCategories,  // Add the new function to the exports
};
