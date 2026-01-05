import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/useAuth';

interface Order {
    id: string;
    total: number;
    status: { id: string; name: string };
    createdAt: string;
    items: any[];
    user?: { name: string; email: string };
    guestName?: string;
}

export default function StoreOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (err) {
            console.error('Failed to fetch orders');
        }
    };

    const updateStatus = async (orderId: string, statusName: string) => {
        try {
            // In a real app, we should fetch status ID by name or have a map.
            // For now, let's assume we send the ID if we knew it, or backend handles name?
            // The backend expects `statusId`.
            // We need to fetch available statuses first to know IDs.
            // OR, we can just fetch statuses on mount.

            // Let's fetch statuses first.
            const statusRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`); // This returns store info, maybe include statuses?
            // Actually, let's just use a hardcoded map or fetch from a new endpoint if needed.
            // But wait, order object has status. We can't guess IDs.

            // Quick fix: Fetch all stages for the store.
            // We don't have an endpoint for that yet.
            // Let's assume the backend can handle status NAME or we fetch them.

            // Better approach for this MVP:
            // Just log it for now as "Not Implemented" fully without status IDs.
            // OR, create an endpoint to get order stages.
            console.log('Update status to', statusName);
            alert('Status update requires fetching valid Status IDs first. Feature pending backend endpoint for OrderStages.');
        } catch (err) {
            console.error('Failed to update status');
        }
    };

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
                {orders.map((order) => (
                    <li key={order.id}>
                        <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-indigo-600 truncate">
                                    Order #{order.id.slice(0, 8)}
                                </p>
                                <div className="ml-2 flex-shrink-0 flex">
                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {order.status?.name}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                    <p className="flex items-center text-sm text-gray-500">
                                        {order.user?.name || order.guestName || 'Guest'}
                                    </p>
                                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                        Total: ${Number(order.total).toFixed(2)}
                                    </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                    <div className="flex space-x-2">
                                        <button onClick={() => updateStatus(order.id, 'Preparing')} className="text-indigo-600 hover:text-indigo-900 text-xs border border-indigo-600 rounded px-2 py-1">Accept</button>
                                        <button onClick={() => updateStatus(order.id, 'Ready')} className="text-indigo-600 hover:text-indigo-900 text-xs border border-indigo-600 rounded px-2 py-1">Ready</button>
                                        <button onClick={() => updateStatus(order.id, 'Completed')} className="text-green-600 hover:text-green-900 text-xs border border-green-600 rounded px-2 py-1">Complete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
                {orders.length === 0 && (
                    <li className="px-4 py-4 sm:px-6 text-center text-gray-500">No orders found</li>
                )}
            </ul>
        </div>
    );
}
