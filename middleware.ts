import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

/**
 * Middleware to protect routes and handle authentication
 * 
 * Security flow:
 * 1. Allows public access to / (home page)
 * 2. Allows access to /dashboard only if authenticated (valid JWT cookie)
 * 3. Allows access to /<secret-path> (login page) - path from PRIVATE_ENTRY_PATH env
 * 4. Blocks all other routes and redirects to /
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secretPath = process.env.PRIVATE_ENTRY_PATH;
  const jwtSecret = process.env.JWT_SECRET;

  // Allow public access to home page
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Allow access to login page (secret path)
  if (secretPath && pathname === `/${secretPath}`) {
    return NextResponse.next();
  }

  // Allow access to dashboard only if authenticated
  if (pathname === "/dashboard") {
    const authToken = request.cookies.get("auth_token")?.value;

    if (!authToken || !jwtSecret) {
      // No token or no secret - redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      // Verify JWT token
      jwt.verify(authToken, jwtSecret);
      // Token is valid - allow access
      return NextResponse.next();
    } catch (error) {
      // Invalid token - redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Block all other routes - redirect to home
  return NextResponse.redirect(new URL("/", request.url));
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

