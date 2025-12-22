import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// @desc    Get current store info
// @route   GET /api/store
// @access  Public
export const getStoreInfo = async (req: Request, res: Response): Promise<void> => {
    try {
        const store = req.store;
        if (!store) {
            res.status(404).json({ message: 'Store not found' });
            return;
        }
        res.json(store);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update store settings
// @route   PUT /api/store
// @access  Private (Admin)
export const updateStoreSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const store = req.store;
        if (!store) {
            res.status(404).json({ message: 'Store not found' });
            return;
        }

        const { name } = req.body;
        // In a real app, we'd have more fields like description, logo, colors, etc.
        // Schema only has `name` for now.

        // Verify ownership??? 
        // Admin middleware checks if user.storeId matches req.store.id
        // So we are good.

        const updatedStore = await prisma.store.update({
            where: { id: store.id },
            data: { name }
        });

        res.json(updatedStore);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
