import { NextResponse } from "next/server";

export async function POST() {
  // Block any non-credential login or external sign-in attempts
  return NextResponse.json(
    { error: "Unauthorized Access" },
    { status: 401 }
  );
}
