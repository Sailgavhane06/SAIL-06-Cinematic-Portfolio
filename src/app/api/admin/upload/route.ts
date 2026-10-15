import { NextRequest, NextResponse } from "next/server";
import { verifyAdminApiRequest } from "@/lib/auth";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp", "avif", "gif"]);

export async function POST(req: NextRequest) {
  const session = verifyAdminApiRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = (formData.get("file") || formData.get("image")) as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image file exceeds maximum permitted size of 5MB" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate image format with sharp
    let metadata: { format?: string; width?: number; height?: number };
    try {
      metadata = await sharp(buffer).metadata();
    } catch {
      return NextResponse.json(
        { error: "Invalid or corrupt image file. Only genuine image buffers are accepted." },
        { status: 400 }
      );
    }

    if (!metadata.format || !ALLOWED_FORMATS.has(metadata.format)) {
      return NextResponse.json(
        {
          error: `Unsupported image format (${metadata.format || "unknown"}). Allowed formats: JPEG, PNG, WebP, AVIF, GIF`,
        },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    // Determine extension
    let ext = metadata.format === "jpeg" ? "jpg" : metadata.format;
    const uniqueFileName = `${crypto.randomUUID()}.${ext}`;
    const destinationPath = path.join(UPLOADS_DIR, uniqueFileName);

    await fs.promises.writeFile(destinationPath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      url: publicUrl,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during image processing and upload" },
      { status: 500 }
    );
  }
}
