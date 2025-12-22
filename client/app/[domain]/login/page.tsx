"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../store/useAuth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const login = useAuth((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // Need store context. Since we are on client, we should theoretically know the store.
            // But the API handles resolution via Headers.
            // We rely on the Middleware/Browser sending the Host header or we need to pass strict header.
            // If we are on `store1.com`, the browser sends Host: store1.com.
            // The API resolves it. 
            // If we are on `localhost:3000/[domain]/login`, the Host is localhost:3000.
            // We MUST pass the domain down to the client component to send as header if we aren't using subdomains locally.

            // Issue: `useRouter` or `useParams` can give us domain.
            // But `fetch` from client needs to send it manually if we are using path-based routing in dev.
            // In prod (subdomains), Host header is automatic.

            // Let's assume we extract domain from URL or props.
            // Client component doesn't have `params` prop automatically unless passed from Page.
            // We are in `app/[domain]/login/page.tsx`.

            // Wait, this file is the Page component. It gets params!
            // But I marked "use client" so I can't use async params in same file easily in Next 15, but Next 14 is fine.
            // Actually `params` is a promise in recent Next.js versions.
            // Let's wrapping the form in a client component or use `useParams`.

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'x-store-slug': params.domain // We need this!
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                login(data);
                router.push('../'); // Back to home
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                        Create an account
                    </a>
                </div>
            </div>
        </div>
    );
}
