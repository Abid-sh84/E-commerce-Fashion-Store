import express from 'express';
import { addSubscriber, getSubscribers } from '../controllers/subscriberController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(addSubscriber).get(protect, admin, getSubscribers);

export default router;
