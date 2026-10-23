import { NextRequest, NextResponse } from "next/server";
import { getAdminSiteData, getPublicSiteData, saveAdminSection } from "@/lib/storage";
import { TravelFollower } from "@/lib/types";

// Public endpoint to retrieve follower count and list of follower names (emails are NEVER included)
export async function GET() {
  try {
    const publicData = await getPublicSiteData();
    const followers = publicData.travel?.followers || [];

    return NextResponse.json(
      {
        success: true,
        count: followers.length,
        followers: followers.map((f) => ({
          id: f.id,
          name: f.name,
          createdAt: f.createdAt,
        })),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Error retrieving followers:", error);
    return NextResponse.json(
      { error: "Failed to load expedition followers" },
      { status: 500 }
    );
  }
}

// Public endpoint to join expedition followers with Name + Email
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawName = typeof body.name === "string" ? body.name.trim() : "";
    const rawEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    // Validate Name
    if (!rawName || rawName.length < 2 || rawName.length > 80) {
      return NextResponse.json(
        { error: "Please enter your valid full name (2 to 80 characters)." },
        { status: 400 }
      );
    }

    // Sanitize Name (strip HTML tags)
    const cleanName = rawName.replace(/[<>]/g, "");

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!rawEmail || !emailRegex.test(rawEmail) || rawEmail.length > 120) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const adminData = await getAdminSiteData();
    const currentTravel = adminData.travel;
    const currentFollowers: TravelFollower[] = Array.isArray(currentTravel?.followers)
      ? [...currentTravel.followers]
      : [];

    const existingIndex = currentFollowers.findIndex(
      (f) => f.email.toLowerCase() === rawEmail
    );

    if (existingIndex >= 0) {
      // Update name if changed
      currentFollowers[existingIndex].name = cleanName;
      await saveAdminSection("travel", {
        ...currentTravel,
        followers: currentFollowers,
      });

      return NextResponse.json({
        success: true,
        alreadyFollowed: true,
        message: `Welcome back, ${cleanName}! Your expedition subscription is active.`,
        follower: {
          id: currentFollowers[existingIndex].id,
          name: cleanName,
        },
        count: currentFollowers.length,
      });
    }

    const newFollower: TravelFollower = {
      id: `follower-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: cleanName,
      email: rawEmail,
      createdAt: new Date().toISOString(),
    };

    const updatedFollowers = [newFollower, ...currentFollowers];
    const updatedTravel = {
      ...currentTravel,
      followers: updatedFollowers,
    };

    await saveAdminSection("travel", updatedTravel);

    return NextResponse.json({
      success: true,
      message: `Thank you for following, ${cleanName}! You will receive exclusive expedition field notes.`,
      follower: {
        id: newFollower.id,
        name: cleanName,
      },
      count: updatedFollowers.length,
    });
  } catch (error) {
    console.error("Error subscribing follower:", error);
    return NextResponse.json(
      { error: "Failed to record follow subscription. Please try again." },
      { status: 500 }
    );
  }
}
