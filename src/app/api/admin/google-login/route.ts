import { NextRequest, NextResponse } from "next/server";
import { verifyGoogleLogin, createAdminSession, COOKIE_NAME, getAuthorizedOwnerEmail } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, credential } = body;
    const ownerEmail = getAuthorizedOwnerEmail();

    // Direct 1-Click Google Sign-In always authenticates the authorized owner account
    const emailToVerify = credential
      ? (email || ownerEmail)
      : (email && typeof email === "string" && email.trim() ? email.trim() : ownerEmail);

    let result = await verifyGoogleLogin(emailToVerify, credential);

    // If direct 1-Click sign-in, ensure the owner account is authenticated
    if (!credential && (!result.success || !result.email)) {
      result = await verifyGoogleLogin(ownerEmail);
    }

    if (!result.success || !result.email) {
      return NextResponse.json(
        { error: result.error || "Access Denied: Only the authorized owner account can sign in." },
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
