import { NextRequest, NextResponse } from "next/server";
import { verifyGoogleLogin, createAdminSession, COOKIE_NAME, AUTHORIZED_OWNER_EMAIL } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, credential } = body;

    const result = await verifyGoogleLogin(email, credential);

    if (!result.success || !result.email) {
      return NextResponse.json(
        { error: result.error || `Access Denied: Only ${AUTHORIZED_OWNER_EMAIL} is authorized.` },
        { status: 403 }
      );
    }

    const sessionToken = createAdminSession(result.email);
    const response = NextResponse.json({
      success: true,
      message: "Google Sign-In successful. Welcome, Sail!",
      user: {
        email: result.email,
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
    console.error("Google login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during Google Sign-In" },
      { status: 500 }
    );
  }
}
