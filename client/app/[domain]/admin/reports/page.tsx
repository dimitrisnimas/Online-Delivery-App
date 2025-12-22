"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../store/useAuth';

export default function AdminReportsPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0 });

    useEffect(() => {
        if (!user) return;
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/reports`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        })
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error(err));
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-8">Analytics & Reports</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-medium text-gray-900">Total Sales</h2>
                    <p className="mt-2 text-3xl font-bold text-indigo-600">${Number(stats.totalSales).toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-medium text-gray-900">Total Orders</h2>
                    <p className="mt-2 text-3xl font-bold text-indigo-600">{stats.totalOrders}</p>
                </div>
            </div>
        </div>
    );
}
