import apiClient from './client';

/**
 * Get dashboard statistics
 * @returns {Promise} - Dashboard stats
 */
export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard statistics');
  }
};

/**
 * Get all users
 * @param {Object} params - Query parameters
 * @returns {Promise} - Users list
 */
export const getUsers = async (params = {}) => {
  try {
    const response = await apiClient.get('/users', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

/**
 * Get all products (admin)
 * @param {Object} params - Query parameters like page, limit, etc.
 * @returns {Promise} - Products list
 */
export const getAllProducts = async (params = {}) => {
  try {
    const response = await apiClient.get('/products', { params });
    return response.data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

/**
 * Get product by ID
 * @param {string} productId - Product ID to retrieve
 * @returns {Promise} - Product details
 */
export const getProductById = async (productId) => {
  try {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch product details');
  }
};

/**
 * Update user role (make admin or regular user)
 * @param {string} userId - User ID to update
 * @param {boolean} isAdmin - Whether the user should be admin
 * @returns {Promise} - Updated user
 */
export const updateUserRole = async (userId, isAdmin) => {
  try {
    const response = await apiClient.put(`/users/${userId}/role`, { isAdmin });
    return response.data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw new Error(error.response?.data?.message || 'Failed to update user role');
  }
};

/**
 * Delete user
 * @param {string} userId - User ID to delete
 * @returns {Promise} - Confirmation message
 */
export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
};

/**
 * Get all orders (admin)
 * @param {Object} params - Query parameters
 * @returns {Promise} - Orders list
 */
export const getAllOrders = async (params = {}) => {
  try {
    const response = await apiClient.get('/orders', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
};

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise} - Updated order
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await apiClient.put(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error(error.response?.data?.message || 'Failed to update order status');
  }
};

/**
 * Create new product
 * @param {Object} productData - Product data
 * @returns {Promise} - Created product
 */
export const createProduct = async (productData) => {
  try {
    const response = await apiClient.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error(error.response?.data?.message || 'Failed to create product');
  }
};

/**
 * Update product
 * @param {string} productId - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise} - Updated product
 */
export const updateProduct = async (productId, productData) => {
  try {
    const response = await apiClient.put(`/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error(error.response?.data?.message || 'Failed to update product');
  }
};

/**
 * Delete product
 * @param {string} productId - Product ID to delete
 * @returns {Promise} - Confirmation message
 */
export const deleteProduct = async (productId) => {
  try {
    const response = await apiClient.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete product');
  }
};

/**
 * Upload product images
 * @param {FormData} formData - Form data containing images
 * @returns {Promise} - Uploaded image URLs
 */
export const uploadProductImages = async (formData) => {
  try {
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload images');
  }
};

/**
 * Get subscriber list
 * @returns {Promise} - Subscribers list
 */
export const getSubscribers = async () => {
  try {
    const response = await apiClient.get('/subscribers');
    return response.data;
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch subscribers');
  }
};

/**
 * Export orders to CSV
 * @param {Object} params - Filtering parameters
 * @returns {Promise} - CSV download URL or blob
 */
export const exportOrdersToCSV = async (params = {}) => {
  try {
    const response = await apiClient.get('/orders/export', { 
      params,
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting orders:', error);
    throw new Error(error.response?.data?.message || 'Failed to export orders');
  }
};

/**
 * Get sales stats for dashboard
 * @param {string} period - Time period (e.g., 'week', 'month', 'year')
 * @returns {Promise} - Sales statistics
 */
export const getSalesStats = async (period = 'week') => {
  try {
    const response = await apiClient.get(`/admin/sales?period=${period}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sales stats:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch sales statistics');
  }
};

/**
 * Get all cancellation requests
 * @param {Object} params - Query parameters like status filter
 * @returns {Promise} - Cancellation requests list
 */
export const getCancellationRequests = async (params = {}) => {
  try {
    // Fix the duplicate api prefix - apiClient already includes the /api base path
    const response = await apiClient.get('/orders/cancellations', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching cancellation requests:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch cancellation requests');
  }
};

/**
 * Process a cancellation request (approve or reject)
 * @param {string} orderId - Order ID 
 * @param {Object} data - Processing data including status and note
 * @returns {Promise} - Processed cancellation request
 */
export const processCancellationRequest = async (orderId, data) => {
  try {
    const response = await apiClient.put(`/orders/${orderId}/cancel-process`, data);
    return response.data;
  } catch (error) {
    console.error('Error processing cancellation request:', error);
    throw new Error(error.response?.data?.message || 'Failed to process cancellation request');
  }
};

/**
 * Create new user
 * @param {Object} userData - User data including name, email, password, isAdmin
 * @returns {Promise} - Created user
 */
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error(error.response?.data?.message || 'Failed to create user');
  }
};

/**
 * Update user details
 * @param {string} userId - User ID to update
 * @param {Object} userData - Updated user data
 * @returns {Promise} - Updated user
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
};

/**
 * Get user by ID
 * @param {string} userId - User ID to retrieve
 * @returns {Promise} - User details
 */
export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch user details');
  }
};

/**
 * Get all coupons
 * @returns {Promise} - Coupons list
 */
export const getAllCoupons = async () => {
  try {
    const response = await apiClient.get('/coupons');
    return response.data;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch coupons');
  }
};

/**
 * Create a new coupon
 * @param {Object} couponData - Coupon data
 * @returns {Promise} - Created coupon
 */
export const createCoupon = async (couponData) => {
  try {
    const response = await apiClient.post('/coupons', couponData);
    return response.data;
  } catch (error) {
    console.error('Error creating coupon:', error);
    throw new Error(error.response?.data?.message || 'Failed to create coupon');
  }
};

/**
 * Update a coupon
 * @param {string} couponId - Coupon ID
 * @param {Object} couponData - Updated coupon data
 * @returns {Promise} - Updated coupon
 */
export const updateCoupon = async (couponId, couponData) => {
  try {
    const response = await apiClient.put(`/coupons/${couponId}`, couponData);
    return response.data;
  } catch (error) {
    console.error('Error updating coupon:', error);
    throw new Error(error.response?.data?.message || 'Failed to update coupon');
  }
};

/**
 * Delete a coupon
 * @param {string} couponId - Coupon ID to delete
 * @returns {Promise} - Confirmation message
 */
export const deleteCoupon = async (couponId) => {
  try {
    const response = await apiClient.delete(`/coupons/${couponId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting coupon:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete coupon');
  }
};

/**
 * Get all reviews (admin)
 * @param {Object} params - Query parameters like rating filter
 * @returns {Promise} - All reviews across products
 */
export const getAllReviews = async (params = {}) => {
  try {
    const response = await apiClient.get('/reviews', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
  }
};

/**
 * Delete a review
 * @param {string} productId - Product ID the review belongs to
 * @param {string} reviewId - Review ID to delete
 * @returns {Promise} - Confirmation message
 */
export const deleteReview = async (productId, reviewId) => {
  try {
    const response = await apiClient.delete(`/reviews/${productId}/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete review');
  }
};