import express from 'express';
import { recordVisit, getVisitorAnalytics } from '../controllers/visitorController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to record visits
router.post('/', recordVisit);

// Admin route to get analytics data
router.get('/', protect, admin, getVisitorAnalytics);

export default router;