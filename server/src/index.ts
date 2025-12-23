import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { resolveTenant } from './middleware/tenant';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import storeRoutes from './routes/store.routes';
import superAdminRoutes from './routes/superadmin.routes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*', // TODO: restrict in production
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded images
app.use(resolveTenant);

app.set('io', io); // Make io accessible in controllers

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/superadmin', superAdminRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'API is running...',
        store: req.store ? req.store.name : 'Global Context (No Store Identified)'
    });
});

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join store room if storeId provided
    const storeId = socket.handshake.query.storeId;
    if (storeId && typeof storeId === 'string') {
        socket.join(`store:${storeId}`);
        console.log(`Socket ${socket.id} joined store:${storeId}`);
    }

    socket.on('joinOrder', (orderId: string) => {
        socket.join(`order:${orderId}`);
        console.log(`Socket ${socket.id} joined order:${orderId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
