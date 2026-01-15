import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    const privateAccessCode = process.env.PRIVATE_ACCESS_CODE;
    const jwtSecret = process.env.JWT_SECRET;

    // Validate environment variables (check for undefined, null, or empty string)
    if (!privateAccessCode || privateAccessCode.trim() === "") {
      console.error("❌ PRIVATE_ACCESS_CODE is missing or empty");
      console.error("💡 Make sure you have a .env.local file with PRIVATE_ACCESS_CODE");
      return NextResponse.json(
        { error: "Server configuration error: PRIVATE_ACCESS_CODE not set. Check server logs." },
        { status: 500 }
      );
    }

    if (!jwtSecret || jwtSecret.trim() === "") {
      console.error("❌ JWT_SECRET is missing or empty");
      console.error("💡 Make sure you have a .env.local file with JWT_SECRET");
      return NextResponse.json(
        { error: "Server configuration error: JWT_SECRET not set. Check server logs." },
        { status: 500 }
      );
    }

    // Trim whitespace from password input and JWT secret
    const trimmedPassword = password?.trim();
    const trimmedAccessCode = privateAccessCode.trim();
    const trimmedJwtSecret = jwtSecret.trim();

    // Verify password (case-sensitive comparison)
    if (trimmedPassword !== trimmedAccessCode) {
      console.log("❌ Password mismatch:", {
        receivedLength: trimmedPassword?.length,
        expectedLength: trimmedAccessCode.length,
        receivedFirstChar: trimmedPassword ? trimmedPassword[0] : "undefined",
        expectedFirstChar: trimmedAccessCode[0],
        receivedLastChar: trimmedPassword ? trimmedPassword[trimmedPassword.length - 1] : "undefined",
        expectedLastChar: trimmedAccessCode[trimmedAccessCode.length - 1],
      });
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    console.log("✅ Password verified successfully");

    // Create JWT token (expires in 7 days) using jose
    let token: string;
    try {
      const secret = new TextEncoder().encode(trimmedJwtSecret);
      const jwt = new SignJWT({ authenticated: true, timestamp: Date.now() })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d");
      
      token = await jwt.sign(secret);
      console.log("✅ JWT token created successfully");
    } catch (jwtError) {
      console.error("❌ JWT token creation failed:", jwtError);
      return NextResponse.json(
        { error: "Failed to create authentication token. Check server logs." },
        { status: 500 }
      );
    }

    // Create response with redirect
    const response = NextResponse.json(
      { success: true, redirect: "/dashboard" },
      { status: 200 }
    );

    // Set httpOnly cookie with secure flags
    try {
      response.cookies.set("auth_token", token, {
        httpOnly: true, // Prevents JavaScript access (XSS protection)
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "strict", // CSRF protection
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/", // Available site-wide
      });
      console.log("✅ Auth cookie set successfully");
    } catch (cookieError) {
      console.error("❌ Cookie setting failed:", cookieError);
      return NextResponse.json(
        { error: "Failed to set authentication cookie. Check server logs." },
        { status: 500 }
      );
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

