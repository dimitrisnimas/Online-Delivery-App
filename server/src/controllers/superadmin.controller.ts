import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';

// @desc    Get all stores with stats
// @route   GET /api/superadmin/stores
// @access  SuperAdmin
export const getAllStores = async (req: Request, res: Response) => {
    try {
        const stores = await prisma.store.findMany({
            include: {
                subscription: true,
                _count: {
                    select: {
                        orders: true,
                        users: true,
                        products: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(stores);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// @desc    Create a new store
// @route   POST /api/superadmin/stores
// @access  SuperAdmin
export const createStore = async (req: Request, res: Response) => {
    try {
        const { name, slug, email, password, plan } = req.body;

        const storeExists = await prisma.store.findUnique({ where: { slug } });
        if (storeExists) {
            return res.status(400).json({ message: 'Store slug already exists' });
        }

        // Transaction to ensure store, admin, and subscription are created together
        const result = await prisma.$transaction(async (prisma) => {
            // 1. Create Store
            const store = await prisma.store.create({
                data: {
                    name,
                    slug,
                    isActive: true
                }
            });

            // 2. Create Store Admin
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.create({
                data: {
                    name: `${name} Admin`,
                    email,
                    password: hashedPassword,
                    role: 'ADMIN',
                    storeId: store.id
                }
            });

            // 3. Create Subscription
            await prisma.subscription.create({
                data: {
                    storeId: store.id,
                    plan: plan || 'FREE',
                    status: 'ACTIVE',
                    startDate: new Date()
                }
            });

            // 4. Create Default Order Stages
            const stages = ['Pending', 'Preparing', 'Ready', 'Delivered'];
            for (let i = 0; i < stages.length; i++) {
                await prisma.orderStage.create({
                    data: {
                        name: stages[i],
                        sequence: i + 1,
                        storeId: store.id
                    }
                });
            }

            return store;
        });

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// @desc    Update store status (suspend/activate)
// @route   PUT /api/superadmin/stores/:id/status
// @access  SuperAdmin
export const updateStoreStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const store = await prisma.store.update({
            where: { id },
            data: { isActive }
        });

        // Also update subscription status if suspending
        if (!isActive) {
            await prisma.subscription.update({
                where: { storeId: id },
                data: { status: 'SUSPENDED' }
            });
        } else {
            await prisma.subscription.update({
                where: { storeId: id },
                data: { status: 'ACTIVE' }
            });
        }

        res.json(store);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// @desc    Get platform analytics
// @route   GET /api/superadmin/analytics
// @access  SuperAdmin
export const getPlatformAnalytics = async (req: Request, res: Response) => {
    try {
        const totalStores = await prisma.store.count();
        const totalUsers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
        const totalOrders = await prisma.order.count();

        // Calculate total revenue across all stores (simplified)
        // In real SaaS, this would be subscription revenue vs GMV
        const revenueResult = await prisma.order.aggregate({
            _sum: { total: true }
        });

        res.json({
            totalStores,
            totalUsers,
            totalOrders,
            totalRevenue: revenueResult._sum.total || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
