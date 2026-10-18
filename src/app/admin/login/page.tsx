"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Key,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/admin";

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

  // Check if already authenticated
  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.replace(nextUrl);
        }
      })
      .catch(() => {});
  }, [router, nextUrl]);

  // Google Sign-In
  const handleGoogleLogin = async () => {
    setError(null);
    setSuccessNotice(null);
    setGoogleLoading(true);

    try {
      const res = await fetch("/api/admin/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Google Sign-In failed. Please try again.");
        setGoogleLoading(false);
        return;
      }

      setSuccessNotice("Google Sign-In successful! Redirecting to dashboard...");
      setGoogleLoading(false);

      setTimeout(() => {
        window.location.href = nextUrl;
      }, 600);
    } catch {
      setError("Network or server error during Google Sign-In.");
      setGoogleLoading(false);
    }
  };

  // Password Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Authentication failed. Please verify your credentials.");
        setLoading(false);
        return;
      }

      setSuccessNotice("Credentials verified! Redirecting to dashboard...");
      setLoading(false);

      setTimeout(() => {
        window.location.href = nextUrl;
      }, 600);
    } catch {
      setError("Network or server error. Please try again.");
      setLoading(false);
    }
  };

  // Request OTP
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

      setOtpSent(true);
      setSuccessNotice(data.message || "OTP generated and dispatched!");
      if (data.debugCode) {
        setOtpCode(data.debugCode);
      }
      setOtpLoading(false);
    } catch {
      setError("Failed to reach OTP verification service.");
      setOtpLoading(false);
    }
  };

  // Verify OTP & Update Password
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

      setSuccessNotice(data.message || "Password updated successfully!");
      setPassword(newPassword);
      setOtpLoading(false);

      setTimeout(() => {
        setViewMode("login");
      }, 1200);
    } catch {
      setError("Network error verifying OTP.");
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col justify-between selection:bg-[#FF3028] selection:text-white">
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between border-b border-white/[0.05]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-3 h-3 bg-[#FF3028] rounded-full group-hover:scale-125 transition-transform" />
          <span className="text-xl font-black tracking-widest text-white">SAIL.06</span>
          <span className="text-xs uppercase tracking-wider text-zinc-500 font-mono">/ PORTFOLIO</span>
        </Link>
        <Link
          href="/"
          className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>← Back to Website</span>
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Brand header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#16161b] border border-white/[0.1] shadow-2xl mb-4 text-[#FF3028]">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Owner Administration
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Sign in with your verified Google Account or Owner Password.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-[#121216] border border-white/[0.08] rounded-2xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-3 text-red-200 text-sm animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{error}</div>
              </div>
            )}

            {successNotice && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3 text-emerald-200 text-sm animate-in fade-in duration-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{successNotice}</div>
              </div>
            )}

            {viewMode === "otp" ? (
              /* OTP RESET VIEW */
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
                    <h2 className="text-lg font-bold text-white tracking-tight">Reset Password with OTP</h2>
                    <p className="text-xs text-zinc-400">Target: {email || "Authorized Owner Account"}</p>
                  </div>
                </div>

                {!otpSent ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#181820] border border-white/[0.06] text-xs text-zinc-300 space-y-2">
                      <p className="text-zinc-400">
                        Click below to generate and send a 6-digit OTP code to your registered owner Gmail address:
                      </p>
                      <div className="font-mono text-[#FF3028] font-bold text-sm bg-black/40 p-2.5 rounded-lg border border-white/[0.08] text-center">
                        {email || "Registered Owner Gmail"}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpLoading}
                      className="w-full py-3 px-4 rounded-xl bg-[#FF3028] hover:bg-[#ff453e] disabled:opacity-60 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(255,48,40,0.35)] cursor-pointer flex items-center justify-center gap-2"
                    >
                      {otpLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Dispatching OTP...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>Send OTP Code to Gmail</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleVerifyOtpAndUpdate} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                        6-Digit OTP Code
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="123456"
                        className="w-full bg-[#18181e] border border-white/[0.1] focus:border-[#FF3028] rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                        New Owner Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          minLength={6}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full bg-[#18181e] border border-white/[0.1] focus:border-[#FF3028] rounded-xl pl-4 pr-11 py-3 text-sm text-white outline-none font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={otpLoading}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {otpLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Key className="w-4 h-4" />
                          <span>Verify OTP & Save New Password</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* LOGIN VIEW */
              <div>
                {/* DIRECT GOOGLE SIGN IN BUTTON */}
                <div className="space-y-3 mb-6">
                  <button
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
                    Direct access for verified owner account
                  </div>
                </div>

                <div className="relative flex items-center justify-center mb-6">
                  <div className="w-full border-t border-white/[0.08]" />
                  <span className="absolute bg-[#121216] px-3 text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                    Or with Owner Password
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                      Owner Account Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="owner@domain.com"
                        className="w-full bg-[#18181e] border border-white/[0.08] focus:border-[#FF3028] text-white rounded-xl pl-10 pr-4 py-3 text-sm font-mono outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setViewMode("otp");
                          setError(null);
                          setSuccessNotice(null);
                        }}
                        className="text-xs text-[#FF3028] hover:underline cursor-pointer"
                      >
                        Reset via OTP?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full bg-[#18181e] border border-white/[0.1] focus:border-[#FF3028] rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#FF3028] transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-[#FF3028] hover:bg-[#ff453e] disabled:opacity-60 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-[0_4px_20px_rgba(255,48,40,0.35)] transition-all cursor-pointer active:scale-[0.99]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying session...</span>
                      </>
                    ) : (
                      <>
                        <span>Authenticate & Access Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
              <p className="text-xs text-zinc-500">
                Encrypted Session • HMAC-SHA256 • HttpOnly Cookie
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-zinc-600">
        SAIL.06 Cinematic Portfolio • Authorized Access Only
      </footer>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center text-white">
          <Loader2 className="w-6 h-6 animate-spin text-[#FF3028]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
