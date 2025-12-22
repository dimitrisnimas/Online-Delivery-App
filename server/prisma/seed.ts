import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Create a test store
    const store = await prisma.store.upsert({
        where: { slug: 'kubikonlinedelivery' },
        update: {},
        create: {
            name: 'Kubik Online Delivery',
            slug: 'kubikonlinedelivery',
            settings: {
                deliveryFee: 5.00,
                minOrder: 15.00,
                deliveryTime: '30-45 mins'
            }
        }
    });

    console.log('✅ Created store:', store.name);

    // Create order stages
    const stages = ['Pending', 'Preparing', 'Ready', 'Delivered'];
    for (let i = 0; i < stages.length; i++) {
        await prisma.orderStage.upsert({
            where: {
                storeId_sequence: {
                    storeId: store.id,
                    sequence: i + 1
                }
            },
            update: {},
            create: {
                name: stages[i],
                sequence: i + 1,
                storeId: store.id
            }
        });
    }

    console.log('✅ Created order stages');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: {
            email_storeId: {
                email: 'admin@demo.com',
                storeId: store.id
            }
        },
        update: {},
        create: {
            email: 'admin@demo.com',
            password: hashedPassword,
            name: 'Admin User',
            role: 'ADMIN',
            storeId: store.id
        }
    });

    console.log('✅ Created admin user:', admin.email);

    // Create a category
    const category = await prisma.category.upsert({
        where: { id: 'temp-id-for-upsert' },
        update: {},
        create: {
            name: 'Burgers',
            sortOrder: 1,
            storeId: store.id
        }
    }).catch(async () => {
        // If upsert fails, try to find or create
        return await prisma.category.findFirst({
            where: { name: 'Burgers', storeId: store.id }
        }) || await prisma.category.create({
            data: {
                name: 'Burgers',
                sortOrder: 1,
                storeId: store.id
            }
        });
    });

    console.log('✅ Created category:', category.name);

    // Create sample products
    const products = [
        {
            name: 'Classic Burger',
            description: 'Beef patty with lettuce, tomato, and special sauce',
            price: 9.99,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
            categoryId: category.id,
            storeId: store.id
        },
        {
            name: 'Cheese Burger',
            description: 'Classic burger with melted cheddar cheese',
            price: 10.99,
            image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
            categoryId: category.id,
            storeId: store.id
        }
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { id: 'temp-' + product.name },
            update: {},
            create: product
        }).catch(async () => {
            await prisma.product.create({ data: product });
        });
    }

    console.log('✅ Created sample products');
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Email: admin@demo.com');
    console.log('   Password: admin123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
