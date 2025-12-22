import React from 'react';
import { headers } from 'next/headers';

// Admin layout could have a sidebar, different header, etc.
// For now, simple wrapper.

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
            {/* We can add a top bar here if authenticated */}
            {children}
        </div>
    );
}
