import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Get all products for current store
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const store = req.store;
        if (!store) {
            res.json({ message: 'Store context required' });
            return;
        }

        const products = await prisma.product.findMany({
            where: { storeId: store.id },
            include: { category: true, variations: true, addons: true },
        });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        // req.file should be present if upload middleware used.
        // req.body contains text fields.
        const { name, price, description, categoryId } = req.body;
        const store = req.store;

        // Manual check if user belongs to store (already done in protect logic partially, but double check store)
        // Actually protect middleware checks if user.storeId === req.store.id

        // We need to handle 'image' path.
        const image = req.file ? `/uploads/${req.file.filename}` : '/placeholder.jpg';

        const product = await prisma.product.create({
            data: {
                name,
                price: parseFloat(price),
                description,
                categoryId,
                storeId: store.id,
                image,
            },
        });

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// ... Add update/delete later
