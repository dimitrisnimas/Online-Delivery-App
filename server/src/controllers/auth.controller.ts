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

        let user;

        if (!store) {
            // Platform Context (domain.com) - SUPERADMIN ONLY
            user = await prisma.user.findFirst({
                where: { email }
            });

            // If user exists but is NOT a superadmin, deny access
            if (user && !user.isSuperAdmin) {
                res.status(403).json({ message: 'Access denied. Please login via your store domain.' });
                return;
            }
        } else {
            // Store Context (store.domain.com) - STORE USERS ONLY
            user = await prisma.user.findFirst({
                where: {
                    email,
                    storeId: store.id,
                },
            });
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
// @desc    Create a new staff member
// @route   POST /api/auth/staff
// @access  Private (Store Admin)
export const createStaff = async (req: Request, res: Response): Promise<void> => {
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
                role: 'STAFF',
            },
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all staff members
// @route   GET /api/auth/staff
// @access  Private (Store Admin)
export const getStaff = async (req: Request, res: Response): Promise<void> => {
    try {
        const store = req.store;
        if (!store) {
            res.status(400).json({ message: 'Store context missing' });
            return;
        }

        const staff = await prisma.user.findMany({
            where: {
                storeId: store.id,
                role: 'STAFF'
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        res.json(staff);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
