import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create payment intent
// @route   POST /api/payment/create-payment-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: 'usd',
    metadata: { integration_check: 'accept_a_payment' },
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
  });
});

// @desc    Validate discount code
// @route   POST /api/payment/validate-coupon
// @access  Public
const validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;

  // For demo purposes, we'll just validate a few fixed codes
  const validCoupons = {
    'WELCOME10': { discount: 0.10, message: '10% discount applied!' },
    'STARRY20': { discount: 0.20, message: '20% discount applied!' },
    'FREESHIP': { discount: 0.15, message: '15% discount and free shipping!' },
  };

  if (validCoupons[code]) {
    res.json({
      isValid: true,
      discountRate: validCoupons[code].discount,
      message: validCoupons[code].message,
    });
  } else {
    res.status(400).json({
      isValid: false,
      message: 'Invalid coupon code',
    });
  }
});

export { createPaymentIntent, validateCoupon };
