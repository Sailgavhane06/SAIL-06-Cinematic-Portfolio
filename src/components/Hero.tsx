"use client";

import { SiteData } from "@/data/defaultData";
import { Pencil } from "lucide-react";

interface HeroProps {
  heroData: SiteData["hero"];
  inlineEditMode?: boolean;
  isOwner?: boolean;
  onEditSection?: () => void;
  onUpdateHero?: (field: keyof SiteData["hero"], value: string) => void;
  onScrollClick?: () => void;
}

export default function Hero({
  heroData,
  inlineEditMode = false,
  isOwner = false,
  onEditSection,
  onUpdateHero,
  onScrollClick,
}: HeroProps) {
  const scrollToNextSection = () => {
    if (onScrollClick) {
      onScrollClick();
      return;
    }
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBlur = (field: keyof SiteData["hero"], e: React.FocusEvent<HTMLElement>) => {
    if (onUpdateHero) {
      onUpdateHero(field, e.currentTarget.innerText.trim());
    }
  };

  const editableClass = inlineEditMode
    ? "outline-dashed outline-1 outline-[#FF3028]/60 hover:outline-[#FF3028] hover:bg-white/[0.04] rounded px-1 cursor-text transition-all"
    : "";

  return (
    <section
      id="home"
      className="relative w-full h-[100svh] min-h-[660px] max-h-[1100px] overflow-hidden bg-[#0e0e10] flex items-center select-none"
    >
      {/* Owner-Only Pencil Edit Button for Hero */}
      {isOwner && onEditSection && (
        <div className="absolute top-24 sm:top-28 right-6 sm:right-12 lg:right-16 z-30 animate-in fade-in">
          <button
            onClick={onEditSection}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#16161b]/95 hover:bg-[#FF3028] border border-[#FF3028]/60 hover:border-[#FF3028] text-xs font-semibold text-white shadow-xl shadow-black/50 transition-all duration-200 cursor-pointer group active:scale-95"
            title="Edit Hero Data (Owner Only)"
          >
            <Pencil className="w-3.5 h-3.5 text-[#FF3028] group-hover:text-white transition-colors" />
            <span>Edit Hero</span>
          </button>
        </div>
      )}

      {/* Background Portrait Plate Container */}
      <div className="absolute inset-0 z-0 flex items-end justify-center pointer-events-none overflow-hidden">
        {/* Responsive portrait wrapper: perfectly fits within viewport with tabletop grounded at bottom and entire head visible */}
        <div className="relative h-[82svh] sm:h-[86svh] md:h-[88svh] lg:h-[90svh] max-h-[820px] w-auto flex items-end justify-center translate-x-[4%] sm:translate-x-[3%] lg:translate-x-[4%] xl:translate-x-[5%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={(heroData as unknown as { portraitImage?: string })?.portraitImage || "/sail-portrait.jpg"}
            alt="Sail Gavhane — Creator & Electrical Engineer"
            className="h-full w-auto max-w-none object-contain object-bottom filter contrast-[1.02]"
          />

          {/* Smooth horizontal gradient fades on photo edges to blend with #0e0e10 background */}
          <div className="absolute inset-y-0 -left-1 w-28 bg-gradient-to-r from-[#0e0e10] via-[#0e0e10]/80 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 -right-1 w-28 bg-gradient-to-l from-[#0e0e10] via-[#0e0e10]/80 to-transparent pointer-events-none" />

          {/* Top soft fade above the head */}
          <div className="absolute inset-x-0 -top-1 h-20 bg-gradient-to-b from-[#0e0e10] to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Foreground UI Layer */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 h-full flex flex-col justify-between pt-24 sm:pt-28 pb-8 sm:pb-11">
        {/* Top spacer */}
        <div className="hidden sm:block" />

        {/* Middle Main Content Grid */}
        <div className="relative my-auto flex flex-col md:flex-row items-start md:items-center justify-between w-full">
          {/* Left Side: Typography & Introduction */}
          <div className="max-w-[540px] pt-4 sm:pt-0">
            {/* "Hi, I'm" */}
            <h2
              contentEditable={inlineEditMode}
              suppressContentEditableWarning
              onBlur={(e) => handleBlur("greeting", e)}
              className={`text-2xl sm:text-[28px] lg:text-[32px] font-semibold text-white tracking-tight leading-tight mb-1 sm:mb-1.5 ${editableClass}`}
            >
              {heroData.greeting}
            </h2>

            {/* Giant Red Headline: SAIL */}
            <h1
              contentEditable={inlineEditMode}
              suppressContentEditableWarning
              onBlur={(e) => handleBlur("name", e)}
              className={`text-[82px] sm:text-[104px] md:text-[120px] lg:text-[140px] xl:text-[148px] font-black tracking-tight leading-[0.88] text-[#FF3028] mb-5 sm:mb-6 select-none ${editableClass}`}
            >
              {heroData.name}
            </h1>

            {/* Roles / Professional Title */}
            <div className="text-[11px] sm:text-[12.5px] lg:text-[13.5px] font-semibold tracking-[0.22em] text-zinc-200 uppercase leading-[1.8] mb-5 sm:mb-6">
              <div
                contentEditable={inlineEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleBlur("rolesLine1", e)}
                className={editableClass}
              >
                {heroData.rolesLine1}
              </div>
              <div
                contentEditable={inlineEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleBlur("rolesLine2", e)}
                className={editableClass}
              >
                {heroData.rolesLine2}
              </div>
            </div>

            {/* Short Red Horizontal Divider */}
            <div className="w-11 sm:w-12 h-[2.5px] bg-[#FF3028] rounded-full mb-5 sm:mb-6" />

            {/* Tagline / Subtitle */}
            <p className="text-[14px] sm:text-[15.5px] lg:text-[16px] text-[#C5C5C5] font-normal leading-[1.65] max-w-[360px]">
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleBlur("descriptionLine1", e)}
                className={`block ${editableClass}`}
              >
                {heroData.descriptionLine1}
              </span>
              <span
                contentEditable={inlineEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleBlur("descriptionLine2", e)}
                className={`block ${editableClass}`}
              >
                {heroData.descriptionLine2}
              </span>
            </p>
          </div>

          {/* Right Side Tagline: Turning ideas into real-world solutions */}
          <div className="hidden lg:flex items-center gap-3.5 absolute right-8 xl:right-12 top-[40%] -translate-y-1/2">
            {/* Thin Vertical Red Line */}
            <div className="w-[2px] h-[44px] bg-[#FF3028] shrink-0 rounded-full" />

            {/* Tagline Copy */}
            <div className="text-[13.5px] leading-[1.48] text-[#C5C5C5] font-normal tracking-wide">
              <div
                contentEditable={inlineEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleBlur("rightTaglineLine1", e)}
                className={editableClass}
              >
                {heroData.rightTaglineLine1}
              </div>
              <div
                contentEditable={inlineEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleBlur("rightTaglineLine2", e)}
                className={editableClass}
              >
                {heroData.rightTaglineLine2}
              </div>
              <div
                contentEditable={inlineEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleBlur("rightTaglineLine3", e)}
                className={editableClass}
              >
                {heroData.rightTaglineLine3}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Experience Block (Left) & Scroll Indicator (Right) */}
        <div className="relative z-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 sm:gap-4 w-full pt-6">
          {/* Bottom-Left Information: Experience Badge */}
          <div className="flex items-center gap-3.5">
            {/* Thin Vertical Red Line */}
            <div className="w-[2px] h-[46px] bg-[#FF3028] shrink-0 rounded-full" />

            {/* Experience Content */}
            <div>
              <div className="text-[14px] sm:text-[15px] font-bold text-white tracking-tight flex items-center gap-1">
                <span
                  contentEditable={inlineEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => handleBlur("experienceYears", e)}
                  className={editableClass}
                >
                  {heroData.experienceYears}
                </span>
                <span>years experience</span>
              </div>
              <div
                contentEditable={inlineEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleBlur("experienceLine1", e)}
                className={`text-[11.5px] sm:text-[12px] text-[#A1A1A1] leading-snug mt-0.5 ${editableClass}`}
              >
                {heroData.experienceLine1}
              </div>
              <div
                contentEditable={inlineEditMode}
                suppressContentEditableWarning
                onBlur={(e) => handleBlur("experienceLine2", e)}
                className={`text-[11.5px] sm:text-[12px] text-[#A1A1A1] leading-snug ${editableClass}`}
              >
                {heroData.experienceLine2}
              </div>
            </div>
          </div>

          {/* Tablet/Mobile fallback for right-side tagline */}
          <div className="flex lg:hidden items-center gap-3 sm:mx-auto">
            <div className="w-[2px] h-[36px] bg-[#FF3028] shrink-0" />
            <div className="text-[12px] leading-snug text-[#C5C5C5]">
              {heroData.rightTaglineLine1} {heroData.rightTaglineLine2} {heroData.rightTaglineLine3}
            </div>
          </div>

          {/* Bottom-Right Scroll Indicator */}
          <button
            onClick={scrollToNextSection}
            className="flex items-center gap-3 group cursor-pointer self-end sm:self-auto transition-transform duration-200 hover:translate-y-0.5"
            aria-label="Scroll down to About section"
          >
            {/* Minimal Mouse-shaped Icon matching reference */}
            <div className="w-[17px] h-[26px] rounded-full border-[1.5px] border-zinc-300 flex items-start justify-center p-[3px] group-hover:border-white transition-colors">
              <span className="w-[2px] h-[4.5px] rounded-full bg-zinc-200 animate-bounce" />
            </div>

            {/* Scroll Down Label (Title Case) */}
            <span className="text-[12px] font-normal tracking-[0.18em] text-zinc-300 group-hover:text-white transition-colors select-none">
              Scroll Down
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
