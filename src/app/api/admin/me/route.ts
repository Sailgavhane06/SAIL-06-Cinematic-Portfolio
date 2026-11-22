import { NextRequest, NextResponse } from "next/server";
import { verifyAdminApiRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = verifyAdminApiRequest(req);
  if (!session) {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 200 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email: session.email,
      role: session.role,
      exp: session.exp,
    },
  });
}
