"use client";

import React from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../store/useCart';
import { cn } from '@/lib/utils';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, updateQuantity, removeItem, total } = useCart();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <div className="absolute inset-0 overflow-hidden">
                {/* Background overlay */}
                <div
                    className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                    <div className="pointer-events-auto w-screen max-w-md">
                        <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                <div className="flex items-start justify-between">
                                    <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">Shopping cart</h2>
                                    <div className="ml-3 flex h-7 items-center">
                                        <button
                                            type="button"
                                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                            onClick={onClose}
                                        >
                                            <span className="sr-only">Close panel</span>
                                            <X className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <div className="flow-root">
                                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                                            {items.length === 0 && (
                                                <li className="py-6 text-center text-gray-500">Your cart is empty.</li>
                                            )}
                                            {items.map((item) => (
                                                <li key={`${item.productId}-${item.variationId || 'base'}`} className="flex py-6">
                                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                        {item.image ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img
                                                                src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${item.image}`}
                                                                alt={item.name}
                                                                className="h-full w-full object-cover object-center"
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full bg-gray-100 flex items-center justify-center text-xs">No Img</div>
                                                        )}
                                                    </div>

                                                    <div className="ml-4 flex flex-1 flex-col">
                                                        <div>
                                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                                <h3>
                                                                    <a href="#">{item.name}</a>
                                                                </h3>
                                                                <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                                            </div>
                                                            {/* <p className="mt-1 text-sm text-gray-500">{item.color}</p> */}
                                                        </div>
                                                        <div className="flex flex-1 items-end justify-between text-sm">
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variationId)}
                                                                    className="p-1 rounded-full hover:bg-gray-100"
                                                                >
                                                                    <Minus className="h-4 w-4" />
                                                                </button>
                                                                <span className="text-gray-500 font-medium">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variationId)}
                                                                    className="p-1 rounded-full hover:bg-gray-100"
                                                                >
                                                                    <Plus className="h-4 w-4" />
                                                                </button>
                                                            </div>

                                                            <div className="flex">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItem(item.productId, item.variationId)}
                                                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                    <p>Subtotal</p>
                                    <p>${total().toFixed(2)}</p>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                                <div className="mt-6">
                                    <a
                                        href="#"
                                        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            // Proceed to checkout
                                            alert('Checkout flow not implemented yet!');
                                        }}
                                    >
                                        Checkout
                                    </a>
                                </div>
                                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                    <p>
                                        or{' '}
                                        <button
                                            type="button"
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                            onClick={onClose}
                                        >
                                            Continue Shopping
                                            <span aria-hidden="true"> &rarr;</span>
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
