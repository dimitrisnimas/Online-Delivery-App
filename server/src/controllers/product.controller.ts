import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// @desc    Get all products for current store
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const store = req.store;
        if (!store) {
            res.status(400).json({ message: 'Store context required' });
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

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin/Staff)
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, price, categoryId } = req.body;
        const store = req.store;

        const product = await prisma.product.findUnique({
            where: { id: req.params.id }
        });

        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        if (product.storeId !== store?.id) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        let image = product.image;
        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        }

        const updatedProduct = await prisma.product.update({
            where: { id: req.params.id },
            data: {
                name,
                description,
                price: price ? Number(price) : undefined,
                image,
                categoryId
            }
        });

        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin/Staff)
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const store = req.store;
        const product = await prisma.product.findUnique({
            where: { id: req.params.id }
        });

        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        if (product.storeId !== store?.id) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        await prisma.product.delete({
            where: { id: req.params.id }
        });

        res.json({ message: 'Product removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
