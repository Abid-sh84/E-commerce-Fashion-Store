import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs';

// Create transporter using the EXACT same working configuration as testEmailDirect.js
const createTransporter = () => {
  console.log('Setting up email transport with Gmail service...');
  return nodemailer.createTransport({
    service: 'gmail',  // Use lowercase 'gmail' to match your working test script
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, 
    }
  });
};

// Initialize email transporter
let transporter;
try {
  transporter = createTransporter();
  
  // Test connection
  transporter.verify((error, success) => {
    if (error) {
      console.error('SMTP Connection Error:', error);
    } else {
      console.log("SMTP server connection verified successfully");
    }
  });
} catch (err) {
  console.error('Error initializing email transport:', err);
}

// Configure the Google OAuth client with secure logging
console.log('Setting up Google OAuth client...');

// Function to mask sensitive information
const maskSensitiveInfo = (value, showChars = 4) => {
  if (!value) return '[NOT SET]';
  if (value.length <= showChars * 2) return '[SET]';
  return `${value.substring(0, showChars)}...${value.substring(value.length - showChars)}`;
};

// Log with masked information
if (process.env.GOOGLE_CLIENT_ID) {
  console.log('Client ID:', maskSensitiveInfo(process.env.GOOGLE_CLIENT_ID));
  console.log('Redirect URI configured:', process.env.GOOGLE_REDIRECT_URI ? '✓' : '✗');
} else {
  console.error('ERROR: GOOGLE_CLIENT_ID environment variable is not set or empty!');
}

// Create OAuth client with proper error handling
const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// @desc    Redirect to Google OAuth page
// @route   GET /api/users/google
// @access  Public
const googleAuth = asyncHandler(async (req, res) => {
  try {
    // Verify client ID is present
    if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID.trim() === '') {
      throw new Error('Google Client ID is not configured. Please check your environment variables.');
    }

    console.log('Google auth initiated');
    
    // Generate auth URL with explicit parameters to ensure all required fields are present
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ],
      prompt: 'consent',
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      client_id: process.env.GOOGLE_CLIENT_ID // Explicitly include client_id
    });
    
    console.log('Google auth URL generated successfully');
    
    // Redirect to Google's OAuth page
    res.redirect(authorizeUrl);
  } catch (error) {
    console.error('Google auth redirect error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent('Failed to initiate Google login: ' + error.message)}`);
  }
});

// @desc    Handle Google OAuth callback
// @route   GET /api/users/google/callback
// @access  Public
const googleCallback = asyncHandler(async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?error=${encodeURIComponent('No authorization code received')}`);
    }
    
    console.log('Auth code received');
    console.log('Google credentials verification:');
    console.log('Client ID:', maskSensitiveInfo(process.env.GOOGLE_CLIENT_ID));
    console.log('Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? '[SET]' : '[MISSING]');
    console.log('Redirect URI configured:', process.env.GOOGLE_REDIRECT_URI ? '✓' : '✗');
    
    // Use axios for direct token exchange instead of OAuth2Client
    const axios = (await import('axios')).default;
    
    // Build the token request body as form data
    const tokenRequestBody = new URLSearchParams({
      code: code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    }).toString();
    
    console.log('Sending token request to Google...');
    
    // Direct token exchange request
    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      tokenRequestBody,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    console.log('Token exchange successful');
    const { access_token } = tokenResponse.data;
    
    if (!access_token) {
      throw new Error('No access token received from Google');
    }
    
    // Get user info with the access token
    const userInfoResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );
    
    const userData = userInfoResponse.data;
    
    if (!userData || !userData.email) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?error=${encodeURIComponent('No email received from Google')}`);
    }
    
    console.log('User data received from Google:', { 
      name: userData.name,
      email: maskSensitiveInfo(userData.email, 2) // Only show first 2 chars of email
    });
    
    // Check if user exists
    let user = await User.findOne({ email: userData.email });
    
    if (!user) {
      // Create a new user
      user = await User.create({
        name: userData.name,
        email: userData.email,
        password: await generateRandomPassword(),
        avatar: userData.picture || undefined,
        authProvider: 'google',
        googleId: userData.id
      });
      console.log('New user created from Google OAuth');
    } else {
      // Update existing user if needed
      if (!user.googleId) {
        user.googleId = userData.id;
        user.authProvider = user.authProvider || 'google';
        await user.save();
        console.log('Existing user updated with Google ID');
      }
    }
    
    // Create JWT token
    const token = generateToken(user._id);
    
    // Redirect back to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${token}`);
    
  } catch (error) {
    console.error('Google callback error:', error);
    console.error('Error details:', error.response?.data || 'No detailed error info available');
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?error=${encodeURIComponent('Authentication failed: ' + (error.message || 'Unknown error'))}`);
  }
});

// Helper function to generate a random password for Google users
const generateRandomPassword = async () => {
  const randomString = Math.random().toString(36).slice(-10);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(randomString, salt);
  return hashedPassword;
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      addresses: user.addresses,
      wishlist: user.wishlist,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.avatar = req.body.avatar || user.avatar;
    
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      avatar: updatedUser.avatar,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add address to user profile
// @route   POST /api/users/addresses
// @access  Private
const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    const { 
      name, 
      street, 
      city, 
      state, 
      zip, 
      country, 
      phone,
      isDefault 
    } = req.body;
    
    // If new address is default, unset any existing default
    if (isDefault) {
      user.addresses.forEach(address => {
        address.isDefault = false;
      });
    }
    
    // Add new address
    user.addresses.push({
      name,
      street,
      city,
      state,
      zip,
      country,
      phone,
      isDefault,
    });
    
    await user.save();
    res.status(201).json(user.addresses);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user address
// @route   PUT /api/users/addresses/:id
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const addressId = req.params.id;
  
  if (user) {
    const addressIndex = user.addresses.findIndex(
      a => a._id.toString() === addressId
    );
    
    if (addressIndex === -1) {
      res.status(404);
      throw new Error('Address not found');
    }

    // If updating to default, unset any existing default
    if (req.body.isDefault) {
      user.addresses.forEach(address => {
        address.isDefault = false;
      });
    }

    // Update address fields
    Object.keys(req.body).forEach(key => {
      user.addresses[addressIndex][key] = req.body[key];
    });

    await user.save();
    res.json(user.addresses);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user address
// @route   DELETE /api/users/addresses/:id
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const addressId = req.params.id;

  if (user) {
    user.addresses = user.addresses.filter(
      address => address._id.toString() !== addressId
    );

    await user.save();
    res.json(user.addresses);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    res.json(user.addresses);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  
  const user = await User.findById(req.user._id);
  
  if (user) {
    const alreadyInWishlist = user.wishlist.find(
      item => item.toString() === productId
    );
    
    if (!alreadyInWishlist) {
      user.wishlist.push(productId);
      await user.save();
    }
    
    res.status(201).json(user.wishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:id
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  
  const user = await User.findById(req.user._id);
  
  if (user) {
    user.wishlist = user.wishlist.filter(
      item => item.toString() !== productId
    );
    
    await user.save();
    res.json(user.wishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  
  if (user) {
    res.json(user.wishlist);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Request password reset
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  console.log('Received request to reset password for:', email);

  // Find user by email
  const user = await User.findOne({ email });

  // Always return success response to prevent email enumeration
  if (!user) {
    console.log('User not found:', email);
    return res.status(200).json({
      message: 'If that email exists in our system, we\'ve sent a password reset link.',
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash token before saving to database
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set token expiry (30 minutes)
  const resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  // Update user with reset token details
  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpire = resetPasswordExpire;
  await user.save();

  // Create reset URL (frontend URL that can handle token)

  const resetUrl = `https://e-commerce-fashion-store-ykdu.vercel.app/reset-password/${resetToken}`;
  
  // Send response first to prevent timeout - IMPORTANT for serverless functions
  res.status(200).json({
    message: 'If that email exists in our system, we\'ve sent a password reset link.',
  });

  try {
    // Always recreate transporter for each email
    const transporter = createTransporter();
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Email credentials missing. Check your environment variables.');
      return; // Exit early after sending success response to client
    }
    
    console.log('Attempting to send password reset email to:', email);

    // Send the email with both HTML and text versions
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Fashion Store" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      text: `
Password Reset Request

Hello,

You are receiving this email because you (or someone else) has requested to reset your password.

Please use this link to reset your password: ${resetUrl}
(Link expires in 30 minutes)

If you did not request this, please ignore this email and your password will remain unchanged.

Regards,
The Fashion Store Team
      `,
      html: `
      <div style="background-color: #000000; color: #ffffff; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif; border: 1px solid #333333;">
        <h2 style="color: #f59e0b; text-align: center; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>You are receiving this email because you (or someone else) has requested to reset your password.</p>
        <p>Please click the button below to set a new password. This link will expire in 30 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-image: linear-gradient(to right, #b45309, #f59e0b); color: #000000; font-weight: bold; padding: 12px 24px; border-radius: 5px; text-decoration: none; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">Reset Password</a>
        </div>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p>Regards,<br>The Fashion Store Team</p>
        <p style="margin-top: 20px; font-size: 12px; color: #666666;">If the button doesn't work, copy and paste this link into your browser: ${resetUrl}</p>
      </div>
      `
    });

    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Email send error:', error);
    // We already sent success response to user, so we just log the error
    // We don't clear the token because the user may still access the reset link through console
  }
});

// @desc    Verify reset password token
// @route   GET /api/users/reset-password/:token/verify
// @access  Public
const verifyResetToken = asyncHandler(async (req, res) => {
  // Get token from URL and hash it
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Find user with matching token and valid expiry
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  res.status(200).json({ valid: true });
});

// @desc    Reset password
// @route   POST /api/users/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Get token from URL and hash it
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Find user with matching token and valid expiry
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  // Set new password and clear reset tokens
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  
  await user.save();

  // First send success response
  res.status(200).json({
    message: 'Password reset successful',
  });

  // Then attempt to send confirmation email (non-blocking)
  try {
    // Always recreate transporter for confirmation email too
    transporter = createTransporter();
    
    const message = `
      <div style="background-color: #000000; color: #ffffff; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif; border: 1px solid #333333;">
        <h2 style="color: #f59e0b; text-align: center; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">Password Reset Successful</h2>
        <p>Hello,</p>
        <p>Your password has been successfully reset.</p>
        <p>If you did not make this change, please contact our support team immediately.</p>
        <p>Regards,<br>The Fashion Store Team</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333333; text-align: center;">
          <p style="font-size: 12px; color: #666666;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Fashion Store" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Your Password Has Been Reset',
      html: message,
    });
  } catch (error) {
    console.error('Confirmation email error:', error);
    // We don't want to fail the request if only the confirmation email fails
  }
});

// @desc    Get current user data
// @route   GET /api/users/me
// @access  Private
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      authProvider: user.authProvider,
      googleId: user.googleId
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add product to recently viewed
// @route   POST /api/users/recently-viewed
// @access  Private
const addToRecentlyViewed = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  
  if (!productId) {
    res.status(400);
    throw new Error('Product ID is required');
  }
  
  const user = await User.findById(req.user._id);
  
  if (user) {
    // Remove the product if it already exists in the recently viewed list
    user.recentlyViewed = user.recentlyViewed.filter(
      item => item.product.toString() !== productId
    );
    
    // Add the product to the beginning of the array with current timestamp
    user.recentlyViewed.unshift({
      product: productId,
      viewedAt: Date.now()
    });
    
    // Limit the number of recently viewed products (keep only the last 10)
    if (user.recentlyViewed.length > 10) {
      user.recentlyViewed = user.recentlyViewed.slice(0, 10);
    }
    
    await user.save();
    res.status(201).json(user.recentlyViewed);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user's recently viewed products
// @route   GET /api/users/recently-viewed
// @access  Private
const getRecentlyViewed = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'recentlyViewed.product',
    select: 'name price images category discount rating reviewCount isNew'
  });
  
  if (user) {
    res.json(user.recentlyViewed);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user by ID (admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.avatar = req.body.avatar || user.avatar;
    
    // Update password only if provided
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    // Update admin status if provided
    if (req.body.isAdmin !== undefined) {
      user.isAdmin = req.body.isAdmin;
    }
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      avatar: updatedUser.avatar,
      authProvider: updatedUser.authProvider
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (user) {
    // Prevent deleting the original admin user
    if (user.email === 'admin@example.com') {
      res.status(400);
      throw new Error('Cannot delete the primary admin account');
    }
    
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  getAddresses,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getUsers,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  googleAuth,
  googleCallback,
  getCurrentUser,
  addToRecentlyViewed,
  getRecentlyViewed,
  getUserById,
  updateUserById,
  deleteUser
};
