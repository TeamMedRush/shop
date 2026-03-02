import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode("medrush-super-secret-key-12345");

export async function middleware(request: NextRequest) {
    // Only protect the /app/ or /dashboard/ routes
    const protectedRoutes = ['/dashboard', '/cart', '/profile', '/checkout', '/orders']
    const isProtected = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    // If going to auth page while logged in, redirect to home
    const isAuthPage = request.nextUrl.pathname.startsWith('/auth')

    const token = request.cookies.get('access_token')?.value

    if (isProtected) {
        if (!token) {
            return NextResponse.redirect(new URL('/auth', request.url))
        }

        try {
            // Very basic validation - the true validation happens on the backend API requests
            await jwtVerify(token, SECRET_KEY)
            return NextResponse.next()
        } catch (e) {
            // Token expired or invalid, redirect to login
            return NextResponse.redirect(new URL('/auth', request.url))
        }
    }

    if (isAuthPage && token) {
        try {
            await jwtVerify(token, SECRET_KEY)
            return NextResponse.redirect(new URL('/', request.url))
        } catch (e) {
            // Ignored, proceed to auth
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
