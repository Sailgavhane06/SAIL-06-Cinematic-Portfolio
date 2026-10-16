"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Compass, Sparkles } from "lucide-react";

interface TravelTransitionOverlayProps {
  isActive: boolean;
  onComplete?: () => void;
  targetUrl?: string;
}

export default function TravelTransitionOverlay({
  isActive,
  onComplete,
  targetUrl = "/travel",
}: TravelTransitionOverlayProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [phaseText, setPhaseText] = useState("INITIATING EXPEDITION...");
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      hasNavigatedRef.current = false;
      return;
    }

    // Check for prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // Accessible fast path: 300ms transition
      const timer = setTimeout(() => {
        if (!hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          if (onComplete) onComplete();
          router.push(targetUrl);
        }
      }, 300);
      return () => clearTimeout(timer);
    }

    // Full 3.2s Cinematic Journey Airplane Transition
    const startTime = Date.now();
    const duration = 3200; // ~3.2 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const current = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(current);

      if (current < 30) {
        setPhaseText("MAPPING EXPEDITION COORDINATES...");
      } else if (current < 70) {
        setPhaseText("CRUISING GLOBAL WAYPOINTS...");
      } else {
        setPhaseText("LANDING AT TRAVEL ARCHIVE...");
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        if (!hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          if (onComplete) onComplete();
          router.push(targetUrl);
        }
      }
    }, 50);

    // Fail-safe maximum timeout (4.0s) so navigation is NEVER blocked indefinitely
    const failSafe = setTimeout(() => {
      if (!hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        if (onComplete) onComplete();
        router.push(targetUrl);
      }
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(failSafe);
    };
  }, [isActive, onComplete, targetUrl, router]);

  if (!isActive) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Expedition Flight Transition"
      className="fixed inset-0 z-[9999] bg-[#07070a] flex flex-col items-center justify-center overflow-hidden select-none animate-in fade-in duration-300 pointer-events-auto"
    >
      {/* Cinematic Starfield & Atmospheric Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#181824]/60 via-[#0a0a0e] to-[#040406]" />
      
      {/* Subtle Grid Radar Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

      {/* Horizon Glow Line with Red Accent */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#FF3028]/40 to-transparent blur-sm" />
      <div className="absolute left-1/4 right-1/4 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#FF3028] to-transparent shadow-[0_0_20px_#FF3028]" />

      {/* Airplane Flight Canvas Area */}
      <div className="relative w-full max-w-5xl h-72 sm:h-96 flex items-center justify-center overflow-hidden">
        {/* Supersonic Jet Airplane Flying Diagonally Across Screen */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            animation: "flyAcross 3.2s cubic-bezier(0.25, 1, 0.5, 1) forwards",
          }}
        >
          <div className="relative flex items-center">
            {/* Glowing Red Engine Contrail / Trail */}
            <div className="w-48 sm:w-80 h-[3px] bg-gradient-to-l from-[#FF3028] via-[#ff5b54]/60 to-transparent rounded-full shadow-[0_0_15px_#FF3028] -mr-2" />

            {/* Stylized Jet / Aircraft SVG */}
            <div className="relative -rotate-6 transform scale-90 sm:scale-110 drop-shadow-[0_0_12px_rgba(255,48,40,0.6)]">
              <svg
                width="72"
                height="72"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              >
                {/* Sleek Supersonic Aircraft Silhouette */}
                <path
                  d="M21.5 12L13 2.5L10 3.5L14 11H3.5L2 9.5H0.5L1.5 12L0.5 14.5H2L3.5 13H14L10 20.5L13 21.5L21.5 12Z"
                  fill="white"
                />
                <circle cx="14" cy="12" r="1.5" fill="#FF3028" />
              </svg>
            </div>
          </div>
        </div>

        {/* Ambient Floating Dust / Light Specks */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-white/40 animate-ping" />
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 rounded-full bg-[#FF3028]/70 animate-pulse" />
        </div>
      </div>

      {/* Flight HUD & Telemetry Status */}
      <div className="relative z-30 text-center max-w-md px-6 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16161d] border border-white/[0.1] shadow-xl">
          <Compass className="w-4 h-4 text-[#FF3028] animate-spin" style={{ animationDuration: "6s" }} />
          <span className="text-[11px] font-mono tracking-widest uppercase text-white font-bold">
            EXPEDITION TRANSIT
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3028] animate-ping" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Flying To Destination
        </h3>

        <p className="text-xs font-mono text-zinc-400 tracking-wider">
          {phaseText}
        </p>

        {/* Progress Bar */}
        <div className="w-64 sm:w-80 mx-auto">
          <div className="relative w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF3028] to-[#ff6a64] rounded-full shadow-[0_0_12px_#FF3028] transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mt-2">
            <span>RUNWAY 06</span>
            <span className="text-[#FF3028] font-bold">{progress}%</span>
            <span>WAYPOINT /TRAVEL</span>
          </div>
        </div>
      </div>

      {/* Keyframe animation injected inline */}
      <style jsx>{`
        @keyframes flyAcross {
          0% {
            transform: translate(-120vw, 80px) scale(0.6) rotate(8deg);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translate(120vw, -120px) scale(1.15) rotate(-4deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
