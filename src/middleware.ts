import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // Skip auth check for login page and API routes
    const isLoginPage = request.nextUrl.pathname === '/login';
    const isApiRoute = request.nextUrl.pathname.startsWith('/api');

    if (isLoginPage || isApiRoute) {
        return NextResponse.next();
    }

    // Allow tests to run without Supabase credentials
    if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
        return NextResponse.next();
    }

    // Check if user is authenticated
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll() {
                    // We don't need to set cookies in middleware for read operations
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // If user is not authenticated and trying to access dashboard, redirect to login
    if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
        const redirectUrl = new URL('/login', request.url);
        return NextResponse.redirect(redirectUrl);
    }

    // If user is authenticated and on login page, redirect to dashboard
    if (user && isLoginPage) {
        const redirectUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
