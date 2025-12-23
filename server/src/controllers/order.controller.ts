import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// @desc    Place new order
// @route   POST /api/orders
// @access  Public (Guest or Customer)
export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { items, type, deliveryAddress, guestName, guestEmail, guestPhone } = req.body;
        const store = req.store;
        const user = req.user;

        if (!store) {
            res.status(400).json({ message: 'Store context missing' });
            return;
        }

        // Guest Checkout Validation
        if (!user && (!guestEmail || !guestPhone)) {
            res.status(400).json({ message: 'Please provide email and phone for guest checkout' });
            return;
        }

        if (!items || items.length === 0) {
            res.status(400).json({ message: 'No order items' });
            return;
        }

        let total = 0;
        const orderItemsData = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });
            if (!product) {
                throw new Error(`Product not found: ${item.productId}`);
            }

            let price = Number(product.price);
            let variationId = null;

            if (item.variationId) {
                const variation = await prisma.variation.findUnique({ where: { id: item.variationId } });
                if (variation) {
                    price = Number(variation.price);
                    variationId = variation.id;
                }
            }

            total += price * item.quantity;

            orderItemsData.push({
                productId: product.id,
                quantity: item.quantity,
                price: price,
                variationId: variationId,
            });
        }

        const initialStatus = await prisma.orderStage.findFirst({
            where: { storeId: store.id, sequence: 0 }
        });

        let statusId = initialStatus?.id;
        if (!statusId) {
            const newStatus = await prisma.orderStage.create({
                data: { name: 'Pending', sequence: 0, storeId: store.id }
            });
            statusId = newStatus.id;
        }

        const order = await prisma.order.create({
            data: {
                storeId: store.id,
                userId: user?.id, // Optional now
                guestName,
                guestEmail,
                guestPhone,
                total,
                type,
                deliveryAddress,
                statusId: statusId!,
                items: {
                    create: orderItemsData
                }
            },
            include: {
                items: true,
                user: true
            }
        });

        const io = req.app.get('io');
        if (io) {
            io.to(`store:${store.id}`).emit('newOrder', order);
            console.log(`Emitted newOrder to store:${store.id}`);
        }

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get store orders (Admin/Staff)
// @route   GET /api/orders
// @access  Private (Admin/Staff)
export const getStoreOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const store = req.store;
        if (!store) {
            res.status(400).json({ message: 'Store context missing' });
            return;
        }

        const orders = await prisma.order.findMany({
            where: { storeId: store.id },
            include: { items: { include: { product: true } }, status: true, user: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get my orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }
        const orders = await prisma.order.findMany({
            where: { userId: req.user.id },
            include: { items: { include: { product: true } }, status: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Staff)
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { statusId } = req.body;
        const orderId = req.params.id;

        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { statusId },
            include: { status: true }
        });

        // Emit socket event
        const io = req.app.get('io');
        if (io) {
            io.to(`order:${orderId}`).emit('orderUpdate', updatedOrder);
            io.to(`store:${order.storeId}`).emit('orderUpdate', updatedOrder);
        }

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get sales reports
// @route   GET /api/orders/reports
// @access  Private (Admin)
export const getReports = async (req: Request, res: Response): Promise<void> => {
    try {
        const store = req.store;
        if (!store) {
            res.status(400).json({ message: 'Store context missing' });
            return;
        }

        const aggregations = await prisma.order.aggregate({
            _sum: {
                total: true
            },
            _count: {
                id: true
            },
            where: {
                storeId: store.id,
                status: {
                    name: { not: 'Cancelled' }
                }
            }
        });

        res.json({
            totalSales: aggregations._sum.total || 0,
            totalOrders: aggregations._count.id || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Track order (Public/Guest)
// @route   GET /api/orders/track/:id
// @access  Public
export const getTrackOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Find order
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: { include: { product: true } },
                status: true,
                store: { select: { name: true, customDomain: true, slug: true } }
            }
        });

        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
