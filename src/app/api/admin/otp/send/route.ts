import { NextRequest, NextResponse } from "next/server";
import { generateAndSendOtp, getAuthorizedOwnerEmail, OTP_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const requestedEmail = (body.email || "").trim().toLowerCase();
    const ownerEmail = getAuthorizedOwnerEmail();

    // Always send OTP to the registered admin email
    const result = await generateAndSendOtp();

    const response = NextResponse.json({
      success: true,
      message: result.message,
      targetEmail: ownerEmail,
      otpCode: result.otpCode,
      debugCode: result.debugCode,
    });

    if (result.challengeToken) {
      const isProduction = process.env.NODE_ENV === "production";
      response.cookies.set(OTP_COOKIE_NAME, result.challengeToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 600, // 10 minutes
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json(
      { error: "Failed to generate OTP. Please try again." },
      { status: 500 }
    );
  }
}
