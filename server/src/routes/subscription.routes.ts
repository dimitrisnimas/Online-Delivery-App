import express from 'express';
import { getSubscription, upgradeSubscription } from '../controllers/subscription.controller';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, admin, getSubscription);
router.post('/upgrade', protect, admin, upgradeSubscription);

export default router;
