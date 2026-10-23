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

    let publicUrl = "";
    let savedToDisk = false;

    // 1. Try saving to public/uploads directory (local dev and writable servers)
    try {
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }
      const ext = metadata.format === "jpeg" ? "jpg" : metadata.format;
      const uniqueFileName = `${crypto.randomUUID()}.${ext}`;
      const destinationPath = path.join(UPLOADS_DIR, uniqueFileName);
      await fs.promises.writeFile(destinationPath, buffer);
      publicUrl = `/uploads/${uniqueFileName}`;
      savedToDisk = true;
    } catch (diskErr) {
      console.warn("Notice: Local uploads folder not writable, utilizing resilient serverless image pipeline:", diskErr);
    }

    // 2. Serverless fallback: Convert to an optimized WebP base64 Data URI
    if (!savedToDisk) {
      const optimizedBuffer = await sharp(buffer)
        .resize({ width: 1400, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
      publicUrl = `data:image/webp;base64,${optimizedBuffer.toString("base64")}`;
    }

    return NextResponse.json({
      success: true,
      message: "Image processed and uploaded successfully",
      url: publicUrl,
      width: metadata.width,
      height: metadata.height,
      format: savedToDisk ? metadata.format : "webp",
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
