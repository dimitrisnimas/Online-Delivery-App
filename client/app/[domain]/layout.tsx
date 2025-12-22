import React from 'react';
import Header from '../../components/Header';

export const dynamic = 'force-dynamic';

async function getStoreName(domain: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`, {
        headers: {
            'x-store-slug': domain,
            'Host': domain
        },
        cache: 'no-store'
    });
    if (!res.ok) return 'Store';
    const data = await res.json();
    return data.name;
}

export default async function Layout({
    children,
    params
}: {
    children: React.ReactNode;
    params: { domain: string };
}) {
    const storeName = await getStoreName(params.domain);

    return (
        <div className="min-h-screen flex flex-col">
            <Header storeName={storeName} />
            <main className="flex-grow">
                {children}
            </main>
            <footer className="bg-white">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="mt-8 md:mt-0 md:order-1">
                        <p className="text-center text-base text-gray-400">
                            &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
