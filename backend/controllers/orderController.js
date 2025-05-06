import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import CancelOrder from '../models/cancleOrderModel.js';
import mongoose from 'mongoose';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    try {
      // Process order items to ensure valid ObjectIds
      const processedOrderItems = orderItems.map(item => {
        // Create a copy of the item to avoid modifying the original
        const processedItem = { ...item };
        
        // Handle the product ID validation
        if (item.product) {
          // If it's already a valid ObjectId, just use it
          if (mongoose.Types.ObjectId.isValid(item.product)) {
            processedItem.product = item.product;
          } else {
            // If it's not valid, create a padded string that will be a valid ObjectId
            const paddedId = String(item.product).padStart(24, '0');
            processedItem.product = new mongoose.Types.ObjectId(paddedId);
          }
        }
        
        return processedItem;
      });

      const order = new Order({
        user: req.user._id,
        orderItems: processedOrderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        // For Cash on Delivery orders, we don't set isPaid to true
        ...(paymentMethod === 'Cash on Delivery' ? {} : {})
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(400);
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    // Only allow the order's user or an admin to view it
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }
    
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer?.email_address
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (order) {
    order.status = req.body.status || order.status;
    
    if (req.body.status === 'Delivered') {
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  try {
    // Ensure we're only finding orders for the currently logged in user
    const orders = await Order.find({ user: req.user._id });
    
    console.log(`Fetching orders for user ID: ${req.user._id}, found ${orders ? orders.length : 0} orders`);
    
    // Always ensure we return an array, even if the database query had issues
    res.json(orders || []);
  } catch (error) {
    console.error(`Error fetching orders for user ${req.user._id}:`, error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Request order cancellation
// @route   POST /api/orders/:id/cancel-request
// @access  Private
const requestOrderCancellation = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const orderId = req.params.id;
  
  if (!reason) {
    res.status(400);
    throw new Error('Please provide a reason for cancellation');
  }

  const order = await Order.findById(orderId);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  // Check if the user is authorized to cancel this order
  if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to cancel this order');
  }
  
  // Check if order is already delivered or cancelled
  if (order.status === 'Delivered' || order.status === 'Cancelled') {
    res.status(400);
    throw new Error(`Cannot cancel order that is already ${order.status.toLowerCase()}`);
  }
  
  // Check if there's already a pending cancellation request
  const existingRequest = await CancelOrder.findOne({ 
    order: orderId, 
    status: 'Pending' 
  });
  
  if (existingRequest) {
    res.status(400);
    throw new Error('A cancellation request for this order is already pending');
  }
  
  // Create cancellation request
  const cancelRequest = new CancelOrder({
    order: orderId,
    user: req.user._id,
    reason: reason,
    status: 'Pending'
  });
  
  // Add cancellation details to the order
  order.cancelDetails = {
    requestedAt: Date.now(),
    reason: reason,
    status: 'Pending'
  };
  
  await Promise.all([
    cancelRequest.save(),
    order.save()
  ]);
  
  res.status(201).json({ 
    message: 'Cancellation request submitted successfully',
    cancellationId: cancelRequest._id
  });
});

// @desc    Process cancellation request (admin)
// @route   PUT /api/orders/:id/cancel-process
// @access  Private/Admin
const processCancellationRequest = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const orderId = req.params.id;
  
  if (!status || !['Approved', 'Rejected'].includes(status)) {
    res.status(400);
    throw new Error('Please provide a valid status (Approved or Rejected)');
  }
  
  const order = await Order.findById(orderId);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  // Check if there's a pending cancellation request
  const cancelRequest = await CancelOrder.findOne({ 
    order: orderId, 
    status: 'Pending' 
  });
  
  if (!cancelRequest) {
    res.status(404);
    throw new Error('No pending cancellation request found for this order');
  }
  
  // Update cancellation request
  cancelRequest.status = status;
  cancelRequest.adminNote = note || '';
  cancelRequest.processedBy = req.user._id;
  cancelRequest.processedAt = Date.now();
  
  // Update order status and cancellation details
  order.cancelDetails.status = status;
  order.cancelDetails.note = note || '';
  
  // If approved, update order status to cancelled
  if (status === 'Approved') {
    order.status = 'Cancelled';
  }
  
  await Promise.all([
    cancelRequest.save(),
    order.save()
  ]);
  
  res.json({ 
    message: `Cancellation request ${status.toLowerCase()}`,
    order: order
  });
});

// @desc    Get all cancellation requests
// @route   GET /api/orders/cancellations
// @access  Private/Admin
const getCancellationRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;
  
  let query = {};
  
  if (status && ['Pending', 'Approved', 'Rejected'].includes(status)) {
    query.status = status;
  }
  
  const cancellations = await CancelOrder.find(query)
    .populate('order')
    .populate('user', 'name email')
    .populate('processedBy', 'name email')
    .sort({ createdAt: -1 });
    
  res.json(cancellations);
});

// @desc    Cancel an order (user or admin)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const orderId = req.params.id;
  
  const order = await Order.findById(orderId);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  // Check if the user is authorized to cancel this order
  if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to cancel this order');
  }
  
  // Check if order is already delivered or cancelled
  if (order.status === 'Delivered' || order.status === 'Cancelled') {
    res.status(400);
    throw new Error(`Cannot cancel order that is already ${order.status.toLowerCase()}`);
  }
  
  // Update order status
  order.status = 'Cancelled';
  order.cancelDetails = {
    requestedAt: Date.now(),
    reason: reason || 'Cancelled by user',
    status: 'Approved'
  };
  
  const updatedOrder = await order.save();
  
  // Create a record in the CancelOrder collection
  await CancelOrder.create({
    order: orderId,
    user: req.user._id,
    reason: reason || 'Cancelled by user',
    status: 'Approved',
    processedBy: req.user.isAdmin ? req.user._id : undefined,
    processedAt: Date.now()
  });
  
  res.json(updatedOrder);
});

// @desc    Mark Cash on Delivery order as paid (Admin only)
// @route   PUT /api/orders/:id/mark-paid
// @access  Private/Admin
const markCashOnDeliveryOrderAsPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check if this is a Cash on Delivery order
  if (order.paymentMethod !== 'Cash on Delivery') {
    res.status(400);
    throw new Error('This endpoint is only for Cash on Delivery orders');
  }

  // Mark the order as paid
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: `cod-${Date.now()}`,
    status: 'COMPLETED',
    update_time: new Date().toISOString(),
    email_address: req.user.email
  };

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

export {
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
};
