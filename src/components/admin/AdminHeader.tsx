"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ShieldCheck,
  ExternalLink,
  LogOut,
  Loader2,
} from "lucide-react";

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user?.email) {
          setUserEmail(data.user.email);
        } else if (pathname !== "/admin/login") {
          router.replace("/admin/login");
        }
      })
      .catch(() => {});
  }, [pathname, router]);

  // Do not display admin header on login page
  if (pathname === "/admin/login") {
    return null;
  }

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to end your administrative session?")) {
      return;
    }

    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Logout failed:", e);
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#101014]/90 backdrop-blur-md border-b border-white/[0.08]">
      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-2.5 h-2.5 bg-[#FF3028] rounded-full group-hover:scale-125 transition-transform" />
            <span className="text-base font-black tracking-widest text-white">SAIL.06</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-[#FF3028]/15 border border-[#FF3028]/30 text-[#FF3028]">
              ADMIN DASHBOARD
            </span>
          </Link>
        </div>

        {/* Right: User info & actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{userEmail || "Admin"}</span>
            <span className="text-zinc-500 font-mono">(Admin)</span>
          </div>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/[0.08] text-xs font-medium text-white transition-all cursor-pointer"
            title="Preview Live Public Website"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </Link>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 border border-red-500/30 text-xs font-medium text-red-300 transition-all cursor-pointer disabled:opacity-50"
            title="Log out of admin session"
          >
            {loggingOut ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <LogOut className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
