import { PrismaClient } from '@prisma/client';

// Passing 'log' options to satisfy "non-empty options" requirement if needed,
// and avoiding 'datasources' TS error by relying on env var.
const prisma = new PrismaClient({
    log: ['error', 'warn'],
});

export default prisma;
