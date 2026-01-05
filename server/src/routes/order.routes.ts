import express from 'express';
import { createOrder, getMyOrders, updateOrderStatus, getStoreOrders, getReports, getTrackOrder } from '../controllers/order.controller';
import { protect, admin, storeAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', createOrder); // Public access for guest checkout (controller checks for user or guest details)
router.get('/', protect, admin, getStoreOrders); // Admin/Staff
router.get('/my', protect, getMyOrders);

// Admin/Staff routes
router.get('/reports', protect, storeAdmin, getReports); // Admin ONLY
router.put('/:id/status', protect, admin, updateOrderStatus); // Admin/Staff

// Public tracking
router.get('/track/:id', getTrackOrder);

export default router;
