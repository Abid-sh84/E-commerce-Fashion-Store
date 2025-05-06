import asyncHandler from 'express-async-handler';
import Subscriber from '../models/subscriberModel.js';

// @desc    Add new subscriber
// @route   POST /api/subscribers
// @access  Public
const addSubscriber = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide an email address');
  }

  // Check if email already exists
  const subscriberExists = await Subscriber.findOne({ email });

  if (subscriberExists) {
    res.status(400);
    throw new Error('You are already subscribed to our newsletter');
  }

  // Create new subscriber
  const subscriber = await Subscriber.create({
    email,
  });

  if (subscriber) {
    res.status(201).json({
      _id: subscriber._id,
      email: subscriber.email,
      message: 'Thank you for subscribing to our newsletter!',
    });
  } else {
    res.status(400);
    throw new Error('Invalid subscriber data');
  }
});

// @desc    Get all subscribers
// @route   GET /api/subscribers
// @access  Private/Admin
const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscriber.find({});
  res.json(subscribers);
});

export { addSubscriber, getSubscribers };
