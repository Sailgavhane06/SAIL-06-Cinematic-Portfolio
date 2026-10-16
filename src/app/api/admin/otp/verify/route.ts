import { NextRequest, NextResponse } from "next/server";
import { verifyOtpAndUpdatePassword, AUTHORIZED_OWNER_EMAIL } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, newPassword } = body;

    const requestedEmail = (email || "").trim().toLowerCase();
    if (requestedEmail && requestedEmail !== AUTHORIZED_OWNER_EMAIL) {
      return NextResponse.json(
        { error: `Access Denied: Only ${AUTHORIZED_OWNER_EMAIL} password can be updated.` },
        { status: 403 }
      );
    }

    if (!otp || typeof otp !== "string" || !newPassword || typeof newPassword !== "string") {
      return NextResponse.json(
        { error: "Both the 6-digit OTP code and a new password are required." },
        { status: 400 }
      );
    }

    const result = await verifyOtpAndUpdatePassword(otp.trim(), newPassword);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during password update." },
      { status: 500 }
    );
  }
}
