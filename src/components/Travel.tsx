"use client";

import { useState, useEffect, useRef } from "react";
import { SiteData } from "@/data/defaultData";
import { TravelStory } from "@/lib/types";
import TravelTransitionOverlay from "./TravelTransitionOverlay";
import {
  MapPin,
  Calendar,
  Upload,
  Check,
  Bell,
  Compass,
  Sparkles,
  Pencil,
  ArrowLeft,
  ArrowRight,
  Plane,
  Eye,
} from "lucide-react";

interface TravelItem {
  id: string;
  title: string;
  destination: string;
  location?: string;
  travelDate: string;
  date?: string;
  coverImage: string;
  imageUrl?: string;
  shortDescription: string;
  note?: string;
  fullDescription?: string;
  caption?: string;
  altText?: string;
  featured?: boolean;
  isCustom?: boolean;
}

const defaultTravels: TravelItem[] = [
  {
    id: "travel-1",
    title: "Alpine Ridge Exploration",
    destination: "Himalayan Foothills & Mountain Passes",
    location: "Himalayan Foothills & Mountain Passes",
    travelDate: "September 2026",
    date: "September 2026",
    coverImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
    shortDescription:
      "High-altitude trek testing low-temperature telemetry sensors and rugged power banks in sub-zero terrain.",
    note:
      "High-altitude trek testing low-temperature telemetry sensors and rugged power banks in sub-zero terrain.",
    featured: true,
  },
  {
    id: "travel-2",
    title: "Coastal Architecture & Marine Labs",
    destination: "Pacific Coastline Expeditions",
    location: "Pacific Coastline Expeditions",
    travelDate: "July 2026",
    date: "July 2026",
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85",
    shortDescription:
      "Studying coastal microclimates, tidal power installations, and lightweight saltwater-resistant materials.",
    note:
      "Studying coastal microclimates, tidal power installations, and lightweight saltwater-resistant materials.",
  },
  {
    id: "travel-3",
    title: "Urban Tech Hubs & Fabrication Centers",
    destination: "Tokyo & Kyoto Hardware Districts",
    location: "Tokyo & Kyoto Hardware Districts",
    travelDate: "May 2026",
    date: "May 2026",
    coverImage:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85",
    imageUrl:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85",
    shortDescription:
      "Exploring precision CNC workshops, microelectronics suppliers, and industrial robotics prototyping labs.",
    note:
      "Exploring precision CNC workshops, microelectronics suppliers, and industrial robotics prototyping labs.",
  },
  {
    id: "travel-4",
    title: "Night Sky & Observational Astro-Camp",
    destination: "Dark Sky Reserve, Ladakh",
    location: "Dark Sky Reserve, Ladakh",
    travelDate: "March 2026",
    date: "March 2026",
    coverImage:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=85",
    imageUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=85",
    shortDescription:
      "Stargazing and long-exposure deep space imaging with custom tracking mounts and astrophotography gear.",
    note:
      "Stargazing and long-exposure deep space imaging with custom tracking mounts and astrophotography gear.",
  },
];

const STORAGE_KEY_TRAVEL = "sail06_custom_travel_items";
const STORAGE_KEY_FOLLOWERS = "sail06_travel_followers";

interface TravelProps {
  travelData?: SiteData["travel"] & {
    stories?: TravelStory[];
  };
  isOwner?: boolean;
  onEditSection?: () => void;
}

export default function Travel({
  travelData,
  isOwner = false,
  onEditSection,
}: TravelProps) {
  const [travelItems, setTravelItems] = useState<TravelItem[]>(defaultTravels);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitionActive, setIsTransitionActive] = useState(false);
  const [email, setEmail] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followMessage, setFollowMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const headingPart1 = travelData?.headingPart1 || "Exploring Beyond";
  const headingHighlight = travelData?.headingHighlight || "The Workbench.";
  const description =
    travelData?.description ||
    "Travel fuels engineering creativity. From high-altitude mountain trails to robotics fabrication hubs across the globe, here is where ideas collide with the real world.";
  const followTitle = travelData?.followTitle || "Follow My Travel Journey";
  const followSubtitle =
    travelData?.followSubtitle ||
    "Get occasional postcards, expedition logs, and field updates directly to your inbox.";

  // Sync with stories from server/props
  useEffect(() => {
    if (travelData?.stories && Array.isArray(travelData.stories) && travelData.stories.length > 0) {
      const mapped: TravelItem[] = travelData.stories.map((s) => ({
        id: s.id,
        title: s.title,
        destination: s.destination || s.location || "Exploration Spot",
        location: s.location || s.destination || "Exploration Spot",
        travelDate: s.travelDate || s.date || "2026",
        date: s.date || s.travelDate || "2026",
        coverImage: s.coverImage || s.imageUrl || defaultTravels[0].coverImage,
        imageUrl: s.imageUrl || s.coverImage || defaultTravels[0].coverImage,
        shortDescription: s.shortDescription || s.note || "",
        note: s.note || s.shortDescription || "",
        fullDescription: s.fullDescription,
        caption: s.caption,
        altText: s.altText,
        featured: s.featured,
      }));
      setTravelItems(mapped);

      // Default active index to featured story if exists
      const featuredIdx = mapped.findIndex((m) => m.featured);
      if (featuredIdx >= 0) {
        setActiveIndex(featuredIdx);
      }
    }
  }, [travelData]);

  const currentJourney = travelItems[activeIndex] || travelItems[0] || defaultTravels[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % travelItems.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + travelItems.length) % travelItems.length);
  };

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if travel section is in viewport or active
      const el = document.getElementById("travel");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [travelItems.length]);

  // Handle "Explore My Travels" Button Click
  const handleExploreClick = () => {
    if (isTransitionActive) return; // Prevent repeated clicks
    setIsTransitionActive(true);
  };

  // Handle Photo Upload (Owner Only)
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      const newItem: TravelItem = {
        id: `custom-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        destination: "Field Expedition Location",
        location: "Field Expedition Location",
        travelDate: "Recently Captured",
        date: "Recently Captured",
        coverImage: base64Url,
        imageUrl: base64Url,
        shortDescription: "Captured during field travels and shared with the SAIL.06 community.",
        note: "Captured during field travels and shared with the SAIL.06 community.",
        isCustom: true,
      };

      setTravelItems((prev) => {
        const next = [newItem, ...prev];
        const customOnly = next.filter((item) => item.isCustom);
        try {
          localStorage.setItem(STORAGE_KEY_TRAVEL, JSON.stringify(customOnly));
        } catch (err) {
          console.warn("Could not save to localStorage", err);
        }
        return next;
      });

      setActiveIndex(0);
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    reader.readAsDataURL(file);
  };

  // Handle Follow Button (Email Only Required)
  const handleFollowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    try {
      const savedFollowers = localStorage.getItem(STORAGE_KEY_FOLLOWERS);
      const followersList = savedFollowers ? JSON.parse(savedFollowers) : [];
      if (!followersList.includes(email)) {
        followersList.push(email);
        localStorage.setItem(STORAGE_KEY_FOLLOWERS, JSON.stringify(followersList));
      }
    } catch (err) {
      console.warn("Could not store follower email", err);
    }

    setIsFollowing(true);
    setFollowMessage(`Thanks for following! Updates will be sent to ${email}`);
    setEmail("");

    setTimeout(() => {
      setIsFollowing(false);
      setFollowMessage("");
    }, 6000);
  };

  return (
    <section
      id="travel"
      className="relative w-full py-28 sm:py-36 bg-[#0a0a0c] border-t border-white/[0.06] overflow-hidden"
    >
      {/* Fullscreen Flight Transition Overlay */}
      <TravelTransitionOverlay
        isActive={isTransitionActive}
        targetUrl="/travel"
        onComplete={() => setIsTransitionActive(false)}
      />

      <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header & Action Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 sm:mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-[#FF3028]" />
              <span className="text-[12px] font-semibold tracking-[0.25em] text-[#FF3028] uppercase flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                TRAVEL & EXPEDITIONS
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {headingPart1} <br />
              <span className="text-[#FF3028]">{headingHighlight}</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#C5C5C5] font-light max-w-xl leading-relaxed">
              {description}
            </p>
          </div>

          {/* Right Action: Explore My Travels Button + Owner Controls */}
          <div className="flex flex-wrap items-center gap-3.5 shrink-0">
            {/* Primary Button: Explore My Travels (Triggers 3-4s Airplane Flight Animation) */}
            <button
              id="explore-my-travels-btn"
              onClick={handleExploreClick}
              disabled={isTransitionActive}
              className="group relative flex items-center justify-center gap-3 bg-[#FF3028] hover:bg-[#ff453e] disabled:opacity-60 text-white px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer shadow-[0_0_28px_rgba(255,48,40,0.45)] hover:shadow-[0_0_40px_rgba(255,48,40,0.6)] active:scale-95"
              aria-label="Explore My Travels (Launch animated journey)"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Plane className="w-3.5 h-3.5 stroke-[2.5] transform -rotate-45" />
              </div>
              <span className="tracking-tight uppercase font-mono">Explore My Travels</span>
              <ArrowRight className="w-4 h-4 stroke-[2.2] group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Hidden native file input for owner */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Owner-Only Pencil Edit Travel Button */}
            {isOwner && onEditSection && (
              <button
                onClick={onEditSection}
                className="flex items-center gap-1.5 px-4 py-3 rounded-full bg-[#16161b] hover:bg-[#FF3028] border border-[#FF3028]/50 hover:border-[#FF3028] text-xs font-semibold text-white shadow-md transition-all cursor-pointer group active:scale-95"
                title="Edit Travel Data (Owner Only)"
              >
                <Pencil className="w-3.5 h-3.5 text-[#FF3028] group-hover:text-white transition-colors" />
                <span>Edit Travel</span>
              </button>
            )}

            {/* Upload Picture Button — Owner Only */}
            {isOwner && (
              <button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="group flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 hover:border-[#FF3028]/60 px-4 py-3 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
              >
                <Upload className="w-3.5 h-3.5 text-[#FF3028]" />
                <span>{isUploading ? "Uploading..." : "Upload Photo"}</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESIGN 1: CINEMATIC JOURNEY (Main Featured Immersive Panoramic Showcase) */}
        {/* ========================================================================= */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-[#0d0d12] border border-white/[0.1] shadow-[0_24px_64px_rgba(0,0,0,0.85)] group mb-14">
          {/* Panoramic Image Container with Smooth Crossfade Transition */}
          <div className="relative w-full h-[520px] sm:h-[620px] lg:h-[680px] overflow-hidden bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={currentJourney.id}
              src={currentJourney.coverImage}
              alt={currentJourney.altText || currentJourney.title}
              className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out animate-in fade-in zoom-in-95 duration-700"
            />

            {/* Dark Cinematic Vignette & Gradient Overlays for Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-black/45 to-black/30 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_black_100%)] opacity-70 pointer-events-none" />

            {/* Top Bar inside Panoramic Image: Journey Counter & Destination Pill */}
            <div className="absolute top-6 sm:top-8 left-6 sm:left-10 right-6 sm:right-10 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-3">
                {/* Journey Counter (e.g. 01 / 04) */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white text-xs font-mono tracking-wider shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#FF3028] animate-pulse" />
                  <span className="text-[#FF3028] font-bold">
                    JOURNEY {String(activeIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="text-zinc-500">/</span>
                  <span className="text-zinc-400 font-mono">
                    {String(travelItems.length).padStart(2, "0")}
                  </span>
                </div>

                {currentJourney.featured && (
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF3028]/20 border border-[#FF3028]/50 text-[#FF3028] text-xs font-mono font-bold tracking-wide uppercase backdrop-blur-md">
                    <Sparkles className="w-3 h-3" />
                    Featured Expedition
                  </span>
                )}
              </div>

              {/* Destination Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-xs text-zinc-300 font-medium shadow-lg max-w-[240px] truncate">
                <MapPin className="w-3.5 h-3.5 text-[#FF3028] shrink-0" />
                <span className="truncate">{currentJourney.destination}</span>
              </div>
            </div>

            {/* Bottom Overlay: Title, Travel Date, Description & Navigation Controls */}
            <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pointer-events-auto">
              <div className="max-w-2xl space-y-3">
                {/* Travel Date */}
                <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-[#FF3028] font-semibold">
                  <Calendar className="w-4 h-4" />
                  <span>{currentJourney.travelDate}</span>
                </div>

                {/* Big Bold Cinematic Title */}
                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                  {currentJourney.title}
                </h3>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-zinc-200 font-light leading-relaxed max-w-xl line-clamp-2 drop-shadow">
                  {currentJourney.shortDescription}
                </p>
              </div>

              {/* Navigation Controls: Previous / Next Buttons & Indicators */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                {/* Dot / Dash Indicators */}
                <div className="flex items-center gap-1.5">
                  {travelItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === activeIndex
                          ? "w-8 bg-[#FF3028] shadow-[0_0_10px_#FF3028]"
                          : "w-2 bg-white/30 hover:bg-white/60"
                      }`}
                      aria-label={`Go to journey ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="flex items-center justify-center w-11 h-11 rounded-full bg-black/70 hover:bg-[#FF3028] text-white border border-white/20 hover:border-[#FF3028] backdrop-blur-md transition-all duration-200 cursor-pointer shadow-xl active:scale-95 group"
                    aria-label="Previous Travel Journey"
                    title="Previous Journey"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={handleNext}
                    className="flex items-center justify-center w-11 h-11 rounded-full bg-black/70 hover:bg-[#FF3028] text-white border border-white/20 hover:border-[#FF3028] backdrop-blur-md transition-all duration-200 cursor-pointer shadow-xl active:scale-95 group"
                    aria-label="Next Travel Journey"
                    title="Next Journey"
                  >
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Email Follow Banner (Requires Email Only) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#141418] via-[#16161c] to-[#121215] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="max-w-md">
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF3028] mb-1.5 uppercase tracking-wider">
              <Bell className="w-3.5 h-3.5" />
              <span>Stay In The Loop</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {followTitle}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-light">
              {followSubtitle}
            </p>
          </div>

          {/* Follow Form (Requires ONLY email) */}
          <div className="w-full md:w-auto">
            {followMessage ? (
              <div className="flex items-center gap-2.5 bg-[#FF3028]/15 border border-[#FF3028]/40 px-5 py-3 rounded-xl text-xs sm:text-sm text-white font-medium animate-in fade-in">
                <Check className="w-4 h-4 text-[#FF3028] shrink-0" />
                <span>{followMessage}</span>
              </div>
            ) : (
              <form
                onSubmit={handleFollowSubmit}
                className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-[380px]"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email to follow..."
                  className="w-full px-4 py-2.5 rounded-full bg-white/[0.05] border border-white/10 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-[#FF3028] transition-colors"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#FF3028] hover:bg-[#ff453e] text-white font-semibold text-xs tracking-wide transition-all shadow-[0_0_20px_rgba(255,48,40,0.3)] shrink-0 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Follow</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
