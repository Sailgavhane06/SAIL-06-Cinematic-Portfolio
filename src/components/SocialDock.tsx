"use client";

import React, { useState } from "react";
import { SiteData } from "@/data/defaultData";
import { Edit3, Check, ExternalLink, X as CloseIcon, Link as LinkIcon, Settings } from "lucide-react";

interface SocialDockProps {
  socialLinks: SiteData["socialLinks"];
  isOwner: boolean;
  onUpdateSocialLink: (platform: keyof SiteData["socialLinks"], url: string) => void;
  onOpenFullEditor?: () => void;
}

interface PlatformConfig {
  id: keyof SiteData["socialLinks"];
  name: string;
  placeholder: string;
  brandColor: string;
  formatUrl: (input: string) => string;
  icon: (className?: string) => React.ReactNode;
}

export const SOCIAL_PLATFORMS: PlatformConfig[] = [
  {
    id: "instagram",
    name: "Instagram",
    placeholder: "https://instagram.com/yourusername",
    brandColor: "#E4405F",
    formatUrl: (url: string) => {
      const trimmed = url.trim();
      if (!trimmed) return "https://instagram.com";
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
      if (trimmed.startsWith("@")) return `https://instagram.com/${trimmed.slice(1)}`;
      return `https://instagram.com/${trimmed}`;
    },
    icon: (className = "w-[18px] h-[18px]") => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    id: "youtube",
    name: "YouTube",
    placeholder: "https://youtube.com/@yourchannel",
    brandColor: "#FF0000",
    formatUrl: (url: string) => {
      const trimmed = url.trim();
      if (!trimmed) return "https://youtube.com";
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
      if (trimmed.startsWith("@")) return `https://youtube.com/${trimmed}`;
      return `https://youtube.com/@${trimmed}`;
    },
    icon: (className = "w-[18px] h-[18px]") => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    name: "Facebook",
    placeholder: "https://facebook.com/yourprofile",
    brandColor: "#1877F2",
    formatUrl: (url: string) => {
      const trimmed = url.trim();
      if (!trimmed) return "https://facebook.com";
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
      return `https://facebook.com/${trimmed}`;
    },
    icon: (className = "w-[18px] h-[18px]") => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    placeholder: "Phone number (e.g. +91 9876543210) or wa.me link",
    brandColor: "#25D366",
    formatUrl: (input: string) => {
      const trimmed = input.trim();
      if (!trimmed) return "https://whatsapp.com";
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
      // Strip any spaces, dashes, parentheses
      const cleanPhone = trimmed.replace(/[^\d+]/g, "").replace(/^\+/, "");
      return `https://wa.me/${cleanPhone}`;
    },
    icon: (className = "w-[18px] h-[18px]") => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.201.3-.778.978-.954 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.676-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.101-.201.05-.376-.025-.527-.075-.15-.678-1.635-.929-2.239-.244-.588-.492-.508-.678-.518-.176-.009-.376-.01-.577-.01s-.527.075-.803.376c-.276.301-1.054 1.03-1.054 2.511 0 1.481 1.079 2.912 1.229 3.113.15.201 2.122 3.24 5.141 4.544.718.31 1.279.495 1.716.634.721.229 1.377.197 1.896.119.578-.087 1.78-.727 2.031-1.43.251-.703.251-1.305.176-1.43-.075-.125-.276-.201-.577-.351zM12.042 21.944a9.92 9.92 0 0 1-5.06-1.39l-.363-.215-3.761.986 1.004-3.666-.237-.376a9.926 9.926 0 0 1-1.523-5.241C2.102 6.516 6.559 2.06 12.044 2.06c2.658 0 5.158 1.035 7.034 2.913a9.902 9.902 0 0 1 2.919 7.034c0 5.485-4.46 9.937-9.955 9.937zm8.448-18.397A11.892 11.892 0 0 0 12.044.06C5.457.06.096 5.421.096 12.008c0 2.103.548 4.156 1.59 5.961L0 24l6.197-1.626a11.907 11.907 0 0 0 5.845 1.52h.005c6.587 0 11.947-5.361 11.947-11.948 0-3.193-1.243-6.195-3.504-8.405z" />
      </svg>
    ),
  },
  {
    id: "x",
    name: "X (Twitter)",
    placeholder: "https://x.com/yourhandle",
    brandColor: "#FFFFFF",
    formatUrl: (url: string) => {
      const trimmed = url.trim();
      if (!trimmed) return "https://x.com";
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
      if (trimmed.startsWith("@")) return `https://x.com/${trimmed.slice(1)}`;
      return `https://x.com/${trimmed}`;
    },
    icon: (className = "w-[16px] h-[16px]") => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function SocialDock({
  socialLinks,
  isOwner,
  onUpdateSocialLink,
  onOpenFullEditor,
}: SocialDockProps) {
  const [editingPlatform, setEditingPlatform] = useState<PlatformConfig | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleOpenEdit = (platform: PlatformConfig) => {
    setEditingPlatform(platform);
    setInputValue(socialLinks?.[platform.id] || "");
    setSavedSuccess(false);
  };

  const handleSaveLink = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingPlatform) return;

    const formatted = editingPlatform.formatUrl(inputValue);
    onUpdateSocialLink(editingPlatform.id, formatted);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setEditingPlatform(null);
    }, 800);
  };

  React.useEffect(() => {
    if (!editingPlatform) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditingPlatform(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingPlatform]);

  return (
    <>
      {/* Vertical Social Media Dock on Right Side */}
      <aside
        aria-label="Social media links"
        className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 select-none animate-in fade-in slide-in-from-right-4 duration-300"
      >
        <div className="relative flex flex-col items-center bg-[#121215]/85 backdrop-blur-md border border-white/10 rounded-full py-3.5 px-2 sm:px-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.65)] hover:border-white/20 transition-all">
          {/* Owner Quick Header Badge (Only rendered if isOwner is true) */}
          {isOwner && (
            <div className="relative group mb-1.5 pb-1.5 border-b border-white/10 flex flex-col items-center">
              <button
                onClick={onOpenFullEditor}
                className="w-7 h-7 rounded-full bg-[#FF3028]/15 border border-[#FF3028]/40 flex items-center justify-center text-[#FF3028] hover:bg-[#FF3028] hover:text-white transition-all cursor-pointer"
                title="Owner: Click to manage all social media accounts"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              {/* Tooltip */}
              <div className="absolute right-full mr-3.5 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center pointer-events-none z-50">
                <div className="bg-[#18181f] border border-[#FF3028]/40 text-[#FF3028] text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap">
                  Owner: Edit All Social Links
                </div>
                <div className="w-1.5 h-1.5 bg-[#18181f] border-t border-r border-[#FF3028]/40 rotate-45 -ml-1" />
              </div>
            </div>
          )}

          {/* Social Icons List: Instagram -> YouTube -> Facebook -> WhatsApp -> X */}
          <div className="flex flex-col items-center gap-2.5 sm:gap-3">
            {SOCIAL_PLATFORMS.map((platform) => {
              const currentRawUrl = socialLinks?.[platform.id] || "";
              const targetUrl = platform.formatUrl(currentRawUrl);

              return (
                <div key={platform.id} className="relative group flex items-center">
                  {/* VIEWER vs OWNER Click Behavior */}
                  {isOwner ? (
                    // OWNER: Click opens upload/edit modal for this account
                    <button
                      onClick={() => handleOpenEdit(platform)}
                      aria-label={`Owner: Update ${platform.name} account`}
                      className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all duration-200 cursor-pointer active:scale-95 group-hover:scale-105"
                    >
                      {platform.icon()}
                      {/* Owner miniature edit indicator dot */}
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FF3028] ring-2 ring-[#121215]" />
                    </button>
                  ) : (
                    // VIEWER: Standard direct external link to visit profile
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${platform.name} profile`}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all duration-200 active:scale-95 group-hover:scale-105"
                    >
                      {platform.icon()}
                    </a>
                  )}

                  {/* High-Fidelity Tooltip on Hover */}
                  <div className="absolute right-full mr-3.5 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center pointer-events-none z-50">
                    <div className="bg-[#18181f]/95 backdrop-blur-sm border border-white/10 text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-2xl flex items-center gap-1.5 whitespace-nowrap">
                      <span>{platform.name}</span>
                      {isOwner ? (
                        <span className="text-[10px] text-[#FF3028] font-bold">
                          &bull; Click to Upload/Edit
                        </span>
                      ) : (
                        <ExternalLink className="w-2.5 h-2.5 text-zinc-400" />
                      )}
                    </div>
                    <div className="w-1.5 h-1.5 bg-[#18181f] border-t border-r border-white/10 rotate-45 -ml-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Owner Link Edit Dialog (Only for authenticated owner) */}
      {isOwner && editingPlatform && (
        <div
          onClick={() => setEditingPlatform(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#121215] border border-white/15 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 cursor-default"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#16161b]">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-inner"
                  style={{ backgroundColor: `${editingPlatform.brandColor}25` }}
                >
                  {editingPlatform.icon("w-5 h-5")}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    <span>Upload {editingPlatform.name} Account</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Set your profile link for visitors to view
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingPlatform(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                aria-label="Close dialog"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveLink} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  {editingPlatform.id === "whatsapp"
                    ? "WhatsApp Number or Direct Chat Link"
                    : `${editingPlatform.name} URL / Username`}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={editingPlatform.placeholder}
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF3028] pr-10"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                </div>
                <p className="mt-1.5 text-[11px] text-zinc-400">
                  {editingPlatform.id === "whatsapp"
                    ? "Tip: Enter your full phone number with country code (e.g. +91 9876543210) or wa.me link."
                    : `Tip: You can paste the full URL or your handle (e.g. @sail06).`}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3">
                {inputValue ? (
                  <a
                    href={editingPlatform.formatUrl(inputValue)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Test Link</span>
                  </a>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPlatform(null)}
                    className="px-3.5 py-2 rounded-xl text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 bg-[#FF3028] hover:bg-[#ff453e] text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(255,48,40,0.35)] transition-all cursor-pointer active:scale-95"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <span>Save Link</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
