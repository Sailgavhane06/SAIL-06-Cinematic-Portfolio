"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#0a0a0c] border-t border-white/[0.06] py-12 select-none">
      <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <svg
            viewBox="0 0 38 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[22px] h-[19px]"
          >
            <path
              d="M13.5 5.5H31C28 9.5 24 11 18.5 11.5H13C10.5 11.5 9 12.8 9 14.5C9 16.5 11 17.5 14.5 18L21.5 19.2C27 20.2 30 22.8 30 26.5C30 30 26.5 32 20 32H2.5C5.5 28 9.5 26.5 15 26H20.5C23 26 24.5 24.8 24.5 23C24.5 21 22.5 20 19 19.5L12 18.2C6.5 17.2 3.5 14.5 3.5 11C3.5 7.2 7.5 5.5 13.5 5.5Z"
              fill="#FF3028"
            />
          </svg>
          <span className="text-sm font-bold tracking-tight text-white">
            SAIL.06
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-xs text-zinc-400">
            SAIL GAVHANE &bull; CREATOR &times; ELECTRICAL ENGINEER
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-xs text-zinc-500">
            &copy; 2026 SAIL.06. All rights reserved.
          </span>
          <button
            onClick={scrollToTop}
            className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#FF3028] transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
