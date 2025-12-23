import express from 'express';
import { protect, superAdmin } from '../middleware/authMiddleware';
import {
    getAllStores,
    createStore,
    updateStoreStatus,
    getPlatformAnalytics
} from '../controllers/superadmin.controller';

const router = express.Router();

// All routes are protected and require super admin role
router.use(protect, superAdmin);

router.get('/stores', getAllStores);
router.post('/stores', createStore);
router.put('/stores/:id/status', updateStoreStatus);
router.get('/analytics', getPlatformAnalytics);

export default router;
