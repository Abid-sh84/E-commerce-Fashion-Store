import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      // Modified: Not required for Google OAuth users
      required: function() {
        return this.authProvider === 'local';
      },
    },
    avatar: {
      type: String,
      default: '/images/avatars/default.png',
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    // Added: Authentication provider field
    authProvider: {
      type: String,
      default: 'local',
      enum: ['local', 'google', 'facebook']
    },
    // Added: Google ID for OAuth users
    googleId: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    // Added: Recently viewed products with timestamps
    recentlyViewed: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        }
      }
    ],
    addresses: [
      {
        name: String,
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        phone: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  // Only hash the password if it exists (for non-OAuth users)
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
