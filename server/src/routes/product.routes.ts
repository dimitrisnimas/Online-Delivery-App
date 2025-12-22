import express from 'express';
import { getProducts, createProduct } from '../controllers/product.controller';
import { protect, admin } from '../middleware/authMiddleware';
import upload from '../utils/upload';

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, admin, upload.single('image'), createProduct);

export default router;
