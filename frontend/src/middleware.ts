import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow login pages (they are public)
  if (path === '/admin/login' || path === '/partner/login') {
    return NextResponse.next();
  }

  // Admin Routes Protection
  if (path.startsWith('/admin')) {
    const token =
      request.cookies.get('authToken')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      // Redirect zu Homepage (Security through Obscurity)
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      // Basic JWT decode ohne Verifikation für Middleware
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      const payload = JSON.parse(atob(tokenParts[1]));

      // Check if user is admin and has admin userType
      if (
        !payload ||
        payload.role !== 'admin' ||
        payload.userType !== 'admin'
      ) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Check token expiration
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // Token decode failed - redirect to homepage
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Partner Routes Protection
  if (path.startsWith('/partner')) {
    const token =
      request.cookies.get('authToken')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      // Redirect zu Homepage
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      // Basic JWT decode ohne Verifikation für Middleware
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      const payload = JSON.parse(atob(tokenParts[1]));

      // Check if user is partner and has partner userType
      if (
        !payload ||
        payload.role !== 'partner' ||
        payload.userType !== 'partner'
      ) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Check token expiration
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // Token decode failed - redirect to homepage
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/partner/:path*'],
};
