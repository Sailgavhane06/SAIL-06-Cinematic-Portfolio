import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const COOKIE_NAME = "sail06_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Default secret for development, but in production ADMIN_SESSION_SECRET must be set
function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_SESSION_SECRET environment variable is required in production.");
    }
    return "dev_sail06_session_secret_local_only";
  }
  return secret;
}

export interface AdminSession {
  email: string;
  role: "owner";
  iat: number;
  exp: number;
}

/**
 * Sign payload using HMAC-SHA256
 */
export function signToken(payload: AdminSession): string {
  const secret = getSessionSecret();
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${signature}`;
}

/**
 * Verify and decode an HMAC-SHA256 signed token
 */
export function verifyToken(token: string): AdminSession | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [data, signature] = parts;
    const secret = getSessionSecret();

    const expectedSignature = crypto.createHmac("sha256", secret).update(data).digest("base64url");

    // Timing-safe comparison to prevent timing attacks
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (sigBuffer.length !== expectedBuffer.length) return null;
    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

    const json = Buffer.from(data, "base64url").toString("utf-8");
    const payload = JSON.parse(json) as AdminSession;

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return null;
    }

    if (payload.role !== "owner") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Verify owner credentials securely with timing-safe comparison
 */
export function verifyOwnerCredentials(identifier: string, pass: string): boolean {
  const inputId = (identifier || "").trim().toLowerCase();
  const inputPass = pass || "";

  // Credentials are read only on the server at request time.
  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD;

  return Boolean(
    envEmail &&
    envPassword &&
    timingSafeStringCompare(inputId, envEmail) &&
    timingSafeStringCompare(inputPass, envPassword)
  );
}

function timingSafeStringCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Perform dummy comparison to prevent length timing leakage
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Create admin session and return signed token
 */
export function createAdminSession(email: string): string {
  const now = Math.floor(Date.now() / 1000);
  const session: AdminSession = {
    email: email.trim().toLowerCase(),
    role: "owner",
    iat: now,
    exp: now + SESSION_DURATION_SECONDS,
  };
  return signToken(session);
}

/**
 * Server-side helper to read and verify admin session from cookies
 */
export async function getServerAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie || !cookie.value) return null;
  return verifyToken(cookie.value);
}

/**
 * Validate request authorization in API routes
 */
export function verifyAdminApiRequest(req: NextRequest): AdminSession | null {
  const cookie = req.cookies.get(COOKIE_NAME);
  if (cookie && cookie.value) {
    const session = verifyToken(cookie.value);
    if (session) return session;
  }

  // Also support Authorization: Bearer <token>
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    return verifyToken(token);
  }

  return null;
}
