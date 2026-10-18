import { NextRequest, NextResponse } from "next/server";
import {
  verifyOtpAndUpdatePassword,
  getAuthorizedOwnerEmail,
  createAdminSession,
  COOKIE_NAME,
  OTP_COOKIE_NAME,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, otp, newPassword, challengeToken } = body;
    const ownerEmail = getAuthorizedOwnerEmail();

    if (!otp || typeof otp !== "string" || !newPassword || typeof newPassword !== "string") {
      return NextResponse.json(
        { error: "Both the 6-digit OTP code and a new password are required." },
        { status: 400 }
      );
    }

    // Get HMAC challenge token from cookie or request body
    const tokenFromCookie = req.cookies.get(OTP_COOKIE_NAME)?.value;
    const tokenToVerify = challengeToken || tokenFromCookie;

    const result = await verifyOtpAndUpdatePassword(otp.trim(), newPassword, tokenToVerify);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    // Automatically create admin session for owner so they are immediately authenticated
    const sessionToken = createAdminSession(ownerEmail);
    const response = NextResponse.json({
      success: true,
      message: result.message,
      user: {
        email: ownerEmail,
        username: "Sail Gavhane",
        role: "admin",
      },
    });

    const isProduction = process.env.NODE_ENV === "production";

    // Set owner session cookie
    response.cookies.set(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Clear OTP challenge cookie
    response.cookies.delete(OTP_COOKIE_NAME);

    return response;
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during password update." },
      { status: 500 }
    );
  }
}
