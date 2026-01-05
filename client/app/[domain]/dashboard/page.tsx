"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../store/useAuth';
import { useRouter } from 'next/navigation';
import StoreOrders from '../../../components/StoreOrders';
import MenuManagement from '../../../components/MenuManagement';
import StaffManagement from '../../../components/StaffManagement';

interface Order {
    id: string;
    total: number;
    status: { name: string };
    createdAt: string;
    items: any[];
}

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('orders');
    const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
    const [revenue, setRevenue] = useState<{ totalSales: number; totalOrders: number } | null>(null);

    useEffect(() => {
        if (!user) {
            router.push('login');
            return;
        }

        if (user.role === 'CUSTOMER') {
            fetchCustomerOrders();
        } else if (user.role === 'ADMIN' && activeTab === 'revenue') {
            fetchRevenue();
        }
    }, [user, router, activeTab]);

    const fetchCustomerOrders = async () => {
        if (!user) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/my`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCustomerOrders(data);
            }
        } catch (error) {
            console.error('Failed to fetch orders');
        }
    };

    const fetchRevenue = async () => {
        if (!user) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/reports`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRevenue(data);
            }
        } catch (error) {
            console.error('Failed to fetch revenue');
        }
    };

    if (!user) return null;

    // Customer View
    if (user.role === 'CUSTOMER') {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul role="list" className="divide-y divide-gray-200">
                            {customerOrders.map((order) => (
                                <li key={order.id}>
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-indigo-600 truncate">
                                                Order #{order.id.slice(0, 8)}
                                            </p>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {order.status?.name || 'Pending'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    {order.items?.length} items
                                                </p>
                                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                    Total: ${Number(order.total).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                <p>
                                                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {customerOrders.length === 0 && (
                                <li className="px-4 py-4 sm:px-6 text-center text-gray-500">No orders found</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    // Admin/Staff View
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Store Dashboard</h1>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                        {user.role}
                    </span>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`${activeTab === 'orders' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('menu')}
                            className={`${activeTab === 'menu' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Menu
                        </button>
                        {user.role === 'ADMIN' && (
                            <>
                                <button
                                    onClick={() => setActiveTab('revenue')}
                                    className={`${activeTab === 'revenue' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Revenue
                                </button>
                                <button
                                    onClick={() => setActiveTab('staff')}
                                    className={`${activeTab === 'staff' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Staff
                                </button>
                            </>
                        )}
                    </nav>
                </div>

                {/* Content */}
                {activeTab === 'orders' && <StoreOrders />}
                {activeTab === 'menu' && <MenuManagement />}
                {activeTab === 'revenue' && user.role === 'ADMIN' && (
                    <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-base font-normal text-gray-900">Total Sales</dt>
                            <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                                <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                                    ${revenue?.totalSales ? Number(revenue.totalSales).toFixed(2) : '0.00'}
                                </div>
                            </dd>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-base font-normal text-gray-900">Total Orders</dt>
                            <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                                <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                                    {revenue?.totalOrders || 0}
                                </div>
                            </dd>
                        </div>
                    </div>
                )}
                {activeTab === 'staff' && user.role === 'ADMIN' && <StaffManagement />}
            </main>
        </div>
    );
}
