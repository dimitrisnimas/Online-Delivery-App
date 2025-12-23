import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

interface DecodedToken {
    id: string;
    iat: number;
    exp: number;
}

// Extend Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
                storeId: string | null;
                isSuperAdmin?: boolean;
            };
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'fallback_secret'
            ) as DecodedToken;

            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
            });

            if (!user) {
                res.status(401).json({ message: 'Not authorized, user not found' });
                return;
            }

            // Check if user belongs to the current store context ?
            // If store is resolved, we should verify user matches store?
            // "Strict data isolation".
            if (req.store) {
                if (user.storeId !== req.store.id) {
                    res.status(401).json({ message: 'Not authorized for this store' });
                    return;
                }
            }

            // Assign user with corrected types
            req.user = {
                id: user.id,
                role: user.role,
                storeId: user.storeId,
                isSuperAdmin: user.isSuperAdmin
            };
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'STAFF')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as admin/staff' });
    }
};

export const superAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.isSuperAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Super admin access required' });
    }
};
