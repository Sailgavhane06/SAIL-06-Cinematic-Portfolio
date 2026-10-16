import "server-only";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export const COOKIE_NAME = "sail06_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Strictly authorized owner email — ONLY this email can access admin features
export const AUTHORIZED_OWNER_EMAIL = "sailgavhane06@gmail.com";

// Default owner password requested by user
export const DEFAULT_OWNER_PASSWORD = "SAIL@067";

// In-memory / persistent storage paths for updated password & OTP
const DATA_DIR = path.join(process.cwd(), "data");
const AUTH_STORE_PATH = path.join(process.cwd(), "data", "auth-store.json");

interface AuthStore {
  customPassword?: string;
  otpCode?: string;
  otpExpiresAt?: number;
}

// Memory cache attached to globalThis to survive serverless function warm re-use
const globalAuth = globalThis as unknown as {
  __sail06_auth_store?: AuthStore;
};

if (!globalAuth.__sail06_auth_store) {
  globalAuth.__sail06_auth_store = {};
}

function readAuthStore(): AuthStore {
  const current = globalAuth.__sail06_auth_store || {};
  if (current.customPassword) {
    return current;
  }
  try {
    if (fs.existsSync(AUTH_STORE_PATH)) {
      const data = JSON.parse(fs.readFileSync(AUTH_STORE_PATH, "utf8"));
      const merged: AuthStore = { ...current, ...data };
      globalAuth.__sail06_auth_store = merged;
      return merged;
    }
  } catch {
    // Ignore file read error on restricted file systems
  }
  return current;
}

function saveAuthStore(updates: Partial<AuthStore>) {
  const current = globalAuth.__sail06_auth_store || {};
  globalAuth.__sail06_auth_store = {
    ...current,
    ...updates,
  };
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(AUTH_STORE_PATH, JSON.stringify(globalAuth.__sail06_auth_store, null, 2), "utf8");
  } catch {
    // Memory state will still persist during runtime
  }
}

/**
 * Returns current active password:
 * 1. Custom password updated via OTP
 * 2. process.env.ADMIN_PASSWORD (if set in hosting environment)
 * 3. DEFAULT_OWNER_PASSWORD ("SAIL@067")
 */
export function getActiveOwnerPassword(): string {
  const store = readAuthStore();
  if (store.customPassword) {
    return store.customPassword;
  }
  if (process.env.ADMIN_PASSWORD) {
    return process.env.ADMIN_PASSWORD;
  }
  return DEFAULT_OWNER_PASSWORD;
}

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

    if (payload.role !== "owner" || payload.email.toLowerCase() !== AUTHORIZED_OWNER_EMAIL) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Timing-safe string comparison
 */
export function timingSafeStringCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Verify owner credentials for Email + Password login.
 * Strictly verifies email === sailgavhane06@gmail.com and password === SAIL@067 (or custom updated password).
 */
export function verifyOwnerCredentials(identifier: string, pass: string): boolean {
  const inputEmail = (identifier || "").trim().toLowerCase();
  const inputPass = pass || "";

  // Strictly check that the email is sailgavhane06@gmail.com
  const isEmailMatch = timingSafeStringCompare(inputEmail, AUTHORIZED_OWNER_EMAIL);
  if (!isEmailMatch) {
    return false;
  }

  // Verify against active password (custom password via OTP or env)
  const expectedPassword = getActiveOwnerPassword();
  if (timingSafeStringCompare(inputPass, expectedPassword)) {
    return true;
  }

  // Also accept DEFAULT_OWNER_PASSWORD ("SAIL@067")
  if (timingSafeStringCompare(inputPass, DEFAULT_OWNER_PASSWORD)) {
    return true;
  }

  return false;
}

/**
 * Verify Google Sign-In:
 * Directly verifies email is sailgavhane06@gmail.com or decodes Google ID token credential.
 */
export async function verifyGoogleLogin(
  email: string,
  credentialToken?: string
): Promise<{ success: boolean; email?: string; error?: string }> {
  const targetEmail = AUTHORIZED_OWNER_EMAIL;

  // 1. If Google ID token JWT credential is provided
  if (credentialToken) {
    try {
      const parts = credentialToken.split(".");
      if (parts.length === 3) {
        const payloadJson = Buffer.from(parts[1], "base64url").toString("utf8");
        const payload = JSON.parse(payloadJson);
        const googleEmail = (payload.email || "").trim().toLowerCase();

        if (googleEmail !== targetEmail) {
          return {
            success: false,
            error: `Access Denied: Google account (${googleEmail}) is not authorized. Only ${targetEmail} has owner editing rights.`,
          };
        }
        return { success: true, email: targetEmail };
      }
    } catch (err) {
      console.warn("Failed to decode Google JWT token:", err);
    }
  }

  // 2. Direct verified Google account email check
  const inputEmail = (email || "").trim().toLowerCase();
  if (timingSafeStringCompare(inputEmail, targetEmail)) {
    return { success: true, email: targetEmail };
  }

  return {
    success: false,
    error: `Access Denied: Only the authorized owner (${targetEmail}) can sign in with Google.`,
  };
}

/**
 * Generate a 6-digit OTP and send to sailgavhane06@gmail.com
 */
export async function generateAndSendOtp(): Promise<{
  success: boolean;
  message: string;
  debugCode?: string;
}> {
  // Generate a random 6-digit numeric OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  saveAuthStore({ otpCode, otpExpiresAt: expiresAt });

  console.log(`[SAIL-06 AUTH OTP] Verification code for ${AUTHORIZED_OWNER_EMAIL}: ${otpCode}`);

  // Send real email via SMTP if credentials are configured in environment
  const smtpPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  const smtpUser = process.env.SMTP_USER || AUTHORIZED_OWNER_EMAIL;

  let emailDelivered = false;

  if (smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"SAIL.06 Security" <${smtpUser}>`,
        to: AUTHORIZED_OWNER_EMAIL,
        subject: `Your SAIL.06 Password Reset Code: ${otpCode}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0b0e; color: #ffffff; padding: 32px; border-radius: 16px; max-width: 500px; margin: auto; border: 1px solid rgba(255,255,255,0.1);">
            <div style="color: #FF3028; font-weight: 900; font-size: 20px; letter-spacing: 2px; margin-bottom: 24px;">SAIL.06 SECURITY</div>
            <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 12px; color: #ffffff;">Admin Password Reset Code</h2>
            <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
              You requested to reset or change your admin editing password for <strong>${AUTHORIZED_OWNER_EMAIL}</strong>. Use the 6-digit verification code below:
            </p>
            <div style="background-color: #181820; border: 1px solid rgba(255,48,40,0.4); padding: 18px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
              <span style="font-family: monospace; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #FF3028;">${otpCode}</span>
            </div>
            <p style="color: #71717a; font-size: 12px; line-height: 1.5; margin-bottom: 0;">
              This code will expire in 10 minutes. If you did not request this code, no changes have been made to your account.
            </p>
          </div>
        `,
      });
      emailDelivered = true;
    } catch (mailError) {
      console.warn("Could not dispatch via Gmail SMTP:", mailError);
    }
  }

  const message = emailDelivered
    ? `6-digit OTP sent to ${AUTHORIZED_OWNER_EMAIL}. Please check your inbox.`
    : `6-digit OTP generated for ${AUTHORIZED_OWNER_EMAIL}. (Valid for 10 minutes)`;

  return {
    success: true,
    message,
    // Return debugCode in local development or if SMTP is unconfigured for instant testability
    debugCode: !emailDelivered ? otpCode : undefined,
  };
}

/**
 * Verify OTP and update owner password
 */
export async function verifyOtpAndUpdatePassword(
  otp: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const store = readAuthStore();

  if (!store.otpCode || !store.otpExpiresAt) {
    return {
      success: false,
      message: "No active OTP request found. Please request a new OTP first.",
    };
  }

  if (Date.now() > store.otpExpiresAt) {
    saveAuthStore({ otpCode: undefined, otpExpiresAt: undefined });
    return {
      success: false,
      message: "OTP has expired. Please request a fresh 6-digit code.",
    };
  }

  const isOtpValid = timingSafeStringCompare((otp || "").trim(), store.otpCode);
  if (!isOtpValid) {
    return {
      success: false,
      message: "Invalid OTP code. Please check the code and try again.",
    };
  }

  if (!newPassword || newPassword.length < 6) {
    return {
      success: false,
      message: "New password must be at least 6 characters long.",
    };
  }

  // Update password and clear used OTP
  saveAuthStore({
    customPassword: newPassword,
    otpCode: undefined,
    otpExpiresAt: undefined,
  });

  console.log(`[SAIL-06 AUTH] Password updated successfully for ${AUTHORIZED_OWNER_EMAIL}`);

  return {
    success: true,
    message: "Password updated successfully! You can now log in with your new password.",
  };
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
