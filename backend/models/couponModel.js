import mongoose from 'mongoose';

const couponSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  minAmount: {
    type: Number,
    default: 0
  },
  maxUses: {
    type: Number,
    default: 0 // 0 means unlimited
  },
  uses: {
    type: Number,
    default: 0
  },
  expiryDate: {
    type: Date
  },
  active: {
    type: Boolean,
    default: true
  },
  description: {
    type: String
  },
  // Adding category restrictions
  applicableCategories: {
    type: [String],
    default: [] // Empty array means applies to all categories
  },
  isGlobal: {
    type: Boolean,
    default: true // If true, applies to all products regardless of category
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add method to check if a coupon is valid
couponSchema.methods.isValid = function() {
  // Check if active
  if (!this.active) return false;
  
  // Check if expired
  if (this.expiryDate && new Date(this.expiryDate) < new Date()) return false;
  
  // Check if maximum uses reached
  if (this.maxUses > 0 && this.uses >= this.maxUses) return false;
  
  return true;
};

// Check if a coupon is applicable to a specific category
couponSchema.methods.isApplicableToCategory = function(category) {
  // If global, it applies to all categories
  if (this.isGlobal) return true;
  
  // If no category provided, check if the coupon is global
  if (!category) return this.isGlobal;
  
  // Check if the category is in the applicable categories list
  return this.applicableCategories.includes(category);
};

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;