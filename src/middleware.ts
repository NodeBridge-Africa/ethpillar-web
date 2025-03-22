import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/settings"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    // Get the authentication cookie - updated to use the correct cookie name
    const hasSessionCookie = request.cookies.has("ssh_session");

    // If no session, redirect to auth page
    if (!hasSessionCookie) {
      const url = new URL("/auth", request.url);

      // Add the original path as a redirect parameter
      url.searchParams.set("redirect", pathname);

      // Redirect to the auth page
      return NextResponse.redirect(url);
    }
  }

  // Handle redirects for already authenticated users who try to access auth pages
  if (pathname === "/auth") {
    const hasSessionCookie = request.cookies.has("ssh_session");

    if (hasSessionCookie) {
      // If authenticated and requesting auth page, redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public/*)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
