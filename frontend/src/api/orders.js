import apiClient from './client';

/**
 * Create a new order
 * @param {Object} orderData - Order data
 * @returns {Promise} - Created order
 */
export const createOrder = async (orderData) => {
  try {
    console.log('Original order data:', orderData);
    
    // Format the product IDs in a way that our backend can handle
    const processedOrderData = {
      ...orderData,
      orderItems: orderData.orderItems.map(item => ({
        ...item,
        // Always convert product ID to string to avoid type issues
        product: String(item.product)
      }))
    };
    
    console.log('Sending processed order data to API:', processedOrderData);
    const response = await apiClient.post('/orders', processedOrderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    if (error.response?.data) {
      console.error('Server response:', error.response.data);
    }
    throw error;
  }
};

/**
 * Get a specific order by ID
 * @param {string} id - Order ID
 * @returns {Promise} - Order details
 */
export const getOrderById = async (id) => {
  try {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch order details');
  }
};

/**
 * Update order to paid
 * @param {string} id - Order ID
 * @param {Object} paymentResult - Payment data
 * @returns {Promise} - Updated order
 */
export const updateOrderToPaid = async (id, paymentResult) => {
  try {
    const response = await apiClient.put(`/orders/${id}/pay`, paymentResult);
    return response.data;
  } catch (error) {
    console.error('Error updating order payment:', error);
    throw new Error(error.response?.data?.message || 'Failed to update payment status');
  }
};

/**
 * Get user's orders
 * @returns {Promise} - User's orders
 */
export const getUserOrders = async () => {
  try {
    // Add a timestamp to help avoid caching issues
    const response = await apiClient.get(`/orders/myorders?_t=${Date.now()}`);
    
    // Make sure we're returning an array
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.orders)) {
      return response.data.orders;
    } else {
      console.warn('Orders API did not return an array:', response.data);
      return []; // Return an empty array instead of non-array data
    }
  } catch (error) {
    console.error('Error fetching my orders:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch your orders');
  }
};

/**
 * Cancel an order
 * @param {string} id - Order ID
 * @param {Object} cancelData - Cancellation data including reason
 * @returns {Promise} - Canceled order confirmation
 */
export const cancelOrder = async (id, cancelData) => {
  try {
    const response = await apiClient.put(`/orders/${id}/cancel`, cancelData);
    return response.data;
  } catch (error) {
    console.error('Error canceling order:', error);
    throw new Error(error.response?.data?.message || 'Failed to cancel order');
  }
};

/**
 * Request order cancellation
 * @param {string} orderId - Order ID
 * @param {Object} cancellationData - Cancellation details including reason
 * @returns {Promise} - Cancellation request confirmation
 */
export const requestOrderCancellation = async (orderId, cancellationData) => {
  try {
    const response = await apiClient.post(`/orders/${orderId}/cancel-request`, cancellationData);
    return response.data;
  } catch (error) {
    console.error('Error requesting order cancellation:', error);
    throw new Error(error.response?.data?.message || 'Failed to request order cancellation');
  }
};

/**
 * Mark a Cash on Delivery order as paid (Admin only)
 * @param {string} id - Order ID
 * @returns {Promise} - Updated order
 */
export const markCashOnDeliveryOrderAsPaid = async (id) => {
  try {
    const response = await apiClient.put(`/orders/${id}/mark-paid`, {});
    return response.data;
  } catch (error) {
    console.error('Error marking COD order as paid:', error);
    throw new Error(error.response?.data?.message || 'Failed to mark order as paid');
  }
};

/**
 * Get cancellation status for an order
 * @param {string} orderId - Order ID
 * @returns {Promise} - Cancellation status
 */
export const getCancellationStatus = async (orderId) => {
  try {
    // Get the full order details as it will include the cancelDetails field
    const response = await apiClient.get(`/orders/${orderId}`);
    
    // Extract cancellation status from the order
    const order = response.data;
    const cancelDetails = order.cancelDetails || {};
    
    return {
      hasCancellationRequest: !!cancelDetails.requestedAt,
      status: cancelDetails.status || 'None',
      reason: cancelDetails.reason || '',
      requestedAt: cancelDetails.requestedAt || null,
      note: cancelDetails.note || '',
      isCancelled: order.status === 'Cancelled'
    };
  } catch (error) {
    console.error('Error fetching cancellation status:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch cancellation status');
  }
};
