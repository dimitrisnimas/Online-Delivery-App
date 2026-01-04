"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../store/useAuth";
import {
    LayoutDashboard,
    Store,
    Settings,
    LogOut,
    Menu,
    X,
    ShoppingBag
} from "lucide-react";

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Protect routes
    useEffect(() => {
        if (!user) {
            router.push("/superadmin/login");
        }
    }, [user, router]);

    // If on login page, just render children without layout
    if (pathname === "/superadmin/login") {
        return <>{children}</>;
    }

    if (!user) return null;

    const navItems = [
        { name: "Dashboard", href: "/superadmin", icon: LayoutDashboard },
        { name: "Stores", href: "/superadmin/stores", icon: Store },
        { name: "Settings", href: "/superadmin/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:relative lg:translate-x-0`}
            >
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-slate-800">
                        <ShoppingBag className="w-6 h-6 text-orange-500 mr-2" />
                        <span className="text-lg font-bold">KubikAdmin</span>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                            ? "bg-orange-600 text-white shadow-lg shadow-orange-900/20"
                                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-800">
                        <button
                            onClick={() => {
                                logout();
                                router.push("/superadmin/login");
                            }}
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 justify-between">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-slate-600 dark:text-slate-300"
                    >
                        {isSidebarOpen ? <X /> : <Menu />}
                    </button>
                    <span className="font-bold text-slate-900 dark:text-white">KubikAdmin</span>
                    <div className="w-8" /> {/* Spacer */}
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
