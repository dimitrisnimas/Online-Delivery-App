import express from 'express';
import { createOrder, getMyOrders, updateOrderStatus, getStoreOrders, getReports } from '../controllers/order.controller';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', createOrder); // Public access for guest checkout (controller checks for user or guest details)
router.get('/', protect, getStoreOrders); // Needs admin check ideally, but protect + store context check is start
router.get('/my', protect, getMyOrders);

// Admin/Staff routes
router.get('/reports', protect, getReports); // Should have admin check
router.put('/:id/status', protect, updateOrderStatus); // Should include admin middleware

export default router;
