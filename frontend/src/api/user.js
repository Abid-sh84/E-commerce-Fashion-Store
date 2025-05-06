import apiClient from './client';

/**
 * Add a new address for the user
 * @param {Object} addressData - Address data
 * @returns {Promise} - Added address
 */
export const addAddress = async (addressData) => {
  try {
    const response = await apiClient.post('/users/addresses', addressData);
    return response.data;
  } catch (error) {
    console.error('Error adding address:', error);
    throw new Error(error.response?.data?.message || 'Failed to add address');
  }
};

/**
 * Update an existing address
 * @param {string} id - Address ID
 * @param {Object} addressData - Updated address data
 * @returns {Promise} - Updated address
 */
export const updateAddress = async (id, addressData) => {
  try {
    const response = await apiClient.put(`/users/addresses/${id}`, addressData);
    return response.data;
  } catch (error) {
    console.error('Error updating address:', error);
    throw new Error(error.response?.data?.message || 'Failed to update address');
  }
};

/**
 * Delete an address
 * @param {string} id - Address ID
 * @returns {Promise} - Delete confirmation
 */
export const deleteAddress = async (id) => {
  try {
    const response = await apiClient.delete(`/users/addresses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete address');
  }
};

/**
 * Get user's wishlist
 * @returns {Promise} - Wishlist items
 */
export const getWishlist = async () => {
  try {
    const response = await apiClient.get('/users/wishlist');
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch wishlist');
  }
};

/**
 * Add item to user's wishlist
 * @param {string} productId - Product ID to add
 * @returns {Promise} - Updated wishlist
 */
export const addToWishlist = async (productId) => {
  try {
    const response = await apiClient.post('/users/wishlist', { productId });
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw new Error(error.response?.data?.message || 'Failed to add item to wishlist');
  }
};

/**
 * Remove item from user's wishlist
 * @param {string} productId - Product ID to remove
 * @returns {Promise} - Updated wishlist
 */
export const removeFromWishlist = async (productId) => {
  try {
    const response = await apiClient.delete(`/users/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw new Error(error.response?.data?.message || 'Failed to remove item from wishlist');
  }
};

/**
 * Update user profile
 * @param {Object} userData - User data to update
 * @returns {Promise} - Updated user data
 */
export const updateProfile = async (userData) => {
  try {
    // Log the update attempt
    console.log('Attempting to update profile with:', userData);
    
    // Ensure token is attached
    const token = localStorage.getItem('token');
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await apiClient.put('/users/profile', userData);
    console.log('Profile update API response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

/**
 * Get user's addresses
 * @returns {Promise} The user's addresses
 */
export const getAddresses = async () => {
  try {
    const response = await apiClient.get('/users/addresses');
    return response.data;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch addresses');
  }
};