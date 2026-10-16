import { NextRequest, NextResponse } from "next/server";
import { generateAndSendOtp, AUTHORIZED_OWNER_EMAIL } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const requestedEmail = (body.email || "").trim().toLowerCase();

    // If an email was provided in the request body, ensure it is sailgavhane06@gmail.com
    if (requestedEmail && requestedEmail !== AUTHORIZED_OWNER_EMAIL) {
      return NextResponse.json(
        {
          error: `Access Denied: Password reset OTP is only available for the registered owner email (${AUTHORIZED_OWNER_EMAIL}).`,
        },
        { status: 403 }
      );
    }

    const result = await generateAndSendOtp();

    return NextResponse.json({
      success: true,
      message: result.message,
      targetEmail: AUTHORIZED_OWNER_EMAIL,
      debugCode: result.debugCode,
    });
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json(
      { error: "Failed to generate OTP. Please try again." },
      { status: 500 }
    );
  }
}
