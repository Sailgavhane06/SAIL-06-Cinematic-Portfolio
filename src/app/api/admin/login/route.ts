import { NextRequest, NextResponse } from "next/server";
import { verifyOwnerCredentials, createAdminSession, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, username, password } = body;
    const identifier = (username || email || "").trim();

    if (!identifier || !password || typeof identifier !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const isValid = verifyOwnerCredentials(identifier, password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials. Only the authorized owner account can access admin editing." },
        { status: 401 }
      );
    }

    const sessionToken = createAdminSession(identifier);
    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: {
        email: identifier.toLowerCase(),
        username: "Sail Gavhane",
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
