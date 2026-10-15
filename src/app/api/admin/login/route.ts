import { NextRequest, NextResponse } from "next/server";
import { verifyOwnerCredentials, createAdminSession, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const isValid = verifyOwnerCredentials(email, password);
    if (!isValid) {
      // Return 401 with generic message to prevent account enumeration
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const sessionToken = createAdminSession(email);
    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: {
        email: email.trim().toLowerCase(),
        role: "owner",
      },
    });

    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during authentication" },
      { status: 500 }
    );
  }
}
