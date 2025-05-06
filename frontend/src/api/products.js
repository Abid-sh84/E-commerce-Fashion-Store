import apiClient from './client';

/**
 * Get products with optional filters
 * @param {Object} filters - Filter options
 * @param {number} page - Page number
 * @returns {Promise} - Products data
 */
export const getProducts = async (filters = {}, page = 1) => {
  const { category, universe, type, priceRange, sortBy, keyword } = filters;
  
  let queryString = `?page=${page}`;
  if (category) queryString += `&category=${encodeURIComponent(category.toLowerCase())}`;
  if (universe) queryString += `&universe=${encodeURIComponent(universe.toLowerCase())}`;
  if (type) queryString += `&type=${encodeURIComponent(type.toLowerCase())}`;
  if (priceRange) queryString += `&price=${encodeURIComponent(priceRange)}`;
  if (sortBy) queryString += `&sort=${encodeURIComponent(sortBy)}`;
  if (keyword) queryString += `&keyword=${encodeURIComponent(keyword)}`;
  
  try {
    console.log(`Sending API request to: /products${queryString}`);
    const response = await apiClient.get(`/products${queryString}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products from API');
  }
};

/**
 * Get product by ID
 * @param {string} id - Product ID
 * @returns {Promise} - Product data
 */
export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw new Error('Failed to fetch product details from API');
  }
};

/**
 * Get top rated products
 * @returns {Promise} - Top products data
 */
export const getTopProducts = async () => {
  try {
    const response = await apiClient.get('/products/top');
    return response.data;
  } catch (error) {
    console.error('Error fetching top products:', error);
    throw new Error('Failed to fetch top products from API');
  }
};

/**
 * Get new arrival products
 * @returns {Promise} - New products data
 */
export const getNewProducts = async () => {
  try {
    const response = await apiClient.get('/products/new');
    return response.data;
  } catch (error) {
    console.error('Error fetching new products:', error);
    throw new Error('Failed to fetch new products from API');
  }
};

/**
 * Get products by category
 * @param {string} category - Category name
 * @returns {Promise} - Products by category
 */
export const getProductsByCategory = async (category) => {
  try {
    const response = await apiClient.get(`/products/category/${category}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw new Error('Failed to fetch products by category from API');
  }
};

/**
 * Create a product review
 * @param {string} productId - Product ID
 * @param {Object} review - Review data
 * @returns {Promise} - Review result
 */
export const createProductReview = async (productId, review) => {
  try {
    const response = await apiClient.post(`/products/${productId}/reviews`, review);
    return response.data;
  } catch (error) {
    console.error('Error creating product review:', error);
    throw new Error(error.response?.data?.message || 'Failed to create product review');
  }
};

/**
 * Get product categories
 * @returns {Promise} - Categories data
 */
export const getProductCategories = async () => {
  try {
    const response = await apiClient.get('/products/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching product categories:', error);
    throw new Error('Failed to fetch product categories from API');
  }
}

/**
 * Get reviews for a specific product
 * @param {string} productId - Product ID to fetch reviews for
 * @returns {Promise<Array>} - Array of review objects
 */
export const getReviews = async (productId) => {
  try {
    if (!productId) {
      console.error("Product ID is required to fetch reviews");
      return [];
    }
    // Updated to match the backend route structure - using /api/reviews/:productId
    const response = await apiClient.get(`/reviews/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    // Return empty array instead of throwing to avoid crashing the UI
    return [];
  }
};

/**
 * Create a new review for a product
 * @param {string} productId - Product ID to review
 * @param {object} reviewData - Review data (rating, title, comment)
 * @returns {Promise<object>} - Created review object
 */
export const createReview = async (productId, reviewData) => {
  try {
    // Updated to match the backend route structure
    const response = await apiClient.post(`/reviews/${productId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error creating product review:', error);
    throw error;
  }
};

/**
 * Update an existing review
 * @param {string} productId - Product ID
 * @param {string} reviewId - Review ID to update
 * @param {object} reviewData - Updated review data
 * @returns {Promise<object>} - Updated review object
 */
export const updateReview = async (productId, reviewId, reviewData) => {
  try {
    // Path remains the same as it already matches the backend route
    const response = await apiClient.put(`/reviews/${productId}/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error updating product review:', error);
    throw error;
  }
};

/**
 * Delete a review
 * @param {string} productId - Product ID
 * @param {string} reviewId - Review ID to delete
 * @returns {Promise<object>} - Response data
 */
export const deleteReview = async (productId, reviewId) => {
  try {
    const response = await apiClient.delete(`/reviews/${productId}/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product review:', error);
    throw error;
  }
};
