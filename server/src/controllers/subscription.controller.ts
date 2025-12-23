import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// @desc    Get subscription info
// @route   GET /api/subscription
// @access  Private (Admin)
export const getSubscription = async (req: Request, res: Response) => {
    try {
        if (!req.store) {
            return res.status(404).json({ message: 'Store context not found' });
        }

        const subscription = await prisma.subscription.findUnique({
            where: { storeId: req.store.id }
        });

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        res.json(subscription);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// @desc    Simulate payment/upgrade (Demo)
// @route   POST /api/subscription/upgrade
// @access  Private (Admin)
export const upgradeSubscription = async (req: Request, res: Response) => {
    try {
        if (!req.store) {
            return res.status(404).json({ message: 'Store context not found' });
        }

        const { plan } = req.body; // BASIC, PREMIUM

        // In production, this would initialize a Stripe session

        const subscription = await prisma.subscription.update({
            where: { storeId: req.store.id },
            data: {
                plan,
                status: 'ACTIVE',
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) // 1 year
            }
        });

        // Also ensure store is active
        await prisma.store.update({
            where: { id: req.store.id },
            data: { isActive: true }
        });

        res.json(subscription);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
