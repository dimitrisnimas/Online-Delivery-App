import express from 'express';
import { getStoreInfo, updateStoreSettings } from '../controllers/store.controller';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getStoreInfo);
router.put('/', protect, admin, updateStoreSettings);

export default router;
