import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/signin');
    const isRootPage = req.nextUrl.pathname === '/';

    // Redirect authenticated users from auth pages to dashboard
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Redirect root to dashboard if authenticated, otherwise to signin
    if (isRootPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages without token
        if (req.nextUrl.pathname.startsWith('/signin') || req.nextUrl.pathname.startsWith('/sign-out')) {
          return true;
        }
        // Allow root page
        if (req.nextUrl.pathname === '/') {
          return true;
        }
        // All other pages require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/courses/:path*',
    '/assignments/:path*',
    '/calendar/:path*',
    '/messages/:path*',
    '/analytics/:path*',
    '/settings/:path*',
    '/signin/:path*',
    '/sign-out/:path*',
  ],
};
