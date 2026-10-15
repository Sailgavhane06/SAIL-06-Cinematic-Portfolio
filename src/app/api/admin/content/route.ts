import { NextRequest, NextResponse } from "next/server";
import { verifyAdminApiRequest } from "@/lib/auth";
import { getAdminSiteData, saveAdminSection, saveFullAdminContent } from "@/lib/storage";
import { SiteContent } from "@/lib/types";

// Helper to validate and sanitize URLs
function isSafeUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("vbscript:")
  ) {
    return false;
  }
  return true;
}

export async function GET(req: NextRequest) {
  const session = verifyAdminApiRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const data = await getAdminSiteData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching admin content:", error);
    return NextResponse.json(
      { error: "Failed to load content from storage" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = verifyAdminApiRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Support updating a specific section or the complete content object
    if (body.section && body.data) {
      const sectionName = body.section as keyof SiteContent;
      const validSections: (keyof SiteContent)[] = [
        "hero",
        "about",
        "engineering",
        "founder",
        "projects",
        "blog",
        "travel",
        "contact",
      ];

      if (!validSections.includes(sectionName)) {
        return NextResponse.json(
          { error: `Invalid section name: ${String(body.section)}` },
          { status: 400 }
        );
      }

      // Security validation for contact social links URLs
      if (sectionName === "contact" && body.data.socialLinks) {
        for (const [platform, config] of Object.entries(body.data.socialLinks)) {
          const cfg = config as { url?: string };
          if (cfg?.url && !isSafeUrl(cfg.url)) {
            return NextResponse.json(
              { error: `Unsafe URL scheme detected for platform: ${platform}` },
              { status: 400 }
            );
          }
        }
      }

      const updated = await saveAdminSection(sectionName, body.data);
      return NextResponse.json({
        success: true,
        message: `Section ${String(sectionName)} updated successfully`,
        data: updated,
      });
    }

    if (body.content) {
      const updated = await saveFullAdminContent(body.content);
      return NextResponse.json({
        success: true,
        message: "Full portfolio content updated successfully",
        data: updated,
      });
    }

    return NextResponse.json(
      { error: "Payload must contain either 'section' and 'data', or 'content'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json(
      { error: "Failed to persist content update" },
      { status: 500 }
    );
  }
}
