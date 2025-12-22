"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../store/useAuth';
// import io from 'socket.io-client';

interface Order {
    id: string;
    total: number;
    status: { name: string };
    items: any[];
    createdAt: string;
    deliveryAddress?: string;
    // user...
}

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error("Failed to fetch orders", error);
            }
        };

        fetchOrders();
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-8">Store Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Orders Column */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Live Orders</h2>
                    {orders.length === 0 ? (
                        <p className="text-gray-500 text-sm">No orders yet.</p>
                    ) : (
                        <div className="flow-root">
                            <ul className="divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <li key={order.id} className="py-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">Order #{order.id.slice(0, 8)}</p>
                                                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                                                <p className="text-sm text-gray-500">
                                                    {order.items?.map((i: any) => `${i.quantity}x ${i.product?.name}`).join(', ')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">${Number(order.total).toFixed(2)}</p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status?.name === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status?.name === 'Completed' ? 'bg-green-100 text-green-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {order.status?.name || 'Unknown'}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Quick Stats / Products */}
                <div className="bg-white rounded-lg shadow p-6 h-fit">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="flex flex-col space-y-4">
                        <a href="products" className="block text-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
                            Add / Manage Products
                        </a>
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition">
                            Store Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
