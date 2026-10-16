"use client";

import React, { useState, useEffect } from "react";
import { User, Lock, KeyRound, X, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff, ShieldCheck, LogOut, ExternalLink } from "lucide-react";

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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessNotice(null);
      if (!isOwner) {
        setUsername("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid username or password. Please check your credentials.");
        setLoading(false);
        return;
      }

      setSuccessNotice("Authentication verified! Unlocking edit bar...");
      setLoading(false);

      setTimeout(() => {
        onLoginSuccess(username.trim());
        onClose();
      }, 700);
    } catch {
      setError("Network or server error. Please try again.");
      setLoading(false);
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
      {/* Backdrop click dismiss */}
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
              <h2 className="text-2xl font-black text-white tracking-tight">Main Person (Owner)</h2>
              <p className="text-xs text-zinc-400 mt-1 font-mono">Full Editing Access</p>
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
                <span className="text-zinc-500">Pencil Edit Icons:</span>
                <span className="text-emerald-400 font-bold font-mono">READY</span>
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
        ) : (
          /* ============================================================ */
          /* LOGGED-OUT OWNER LOGIN WINDOW                               */
          /* ============================================================ */
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1a1a22] border border-[#FF3028]/40 shadow-[0_0_20px_rgba(255,48,40,0.2)] text-[#FF3028] mb-3">
                <User className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Owner Verification</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Enter your username and password to open the edit bar for all sections.
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  User Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="owner-auth-username"
                    name="username"
                    type="text"
                    required
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    className="w-full bg-[#181820] border border-white/[0.1] focus:border-[#FF3028] focus:ring-1 focus:ring-[#FF3028] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-transparent outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Password
                </label>
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
                    autoComplete="current-password"
                    className="w-full bg-[#181820] border border-white/[0.1] focus:border-[#FF3028] focus:ring-1 focus:ring-[#FF3028] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-transparent outline-none transition-all font-mono"
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
                Authorized Owner Access Only • SAIL.06
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
