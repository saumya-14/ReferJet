import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Middleware to protect routes and handle authentication
 * 
 * Security flow:
 * 1. Allows public access to / (home page)
 * 2. Allows access to /dashboard only if authenticated (valid JWT cookie)
 * 3. Allows access to /<secret-path> (login page) - path from PRIVATE_ENTRY_PATH env
 * 4. Blocks all other routes and redirects to /
 * 
 * Note: Middleware runs in Edge Runtime by default in Next.js
 */
export async function middleware(request: NextRequest) {
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

    if (!authToken) {
      // No token - redirect to home
      console.log("❌ No auth token found in cookies");
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (!jwtSecret || jwtSecret.trim() === "") {
      // No secret - this is a server configuration error
      console.error("❌ JWT_SECRET is missing or empty in middleware");
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      // Verify JWT token using jose (Edge runtime compatible)
      const secret = new TextEncoder().encode(jwtSecret.trim());
      await jwtVerify(authToken, secret, {
        algorithms: ["HS256"],
      });
      // Token is valid - allow access
      return NextResponse.next();
    } catch (error) {
      // Invalid token - redirect to home
      console.log("❌ JWT verification failed:", error instanceof Error ? error.message : "Unknown error");
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

