import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/useAuth';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
}

export default function MenuManagement() {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    // Add form state for creating product...

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // Public endpoint, but we might want a private one for full details?
            // Using public for now.
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (err) {
            console.error('Failed to fetch products');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            if (res.ok) {
                fetchProducts();
            } else {
                alert('Failed to delete');
            }
        } catch (err) {
            console.error('Failed to delete product');
        }
    };

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Menu Items</h3>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm">
                    Add Item
                </button>
            </div>
            <ul role="list" className="divide-y divide-gray-200">
                {products.map((product) => (
                    <li key={product.id}>
                        <div className="px-4 py-4 sm:px-6 flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full object-cover" src={product.image || '/placeholder.jpg'} alt="" />
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500">${Number(product.price).toFixed(2)}</div>
                            </div>
                            <div className="ml-auto">
                                <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
