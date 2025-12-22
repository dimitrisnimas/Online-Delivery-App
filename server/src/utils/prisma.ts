import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

let prisma: PrismaClient;

function getPrismaClient() {
    if (!prisma) {
        const connectionString = process.env.DATABASE_URL;

        if (!connectionString) {
            throw new Error('DATABASE_URL environment variable is not set');
        }

        const pool = new Pool({ connectionString });
        const adapter = new PrismaPg(pool);

        prisma = new PrismaClient({
            adapter,
            log: ['error', 'warn'],
        });
    }
    return prisma;
}

export default getPrismaClient();
