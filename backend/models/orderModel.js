import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        size: { type: String, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      default: 'Processing',
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    },
    deliveredAt: {
      type: Date,
    },
    cancelDetails: {
      requestedAt: {
        type: Date,
      },
      reason: {
        type: String,
      },
      status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
      },
      note: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Fix: Properly use 'new' with ObjectId constructor
orderSchema.pre('save', function(next) {
  try {
    // Ensure all product IDs in orderItems are valid ObjectIds
    this.orderItems.forEach((item, index) => {
      if (item.product && !mongoose.Types.ObjectId.isValid(item.product)) {
        // Try to convert to ObjectId if it's not already valid
        try {
          // Use 'new' with ObjectId constructor
          const paddedId = String(item.product).padStart(24, '0');
          this.orderItems[index].product = new mongoose.Types.ObjectId(paddedId);
        } catch (e) {
          console.error(`Failed to convert product ID: ${item.product}`);
          throw new Error(`Invalid product ID format: ${item.product}`);
        }
      }
    });
    
    next();
  } catch (error) {
    next(error);
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
