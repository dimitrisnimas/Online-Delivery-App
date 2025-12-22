import React from 'react';
import ProductCard from '../../components/ProductCard';

export const dynamic = 'force-dynamic';

async function getStoreData(domain: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`, {
        headers: {
            'x-store-slug': domain,
            'Host': domain
        },
        cache: 'no-store'
    });

    if (!res.ok) {
        return null;
    }
    return res.json();
}

async function getProducts(domain: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        headers: {
            'x-store-slug': domain,
            'Host': domain
        },
        cache: 'no-store'
    });
    if (!res.ok) return [];
    return res.json();
}

export default async function Page({ params }: { params: Promise<{ domain: string }> }) {
    const { domain } = await params;
    const store = await getStoreData(domain);
    const products = await getProducts(domain);

    if (!store) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900">404</h1>
                    <p className="mt-2 text-gray-600">Store not found: {domain}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                            {store.name}
                        </h1>
                        <p className="max-w-xl mx-auto mt-5 text-xl text-gray-500">
                            Order online for delivery or pickup.
                        </p>
                    </div>
                </div>
            </div>

            {/* Menu / Products */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Menu</h2>

                <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
