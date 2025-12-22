import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Express Request to include store
declare global {
    namespace Express {
        interface Request {
            store?: any; // Type strictly with Prisma generated types later
        }
    }
}

export const resolveTenant = async (req: Request, res: Response, next: NextFunction) => {
    const host = req.headers.host;
    const origin = req.headers.origin;

    // Logic to extract relevant domain/slug
    // For dev: localhost:3000 -> default store or query param?
    // For now, let's look for a header x-store-id or x-store-slug if provided, 
    // or fall back to host logic.

    const slug = req.headers['x-store-slug'] as string;
    const storeId = req.headers['x-store-id'] as string;

    try {
        let store;

        if (storeId) {
            store = await prisma.store.findUnique({ where: { id: storeId } });
        } else if (slug) {
            store = await prisma.store.findUnique({ where: { slug } });
        } else {
            // Host resolution (e.g. storename.delivery.com or mystore.com)
            // This requires sophisticated parsing. 
            // Simplified: Assume host is domain.
            if (host) {
                store = await prisma.store.findUnique({ where: { customDomain: host } });
            }
        }

        if (!store) {
            // If no store found, maybe we are on the main platform page? 
            // For now, return 404 Store Not Found for API calls requiring context.
            // But maybe some routes are global?
            // We will attach store if found, otherwise undefined.
        } else {
            req.store = store;
        }

        next();
    } catch (error) {
        console.error('Tenant resolution error:', error);
        next(error);
    }
};
