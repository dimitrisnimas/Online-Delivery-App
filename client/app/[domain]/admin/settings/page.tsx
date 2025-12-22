"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../store/useAuth';

export default function AdminSettingsPage() {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!user) return;
        // Fetch current settings
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`, {
            headers: {
                // In admin, we might need a specific header if domain doesn't match?
                // But we are using jwt, we can rely on user scope?
                // Actually backend `getStoreInfo` relies on `req.store`.
                // `req.store` relies on `resolveTenant` (hostname).
                // We should ensure we are on the correct hostname or pass header.
                // For now, assume we are on the store domain.
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.name) setName(data.name);
            })
            .catch(err => console.error(err));
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ name })
            });
            if (res.ok) {
                setMessage('Settings updated!');
            } else {
                setMessage('Failed to update settings.');
            }
        } catch (error) {
            setMessage('Error updating settings.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-6">Store Settings</h1>
                {message && <p className={`mb-4 ${message.includes('updated') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Store Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" />
                    </div>
                    {/* Add more settings here */}

                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
