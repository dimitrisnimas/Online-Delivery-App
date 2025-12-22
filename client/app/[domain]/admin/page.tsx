import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../store/useAuth';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const login = useAuth((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // Admin login might need to target a specific store or be global?
            // Requirement: "Admin (Store Owner)... Full access to store dashboard".
            // So Admin logs in TO a store.
            // Usually admins go to: store.com/admin or app.com/admin?
            // If our app structure is `[domain]`, then `store.com/admin` maps to `app/[domain]/admin`?
            // Wait, my folder structure is `app/admin`. This is a GLOBAL admin or what?
            // If I want store-specific admin, I should put it in `app/[domain]/admin`.
            // The User Request says "Login to store dashboard".
            // So it should be `app/[domain]/admin/...`.

            // I submitted `client/app/admin/layout.tsx` which implies `/admin`.
            // Next.js routing: `/admin` is root.
            // If I want it under domain, it should be `app/[domain]/admin`.

            // Decision: Move to `app/[domain]/admin`.

            // Let's assume for now I made a mistake in path and correct it effectively by writing to the right path.

            // For the API call:
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // Host header handled by browser: store.com/admin -> Host: store.com
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.role !== 'ADMIN' && data.role !== 'STAFF') {
                    setError('Access denied. Not an admin/staff.');
                    return;
                }
                login(data);
                router.push('dashboard'); // Relative to /[domain]/admin -> /[domain]/admin/dashboard
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">Store Admin</h2>
                    <p className="mt-2 text-gray-600">Sign in to manage your store</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
