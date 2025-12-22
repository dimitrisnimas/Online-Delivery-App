"use client";

import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../store/useCart';
import CartDrawer from './CartDrawer';
// import Link from 'next/link';

export default function Header({ storeName }: { storeName: string }) {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const items = useCart((state) => state.items);
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className="bg-white shadow sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
                <div className="w-full py-4 flex items-center justify-between border-b border-indigo-500 lg:border-none">
                    <div className="flex items-center">
                        <a href="#" className="text-xl font-bold text-indigo-600">
                            {storeName}
                        </a>
                        <div className="hidden ml-10 space-x-8 lg:block">
                            <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900">
                                Menu
                            </a>
                            <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900">
                                About
                            </a>
                        </div>
                    </div>
                    <div className="ml-10 space-x-4 flex items-center">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="group -m-2 p-2 flex items-center text-gray-400 hover:text-gray-500 relative"
                        >
                            <ShoppingBag className="flex-shrink-0 h-6 w-6" aria-hidden="true" />
                            <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                                {itemCount}
                            </span>
                            <span className="sr-only">items in cart, view bag</span>
                        </button>
                        {/* Auth links could go here */}
                    </div>
                </div>
            </nav>
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </header>
    );
}
