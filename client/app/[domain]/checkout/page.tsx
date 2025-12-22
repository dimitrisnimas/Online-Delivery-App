"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../store/useAuth';
import { useCart } from '../../../store/useCart';

export default function CheckoutPage() {
    const { user } = useAuth();
    const { items, total, clearCart } = useCart();
    const router = useRouter();

    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Basic protection
        if (!user) {
            // router.push('login'); // Redirect to login relative path
            // For simplicity, just show message or redirect
        }
    }, [user, router]);

    const handlePlaceOrder = async () => {
        if (!user) {
            router.push('login');
            return;
        }
        if (!address) {
            alert('Please enter an address');
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                items: items.map(i => ({
                    productId: i.productId,
                    quantity: i.quantity,
                    variationId: i.variationId
                })),
                type: 'DELIVERY',
                // Backend schema update pending for deliveryAddress?
                // If backend doesn't support it yet, it will ignore or error if strict.
                // We hope db push succeeds.
                // But I should pass it anyway.
                deliveryAddress: address
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                    // 'x-store-slug': ... // Handled by middleware/host usually
                },
                body: JSON.stringify(orderData)
            });

            if (res.ok) {
                const data = await res.json();
                clearCart();
                alert('Order placed! ID: ' + data.id);
                router.push('../'); // Back to home or dashboard
            } else {
                const err = await res.json();
                alert('Order failed: ' + err.message);
            }
        } catch (error) {
            alert('Error placing order');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Your cart is empty.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Order Summary</h3>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {items.map(item => (
                            <li key={item.productId} className="px-4 py-4 flex justify-between">
                                <div>
                                    <span className="font-medium">{item.name}</span>
                                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                                </div>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                        <li className="px-4 py-4 flex justify-between font-bold bg-gray-50">
                            <span>Total</span>
                            <span>${total().toFixed(2)}</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white shadow sm:rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Details</h3>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                        <textarea
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            rows={3}
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="Street, City, Postcode..."
                        />
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>
                </div>
            </div>
        </div>
    );
}
