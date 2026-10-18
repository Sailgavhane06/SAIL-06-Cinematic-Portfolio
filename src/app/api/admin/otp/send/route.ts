import { NextRequest, NextResponse } from "next/server";
import { generateAndSendOtp, getAuthorizedOwnerEmail } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const requestedEmail = (body.email || "").trim().toLowerCase();
    const ownerEmail = getAuthorizedOwnerEmail();

    // If an email was provided in the request body, ensure it is the authorized owner email
    if (requestedEmail && requestedEmail !== ownerEmail) {
      return NextResponse.json(
        {
          error: "Access Denied: Password reset OTP is only available for the registered owner email.",
        },
        { status: 403 }
      );
    }

    const result = await generateAndSendOtp();

    return NextResponse.json({
      success: true,
      message: result.message,
      targetEmail: ownerEmail,
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
