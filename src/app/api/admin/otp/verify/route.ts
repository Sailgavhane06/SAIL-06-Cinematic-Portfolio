import { NextRequest, NextResponse } from "next/server";
import {
  verifyOtp,
  getAuthorizedOwnerEmail,
  getAuthorizedUsername,
  createAdminSession,
  COOKIE_NAME,
  OTP_COOKIE_NAME,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { otp, challengeToken } = body;
    const ownerEmail = getAuthorizedOwnerEmail();
    const ownerUsername = getAuthorizedUsername();

    if (!otp || typeof otp !== "string" || otp.trim().length !== 6) {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }

    // Get HMAC challenge token from request body or HttpOnly cookie
    const tokenFromCookie = req.cookies.get(OTP_COOKIE_NAME)?.value;
    const tokenToVerify = challengeToken || tokenFromCookie;

    const isValid = verifyOtp(otp.trim(), tokenToVerify);

    if (!isValid) {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }

    // Correct OTP verified! Now unlock the Edit/Admin dashboard by creating the admin session
    const sessionToken = createAdminSession(ownerEmail);
    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful. Welcome, Sail!",
      user: {
        email: ownerEmail,
        username: ownerUsername,
        role: "admin",
      },
    });

    const isProduction = process.env.NODE_ENV === "production";

    // Set owner session cookie (Admin Dashboard unlocked)
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
      { error: "Unauthorized Access" },
      { status: 401 }
    );
  }
}
