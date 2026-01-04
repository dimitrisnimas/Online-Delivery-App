"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../store/useAuth";
import {
    Store,
    Users,
    ShoppingBag,
    DollarSign,
    TrendingUp,
    ArrowUpRight
} from "lucide-react";

interface Analytics {
    totalStores: number;
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
}

export default function SuperAdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superadmin/analytics`, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Stores",
            value: stats?.totalStores || 0,
            icon: Store,
            color: "text-blue-600",
            bg: "bg-blue-100 dark:bg-blue-900/20",
        },
        {
            title: "Total Orders",
            value: stats?.totalOrders || 0,
            icon: ShoppingBag,
            color: "text-orange-600",
            bg: "bg-orange-100 dark:bg-orange-900/20",
        },
        {
            title: "Total Users",
            value: stats?.totalUsers || 0,
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-100 dark:bg-purple-900/20",
        },
        {
            title: "Total Revenue",
            value: `$${stats?.totalRevenue.toFixed(2) || "0.00"}`,
            icon: DollarSign,
            color: "text-green-600",
            bg: "bg-green-100 dark:bg-green-900/20",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Platform Overview
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Welcome back, {user?.name}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className="flex items-center text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                <TrendingUp className="w-3 h-3 mr-1" /> +12%
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            {stat.value}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {stat.title}
                        </p>
                    </div>
                ))}
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Recent Activity
                    </h2>
                    <button className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center">
                        View All <ArrowUpRight className="w-4 h-4 ml-1" />
                    </button>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                    <Store className="w-5 h-5 text-slate-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">
                                        New Store Created
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        "Burger King" joined the platform
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm text-slate-500">2 hours ago</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
