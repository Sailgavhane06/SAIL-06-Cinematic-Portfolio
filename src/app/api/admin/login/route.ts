import { NextRequest, NextResponse } from "next/server";
import {
  verifyOwnerCredentials,
  generateAndSendOtp,
  OTP_COOKIE_NAME,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { username, email, password } = body;

    // Strict validation: must match exact Username, Authorized Email, and Password
    const isValid = verifyOwnerCredentials(username, email, password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }

    // Two-Step Verification: Trigger 6-digit OTP sent exclusively to sailgavhane06@gmail.com
    const result = await generateAndSendOtp();

    const response = NextResponse.json({
      success: true,
      requireOtp: true,
      message: result.message,
      challengeToken: result.challengeToken,
    });

    const isProduction = process.env.NODE_ENV === "production";
    response.cookies.set(OTP_COOKIE_NAME, result.challengeToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Unauthorized Access" },
      { status: 401 }
    );
  }
}
