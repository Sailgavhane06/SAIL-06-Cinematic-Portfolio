"use client";

import { useState, useEffect, useRef } from "react";
import { SiteData } from "@/data/defaultData";
import {
  MapPin,
  Calendar,
  Upload,
  Trash2,
  Check,
  Bell,
  Compass,
  Sparkles,
  Edit3,
} from "lucide-react";

interface TravelItem {
  id: string;
  title: string;
  location: string;
  date: string;
  imageUrl: string;
  note: string;
  isCustom?: boolean;
}

const defaultTravels: TravelItem[] = [
  {
    id: "travel-1",
    title: "Alpine Ridge Exploration",
    location: "Himalayan Foothills & Mountain Passes",
    date: "September 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
    note: "High-altitude trek testing low-temperature telemetry sensors and rugged power banks in sub-zero terrain.",
  },
  {
    id: "travel-2",
    title: "Coastal Architecture & Marine Labs",
    location: "Pacific Coastline Expeditions",
    date: "July 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    note: "Studying coastal microclimates, tidal power installations, and lightweight saltwater-resistant materials.",
  },
  {
    id: "travel-3",
    title: "Urban Tech Hubs & Fabrication Centers",
    location: "Tokyo & Kyoto Hardware Districts",
    date: "May 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80",
    note: "Exploring precision CNC workshops, microelectronics suppliers, and industrial robotics prototyping labs.",
  },
  {
    id: "travel-4",
    title: "Night Sky & Observational Astro-Camp",
    location: "Dark Sky Reserve, Ladakh",
    date: "March 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80",
    note: "Stargazing and long-exposure deep space imaging with custom tracking mounts and astrophotography gear.",
  },
];

const STORAGE_KEY_TRAVEL = "sail06_custom_travel_items";
const STORAGE_KEY_FOLLOWERS = "sail06_travel_followers";

interface TravelProps {
  travelData?: SiteData["travel"] & {
    stories?: Array<{
      id: string;
      title: string;
      location: string;
      date: string;
      imageUrl: string;
      note: string;
      caption?: string;
      altText?: string;
    }>;
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
      const mapped = travelData.stories.map((s) => ({
        id: s.id,
        title: s.title,
        location: s.location,
        date: s.date,
        imageUrl: s.imageUrl,
        note: s.note,
        caption: s.caption,
        altText: s.altText,
      }));
      setTravelItems(mapped);
    }
  }, [travelData]);

  // Handle Photo Upload
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
        location: "Exploration Spot / Field Trip",
        date: "Recently Added",
        imageUrl: base64Url,
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

      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    reader.readAsDataURL(file);
  };

  const handleDeleteItem = (id: string) => {
    setTravelItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      const customOnly = next.filter((item) => item.isCustom);
      try {
        localStorage.setItem(STORAGE_KEY_TRAVEL, JSON.stringify(customOnly));
      } catch (err) {
        console.warn("Error updating travel items", err);
      }
      return next;
    });
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
      <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header & Action Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 sm:mb-20 gap-8">
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

          {/* Right Action: Upload Picture Button + Owner-Only Edit Travel Button */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Owner-Only Edit Travel Button */}
            {isOwner && onEditSection && (
              <button
                onClick={onEditSection}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-[#16161b] hover:bg-[#202028] border border-[#FF3028]/50 hover:border-[#FF3028] text-xs font-medium text-white shadow-md transition-all cursor-pointer"
                title="Edit Travel Section (Owner Mode)"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#FF3028]" />
                <span>Edit Information</span>
              </button>
            )}

            {/* Upload Picture Button — Owner Only */}
            {isOwner && (
              <button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="group flex items-center justify-center gap-2.5 bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 hover:border-[#FF3028]/60 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
              >
                <div className="w-5 h-5 rounded-full bg-[#FF3028]/20 flex items-center justify-center text-[#FF3028] group-hover:bg-[#FF3028] group-hover:text-white transition-colors">
                  {isUploading ? (
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 stroke-[2.4]" />
                  )}
                </div>
                <span>{isUploading ? "Uploading..." : "Upload Picture"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Travel Email Follow Banner (Requires Email Only) */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#141418] via-[#16161c] to-[#121215] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
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

        {/* Travel Photo Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {travelItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl bg-[#121215] border border-white/[0.07] overflow-hidden flex flex-col justify-between hover:border-[#FF3028]/50 transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] hover:-translate-y-1"
            >
              {/* Photo Area */}
              <div className="relative w-full h-56 overflow-hidden bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-black/30 pointer-events-none" />

                {/* Custom Upload Badge or Delete Button */}
                {item.isCustom && (
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 hover:bg-[#FF3028] text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Remove uploaded photo"
                    aria-label="Remove photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Location Badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] text-zinc-200">
                  <MapPin className="w-3 h-3 text-[#FF3028]" />
                  <span className="truncate max-w-[190px]">{item.location}</span>
                </div>
              </div>

              {/* Information Content */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono mb-2">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-2 tracking-tight group-hover:text-white transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed">
                    {item.note}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
