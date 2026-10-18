import { NextRequest, NextResponse } from "next/server";
import { verifyOwnerCredentials, createAdminSession, COOKIE_NAME, getAuthorizedOwnerEmail } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, username, password } = body;
    const identifier = (username || email || getAuthorizedOwnerEmail()).trim();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const isValid = verifyOwnerCredentials(identifier, password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials. Please enter the correct admin password." },
        { status: 401 }
      );
    }

    const ownerEmail = getAuthorizedOwnerEmail();
    const sessionToken = createAdminSession(ownerEmail);
    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful",
      user: {
        email: ownerEmail,
        username: "Sail Gavhane",
        role: "admin",
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
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during authentication" },
      { status: 500 }
    );
  }
}
