"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../store/useAuth";
import {
    Plus,
    Search,
    MoreVertical,
    Store as StoreIcon,
    CheckCircle,
    XCircle,
    Loader2
} from "lucide-react";

interface Store {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    createdAt: string;
    subscription?: {
        plan: string;
        status: string;
    };
    _count: {
        orders: number;
        products: number;
    };
}

export default function StoresPage() {
    const { user } = useAuth();
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchStores();
    }, [user]);

    const fetchStores = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superadmin/stores`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setStores(data);
            }
        } catch (error) {
            console.error("Failed to fetch stores", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStoreStatus = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/superadmin/stores/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`,
                },
                body: JSON.stringify({ isActive: !currentStatus }),
            });

            if (res.ok) {
                // Optimistic update
                setStores(stores.map(store =>
                    store.id === id ? { ...store, isActive: !currentStatus } : store
                ));
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin h-8 w-8 text-orange-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Stores
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Manage all registered restaurants and shops
                    </p>
                </div>
                <Link
                    href="/superadmin/stores/new"
                    className="inline-flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors shadow-lg shadow-orange-500/30"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Store
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search stores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>
            </div>

            {/* Stores Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredStores.map((store) => (
                    <div
                        key={store.id}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-shadow group"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                                        <StoreIcon className="w-6 h-6 text-slate-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                                            {store.name}
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            {store.slug}.kubikdelivery.com
                                        </p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => toggleStoreStatus(store.id, store.isActive)}
                                        className={`p-2 rounded-lg transition-colors ${store.isActive ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-100'}`}
                                        title={store.isActive ? "Deactivate Store" : "Activate Store"}
                                    >
                                        {store.isActive ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Orders</p>
                                    <p className="font-bold text-slate-900 dark:text-white">{store._count.orders}</p>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Products</p>
                                    <p className="font-bold text-slate-900 dark:text-white">{store._count.products}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${store.subscription?.plan === 'PREMIUM'
                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                    }`}>
                                    {store.subscription?.plan || 'FREE'}
                                </span>
                                <span className="text-xs text-slate-400">
                                    Joined {new Date(store.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
