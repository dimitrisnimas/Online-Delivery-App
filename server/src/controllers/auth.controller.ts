import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import generateToken from '../utils/generateToken';

const prisma = new PrismaClient();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;
        const store = req.store;

        if (!store) {
            res.status(400).json({ message: 'Store context missing' });
            return;
        }

        const userExists = await prisma.user.findFirst({
            where: {
                email,
                storeId: store.id,
            },
        });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                storeId: store.id,
                role: 'CUSTOMER', // Default role
            },
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role, user.storeId, user.isSuperAdmin),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const store = req.store;

        // Try to find user globally if no store context (for superadmin)
        let user;

        if (store) {
            user = await prisma.user.findFirst({
                where: {
                    email,
                    storeId: store.id,
                },
            });
        } else {
            // No store context - only allow if user is superadmin or has no storeId (platform admin)
            // We search by email only
            user = await prisma.user.findFirst({
                where: {
                    email,
                    // Ensure we don't accidentally log in a customer with same email from a random store
                    // Ideally superadmins have storeId: null or isSuperAdmin: true
                },
            });

            // If found, verify they are actually allowed to login globally
            if (user && !user.isSuperAdmin && user.role !== 'ADMIN') {
                // If they are a regular user but trying to login without store context, deny
                // unless we want to support a "global user portal" later.
                // For now, restrict to superadmin/admin.
                // Actually, if they are just a store admin, they should login via store domain?
                // Let's allow it if isSuperAdmin is true.
                if (!user.isSuperAdmin) {
                    res.status(401).json({ message: 'Access denied. Please login via your store domain.' });
                    return;
                }
            }
        }

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role, user.storeId, user.isSuperAdmin),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
