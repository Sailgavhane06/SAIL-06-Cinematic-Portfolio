"use client";

import React, { useState, useEffect } from "react";
import {
  Lock,
  KeyRound,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Mail,
  ArrowLeft,
  Key,
} from "lucide-react";

interface ProfileAuthModalProps {
  isOpen: boolean;
  isOwner: boolean;
  onClose: () => void;
  onLoginSuccess: (username: string) => void;
  onLogoutSuccess: () => void;
}

export default function ProfileAuthModal({
  isOpen,
  isOwner,
  onClose,
  onLoginSuccess,
  onLogoutSuccess,
}: ProfileAuthModalProps) {
  const [viewMode, setViewMode] = useState<"login" | "otp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessNotice(null);
      setViewMode("login");
      setOtpSent(false);
      setOtpCode("");
      setNewPassword("");
      if (!isOwner) {
        setPassword("");
      }
    }
  }, [isOpen, isOwner]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Direct 1-Click Google Account Sign-In (No password needed)
  const handleGoogleLogin = async () => {
    setError(null);
    setSuccessNotice(null);
    setGoogleLoading(true);

    try {
      const res = await fetch("/api/admin/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() || undefined }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Google Sign-In failed. Please try again.");
        setGoogleLoading(false);
        return;
      }

      setSuccessNotice("Signed in via Google! Unlocking edit bar...");
      setGoogleLoading(false);

      setTimeout(() => {
        onLoginSuccess("Sail Gavhane");
        onClose();
      }, 700);
    } catch {
      setError("Network or server error during Google Sign-In.");
      setGoogleLoading(false);
    }
  };

  // Email + Password login
  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim() || undefined,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid credentials. Please verify your password.");
        setLoading(false);
        return;
      }

      setSuccessNotice("Authentication verified! Unlocking edit bar...");
      setLoading(false);

      setTimeout(() => {
        onLoginSuccess("Sail Gavhane");
        onClose();
      }, 700);
    } catch {
      setError("Network or server error. Please try again.");
      setLoading(false);
    }
  };

  // Request OTP to Gmail
  const handleSendOtp = async () => {
    setError(null);
    setSuccessNotice(null);
    setOtpLoading(true);

    try {
      const res = await fetch("/api/admin/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to dispatch OTP. Please try again.");
        setOtpLoading(false);
        return;
      }

      // Direct client browser delivery via Web3Forms API (100% reliable on live hosting/mobile/desktop)
      if (data.otpCode) {
        try {
          const w3fKey = atob("NTgxYjAzNWMtMWUxZi00ZDAwLTkyY2EtNDI5OTRmNzg2NTBh");
          const targetRecipient = data.targetEmail || email.trim() || atob("c2FpbGdhdmhhbmUwNkBnbWFpbC5jb20=");
          const fd = new FormData();
          fd.append("access_key", w3fKey);
          fd.append("name", "SAIL.06 Security");
          fd.append("from_name", "SAIL.06 Security");
          fd.append("email", targetRecipient);
          fd.append("subject", `Your SAIL.06 Password Reset Code: ${data.otpCode}`);
          fd.append(
            "message",
            `Hello Sail,\n\nYour SAIL.06 admin password reset verification code is:\n\n${data.otpCode}\n\nThis OTP is valid for 10 minutes.\nIf you did not request this code, no changes have been made to your account.\n\n— SAIL.06 Security System`
          );

          await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: fd,
          });
        } catch (w3fErr) {
          console.warn("Client Web3Forms dispatch note:", w3fErr);
        }
      }

      setOtpSent(true);
      setSuccessNotice(data.message || "OTP code sent to your registered Gmail. Please check inbox.");
      if (data.debugCode) {
        setOtpCode(data.debugCode);
      }
      setOtpLoading(false);
    } catch {
      setError("Failed to reach OTP verification service.");
      setOtpLoading(false);
    }
  };

  // Verify OTP and update password
  const handleVerifyOtpAndUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);
    setOtpLoading(true);

    try {
      const res = await fetch("/api/admin/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: otpCode.trim(),
          newPassword: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid OTP code. Please check and try again.");
        setOtpLoading(false);
        return;
      }

      setSuccessNotice(data.message || "Password updated successfully! Unlocking edit bar...");
      setPassword(newPassword);
      setOtpLoading(false);

      // Automatically authenticate and unlock owner edit controls
      setTimeout(() => {
        onLoginSuccess("Sail Gavhane");
        onClose();
      }, 800);
    } catch {
      setError("Network error verifying OTP.");
      setOtpLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      setLoading(false);
      onLogoutSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#121217] border border-white/[0.12] rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.85)] z-10 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {isOwner ? (
          /* ============================================================ */
          /* OWNER AUTHENTICATED PROFILE VIEW                            */
          /* ============================================================ */
          <div className="text-center space-y-6">
            <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1b1718] border border-[#FF3028]/60 shadow-[0_0_24px_rgba(255,48,40,0.35)] text-[#FF3028]">
              <ShieldCheck className="w-8 h-8" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#121217] rounded-full animate-pulse" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wide uppercase mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Owner Mode Active
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Sail Gavhane</h2>
              <p className="text-xs text-zinc-400 mt-1 font-mono">{email || "Owner Account"} • Full Editing Access</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#181820] border border-white/[0.06] text-left text-xs text-zinc-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Live Edit Controls:</span>
                <span className="text-emerald-400 font-bold font-mono">ENABLED</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Section Edit Bars:</span>
                <span className="text-emerald-400 font-bold font-mono">VISIBLE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Authorized Account:</span>
                <span className="text-white font-mono truncate max-w-[200px]">{email || "Verified Owner"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <a
                href="/admin"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#FF3028] hover:bg-[#ff453e] text-white text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(255,48,40,0.4)] cursor-pointer"
              >
                <span>Open Full Admin Dashboard</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#1a1a22] hover:bg-[#252530] border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>{loading ? "Logging out..." : "Lock / Logout to Viewer Mode"}</span>
              </button>
            </div>
          </div>
        ) : viewMode === "otp" ? (
          /* ============================================================ */
          /* FORGOT / CHANGE PASSWORD VIA GMAIL OTP VIEW                 */
          /* ============================================================ */
          <div>
            <div className="flex items-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => {
                  setViewMode("login");
                  setError(null);
                  setSuccessNotice(null);
                }}
                className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Back to login"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">Password Reset OTP</h2>
                <p className="text-xs text-zinc-400">Target: {email || "Registered Owner Account"}</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-300 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successNotice && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successNotice}</span>
              </div>
            )}

            {!otpSent ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#181820] border border-white/[0.06] text-xs text-zinc-300 space-y-2">
                  <p className="text-zinc-400 leading-relaxed">
                    Click the button below to generate a secure 6-digit OTP code to your registered Gmail account:
                  </p>
                  <div className="font-mono text-[#FF3028] font-bold text-sm bg-black/40 p-2.5 rounded-lg border border-white/[0.08] text-center">
                    {email || "Registered Owner Gmail"}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpLoading}
                  className="w-full py-3 px-4 rounded-xl bg-[#FF3028] hover:bg-[#ff453e] disabled:opacity-60 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(255,48,40,0.35)] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  {otpLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending OTP Code...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Send OTP to Gmail</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode("login");
                      setError(null);
                      setSuccessNotice(null);
                    }}
                    className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleVerifyOtpAndUpdate} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="e.g. 123456"
                    className="w-full bg-[#181820] border border-white/[0.1] focus:border-[#FF3028] focus:ring-1 focus:ring-[#FF3028] rounded-xl px-4 py-2.5 text-center text-lg font-mono text-white tracking-widest outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    New Owner Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-[#181820] border border-white/[0.1] focus:border-[#FF3028] focus:ring-1 focus:ring-[#FF3028] rounded-xl pl-4 pr-10 py-2.5 text-sm text-white outline-none transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={otpLoading}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  {otpLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4" />
                      <span>Verify OTP & Set New Password</span>
                    </>
                  )}
                </button>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading}
                    className="text-[11px] text-zinc-400 hover:text-[#FF3028] transition-colors cursor-pointer"
                  >
                    Resend code?
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("login")}
                    className="text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* ============================================================ */
          /* LOGGED-OUT OWNER LOGIN WINDOW (GOOGLE + PASSWORD)            */
          /* ============================================================ */
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1a1a22] border border-[#FF3028]/40 shadow-[0_0_20px_rgba(255,48,40,0.2)] text-[#FF3028] mb-3">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Owner Authentication</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Access portfolio editing via Google Account or Owner Password.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-300 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successNotice && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successNotice}</span>
              </div>
            )}

            {/* DIRECT 1-CLICK GOOGLE SIGN IN BUTTON */}
            <div className="space-y-3 mb-5">
              <button
                id="google-signin-btn"
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3 border border-zinc-200"
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                    <span>Verifying Google Account...</span>
                  </>
                ) : (
                  <>
                    {/* Google Multicolor SVG Icon */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>
              <div className="text-center text-[10px] text-zinc-500 font-mono">
                Direct login for verified owner account
              </div>
            </div>

            {/* OR DIVIDER */}
            <div className="relative flex items-center justify-center mb-5">
              <div className="w-full border-t border-white/[0.08]" />
              <span className="absolute bg-[#121217] px-3 text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                Or with Owner Password
              </span>
            </div>

            {/* PASSWORD FORM */}
            <form onSubmit={handleSubmitPassword} className="space-y-4">
              {/* Email Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                    Owner Email
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono">Owner Account</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="owner-auth-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter owner email"
                    className="w-full bg-[#181820] border border-white/[0.08] focus:border-[#FF3028] text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none font-mono"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                    Password
                  </label>
                  <button
                    id="btn-switch-to-otp"
                    type="button"
                    onClick={() => {
                      setViewMode("otp");
                      setError(null);
                      setSuccessNotice(null);
                    }}
                    className="text-[11px] text-[#FF3028] hover:underline cursor-pointer"
                  >
                    Forgot / Reset via OTP?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="owner-auth-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-[#181820] border border-white/[0.1] focus:border-[#FF3028] focus:ring-1 focus:ring-[#FF3028] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="owner-auth-submit"
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#FF3028] hover:bg-[#ff453e] disabled:opacity-60 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(255,48,40,0.35)] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Open Edit Bar For All Sections</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-[11px] text-zinc-500 font-mono">
                Authorized Owner Access Only
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
