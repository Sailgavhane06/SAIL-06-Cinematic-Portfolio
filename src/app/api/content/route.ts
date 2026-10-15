import { NextResponse } from "next/server";
import { getPublicSiteData } from "@/lib/storage";
export async function GET() {
  try {
    const publicContent = await getPublicSiteData();
    return NextResponse.json(
      {
        success: true,
        data: publicContent,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
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
