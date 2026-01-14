import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    const privateAccessCode = process.env.PRIVATE_ACCESS_CODE;
    const jwtSecret = process.env.JWT_SECRET;

    // Validate environment variables
    if (!privateAccessCode || !jwtSecret) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Verify password
    if (password !== privateAccessCode) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Create JWT token (expires in 7 days)
    const token = jwt.sign(
      { authenticated: true, timestamp: Date.now() },
      jwtSecret,
      { expiresIn: "7d" }
    );

    // Create response with redirect
    const response = NextResponse.json(
      { success: true, redirect: "/dashboard" },
      { status: 200 }
    );

    // Set httpOnly cookie with secure flags
    response.cookies.set("auth_token", token, {
      httpOnly: true, // Prevents JavaScript access (XSS protection)
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // CSRF protection
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/", // Available site-wide
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

