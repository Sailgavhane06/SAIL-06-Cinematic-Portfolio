import { NextRequest, NextResponse } from "next/server";
import {
  generateAndSendOtp,
  verifyOwnerCredentials,
  OTP_COOKIE_NAME,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { username, email, password } = body;

    // Check if valid credentials are provided or if active OTP challenge cookie exists
    const hasValidChallenge = !!req.cookies.get(OTP_COOKIE_NAME)?.value;
    const hasValidCredentials = verifyOwnerCredentials(username, email, password);

    if (!hasValidChallenge && !hasValidCredentials) {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 401 }
      );
    }

    // Trigger fresh 6-digit OTP exclusively to sailgavhane06@gmail.com
    const result = await generateAndSendOtp();

    const response = NextResponse.json({
      success: true,
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
    console.error("OTP send error:", error);
    return NextResponse.json(
      { error: "Unauthorized Access" },
      { status: 401 }
    );
  }
}
