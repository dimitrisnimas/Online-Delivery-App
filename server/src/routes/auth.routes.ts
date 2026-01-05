import express from 'express';
import { registerUser, loginUser, createStaff, getStaff } from '../controllers/auth.controller';
import { protect, storeAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/staff')
    .post(protect, storeAdmin, createStaff)
    .get(protect, storeAdmin, getStaff);

export default router;
