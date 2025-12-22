"use client";

import React from 'react';
import { useCart } from '../store/useCart';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
}

export default function ProductCard({ product }: { product: Product }) {
    const addItem = useCart((state) => state.addItem);

    const handleAddToCart = () => {
        addItem({
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: 1,
            image: product.image
        });
        // Optional: Toast notification
    };

    return (
        <div className="group relative bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-56">
                {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${product.image}`}
                        alt={product.name}
                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                ) : (
                    <div className="h-full w-full bg-gray-300 flex items-center justify-center">No Image</div>
                )}
            </div>
            <div className="mt-4 flex justify-between flex-grow">
                <div>
                    <h3 className="text-sm text-gray-700">
                        {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">${product.price}</p>
            </div>
            <button
                onClick={handleAddToCart}
                className="mt-4 w-full bg-indigo-600 border border-transparent rounded-md py-2 px-8 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Add
            </button>
        </div>
    );
}
