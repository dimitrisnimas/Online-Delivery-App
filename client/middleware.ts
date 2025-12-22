import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. /favicon.ico)
         */
        '/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)',
    ],
};

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const hostname = req.headers.get('host') || '';

    // Extract the subdomain/slug from the hostname
    let currentHost = hostname;

    // Remove port for localhost
    if (currentHost.includes(':')) {
        currentHost = currentHost.split(':')[0];
    }

    // Remove .netlify.app or .vercel.app
    currentHost = currentHost
        .replace('.netlify.app', '')
        .replace('.vercel.app', '')
        .replace('.localhost', '');

    // If accessing the main domain directly (no subdomain), use 'demo' as default
    if (currentHost === 'localhost' || currentHost.includes('netlify.app') || currentHost.includes('vercel.app')) {
        currentHost = 'demo';
    }

    const searchParams = req.nextUrl.searchParams.toString();
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

    // Rewrite to /[domain]/path
    return NextResponse.rewrite(new URL(`/${currentHost}${path}`, req.url));
}
