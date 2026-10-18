import { NextRequest, NextResponse } from "next/server";
import { getPublicSiteData } from "@/lib/storage";

export async function GET(request: NextRequest) {
  try {
    const publicContent = await getPublicSiteData();
    return NextResponse.json(
      {
        success: true,
        data: publicContent,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error) {
    console.error("Public content retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve public portfolio content" },
      { status: 500 }
    );
  }
}
