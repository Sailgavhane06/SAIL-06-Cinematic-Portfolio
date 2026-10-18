"use client";

import React from "react";
import { Pencil, ShieldCheck, ExternalLink, LogOut, LayoutGrid, Sparkles } from "lucide-react";

interface OwnerEditBarProps {
  isOwner: boolean;
  onOpenSection: (tab: string) => void;
  onOpenProfile: () => void;
}

export default function OwnerEditBar({
  isOwner,
  onOpenSection,
  onOpenProfile,
}: OwnerEditBarProps) {
  if (!isOwner) return null;

  const sections = [
    { id: "about", label: "Hero & About" },
    { id: "projects", label: "Projects" },
    { id: "blog", label: "Blog" },
    { id: "travel", label: "Travel" },
    { id: "contact", label: "Contact & Social" },
  ];

  return (
    <div className="fixed top-[68px] sm:top-[76px] left-0 right-0 z-40 bg-[#0d0d12]/95 backdrop-blur-xl border-y border-[#FF3028]/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-in slide-in-from-top duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-12 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Owner Status Pill */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b1718] border border-[#FF3028]/50 text-white font-mono font-bold hover:bg-[#281c1c] transition-colors cursor-pointer group"
            title="Admin Profile Details"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF3028] group-hover:scale-110 transition-transform" />
            <span className="truncate max-w-[170px] sm:max-w-none">Admin Mode Active</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          </button>

          <span className="text-zinc-500 hidden sm:inline">|</span>

          <span className="hidden md:inline font-mono text-zinc-400">
            <span className="text-[#FF3028] font-bold">EDIT BAR ACTIVE:</span> Click any section to edit
          </span>
        </div>

        {/* Center: Section Jump Buttons with Pencil Icons */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => onOpenSection(sec.id)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-[#FF3028] border border-white/[0.08] hover:border-[#FF3028] text-zinc-300 hover:text-white transition-all font-medium whitespace-nowrap cursor-pointer group active:scale-95"
            >
              <Pencil className="w-3 h-3 text-[#FF3028] group-hover:text-white transition-colors" />
              <span>{sec.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Full Admin Portal & Profile Menu */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <a
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FF3028] hover:bg-[#ff453e] text-white font-bold transition-all shadow-sm cursor-pointer"
          >
            <LayoutGrid className="w-3 h-3" />
            <span className="hidden sm:inline">Dashboard</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={onOpenProfile}
            className="px-2 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white font-mono transition-colors cursor-pointer"
            title="Profile Settings & Logout"
          >
            Profile
          </button>
        </div>
      </div>
    </div>
  );
}
