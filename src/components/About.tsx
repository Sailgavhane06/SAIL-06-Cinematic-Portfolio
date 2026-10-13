"use client";

import { SiteData } from "@/data/defaultData";
import { Cpu, Zap, Code, Rocket, CheckCircle2 } from "lucide-react";

interface AboutProps {
  aboutData: SiteData["about"];
  inlineEditMode?: boolean;
}

export default function About({ aboutData, inlineEditMode = false }: AboutProps) {
  const icons = [Zap, Code, Cpu, Rocket];

  const highlights = [
    "5+ years of hands-on prototyping and product engineering",
    "Deep expertise in electronics, circuit design & embedded code",
    "Creator of open-source tools, technical guides & hardware builds",
    "Relentless focus on solving high-friction, real-world problems",
  ];

  const editableClass = inlineEditMode
    ? "outline-dashed outline-1 outline-[#FF3028]/60 hover:outline-[#FF3028] hover:bg-white/[0.04] rounded px-1 cursor-text transition-all"
    : "";

  return (
    <section
      id="about"
      className="relative w-full py-28 sm:py-36 bg-[#0e0e10] border-t border-white/[0.06] overflow-hidden"
    >
      <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-[#FF3028]" />
            <span className="text-[12px] font-semibold tracking-[0.25em] text-[#FF3028] uppercase">
              ABOUT ME
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            &ldquo;
            <span className={editableClass}>{aboutData.quotePart1}</span>{" "}
            <br />
            <span className={`text-[#FF3028] ${editableClass}`}>
              {aboutData.quoteHighlight}
            </span>
            &rdquo;
          </h2>
          <p
            className={`mt-6 text-base sm:text-lg text-[#C5C5C5] leading-relaxed max-w-2xl font-light ${editableClass}`}
          >
            {aboutData.bio}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {aboutData.pillars.map((pillar, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div
                key={i}
                className="group relative p-7 rounded-2xl bg-[#141417]/70 border border-white/[0.06] hover:border-[#FF3028]/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FF3028]/10 border border-[#FF3028]/20 flex items-center justify-center text-[#FF3028] mb-6 group-hover:scale-110 group-hover:bg-[#FF3028] group-hover:text-white transition-all duration-300">
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h3
                  className={`text-lg font-bold text-white mb-2.5 tracking-tight ${editableClass}`}
                >
                  {pillar.title}
                </h3>
                <p className={`text-sm text-zinc-400 leading-relaxed font-light ${editableClass}`}>
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Feature Block */}
        <div className="rounded-2xl bg-gradient-to-r from-[#17171c] to-[#121215] border border-white/[0.08] p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
              Engineering with Purpose & Impact
            </h4>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl font-light">
              Every system, schematic, and software repository is designed with scalability, reliability, and human ergonomics at its core.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto shrink-0">
            {highlights.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#FF3028] shrink-0" />
                <span className="text-xs sm:text-sm text-zinc-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
