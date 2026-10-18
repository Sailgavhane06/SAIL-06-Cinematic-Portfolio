"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TravelStory, SiteContent } from "@/lib/types";
import {
  Compass,
  MapPin,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  X,
  Camera,
  Layers,
  Globe,
  SlidersHorizontal,
} from "lucide-react";

const baselineTravels: TravelStory[] = [
  {
    id: "travel-1",
    title: "Alpine Ridge Exploration",
    slug: "alpine-ridge-exploration",
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
    fullDescription:
      "Scaling the high-altitude passes of the Himalayas provided an uncompromising test bench for custom embedded electronics. Operating at altitudes above 4,200 meters in sub-zero temperatures, we monitored lithium-iron-phosphate battery chemistry decay, evaluated LoRa long-range telemetry propagation through steep valleys, and tested custom 3D-printed enclosure seals against freezing moisture condensation. The rugged terrain proved invaluable for refining field hardware resilience.",
    galleryImages: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: true,
    order: 1,
    status: "published",
  },
  {
    id: "travel-2",
    title: "Coastal Architecture & Marine Labs",
    slug: "coastal-architecture-marine-labs",
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
    fullDescription:
      "Along the Pacific rim, wave action and constant marine fog create one of nature's harshest corrosion testing environments. During this field expedition, we collaborated with marine biology research labs studying non-invasive tidal sensors and tested conformal coatings against airborne saline corrosion on sensitive RF circuits.",
    galleryImages: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: false,
    order: 2,
    status: "published",
  },
  {
    id: "travel-3",
    title: "Urban Tech Hubs & Fabrication Centers",
    slug: "urban-tech-hubs-fabrication-centers",
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
    fullDescription:
      "Navigating the dense alleys of Akihabara and high-precision machining hubs in Kyoto. Sourced precision planetary gearboxes, inspected 5-axis wire EDM fabrication, and exchanged prototyping methodologies with local hardware makers building autonomous micro-drones.",
    galleryImages: [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: false,
    order: 3,
    status: "published",
  },
  {
    id: "travel-4",
    title: "Night Sky & Observational Astro-Camp",
    slug: "night-sky-observational-astro-camp",
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
    fullDescription:
      "Under Bortle Class 1 dark skies in Hanle, Ladakh, light pollution is zero. Armed with equatorial motor tracking mounts driven by custom stepper driver algorithms, we captured long-exposure exposures of the Milky Way core and tested thermal noise reduction on CCD sensors in crisp minus 15-degree conditions.",
    galleryImages: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: false,
    order: 4,
    status: "published",
  },
];

export default function TravelPage() {
  const [stories, setStories] = useState<TravelStory[]>(baselineTravels);
  const [selectedStory, setSelectedStory] = useState<TravelStory | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isOwner, setIsOwner] = useState(false);

  // Fetch verified published content from public API
  useEffect(() => {
    fetch("/api/content", {
      cache: "no-store",
      headers: {
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.success && json.data?.travel?.stories?.length) {
          // Public API only delivers published stories
          const serverStories: TravelStory[] = json.data.travel.stories.map((s: TravelStory, idx: number) => ({
            ...s,
            destination: s.destination || s.location || "Exploration Spot",
            travelDate: s.travelDate || s.date || "2026",
            coverImage: s.coverImage || s.imageUrl || baselineTravels[0].coverImage,
            shortDescription: s.shortDescription || s.note || "",
            fullDescription: s.fullDescription || s.shortDescription || s.note || "",
            galleryImages: s.galleryImages && s.galleryImages.length > 0 ? s.galleryImages : [s.coverImage || s.imageUrl || baselineTravels[0].coverImage],
            featured: typeof s.featured === "boolean" ? s.featured : idx === 0,
          }));
          setStories(serverStories);
        }
      })
      .catch((err) => {
        console.warn("Using baseline travel archive:", err);
      });

    // Check owner session
    fetch("/api/admin/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const isValidRole = data?.user?.role === "admin" || data?.user?.role === "owner";
        if (data && data.authenticated && isValidRole) {
          setIsOwner(true);
        }
      })
      .catch(() => {});
  }, []);

  const featuredStory = stories.find((s) => s.featured) || stories[0] || baselineTravels[0];

  // Filtering
  const filteredStories = stories.filter((story) => {
    if (activeFilter === "all") return true;
    const dest = (story.destination || "").toLowerCase();
    const title = (story.title || "").toLowerCase();
    if (activeFilter === "mountains") return dest.includes("mountain") || dest.includes("himalayan") || title.includes("ridge");
    if (activeFilter === "coastal") return dest.includes("coast") || dest.includes("pacific") || title.includes("marine");
    if (activeFilter === "urban") return dest.includes("tokyo") || dest.includes("hardware") || title.includes("tech");
    if (activeFilter === "astro") return dest.includes("dark sky") || dest.includes("ladakh") || title.includes("sky");
    return true;
  });

  return (
    <div className="min-h-screen bg-[#070709] text-white selection:bg-[#FF3028] selection:text-white">
      {/* Top Header & Navigation */}
      <header className="sticky top-0 z-40 bg-[#070709]/90 backdrop-blur-md border-b border-white/[0.06] transition-all">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center">
              <svg
                viewBox="0 0 36 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[24px] h-[20px] transition-transform duration-300 group-hover:scale-105"
              >
                <path
                  d="M13 5.5H30.5C28.5 8.5 24.5 10.5 18 11H11.5C9 11 7.5 12.2 7.5 14C7.5 15.8 9 17 12.5 17.6L19 18.7C24.5 19.6 28 22 28 25.5C28 28.5 24.8 30.5 18.5 30.5H3.5C6 27.5 10 25.5 16 25H21.5C23.5 25 24.5 24 24.5 22.5C24.5 20.8 23 19.8 19.5 19.2L13 18.1C7.5 17.2 4 14.8 4 11.2C4 7.8 7.5 5.5 13 5.5Z"
                  fill="#FF3028"
                />
              </svg>
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-zinc-200">
              SAIL.06
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
              / TRAVEL ARCHIVE
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {isOwner && (
              <a
                href="/admin?tab=travel"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#16161b] hover:bg-[#FF3028] border border-[#FF3028]/60 text-xs font-semibold text-white transition-all shadow-md"
              >
                <span>Edit Travels (Admin)</span>
              </a>
            )}

            <Link
              href="/#travel"
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 text-xs sm:text-sm font-medium text-zinc-200 hover:text-white transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Portfolio</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pt-12 pb-28 space-y-20">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141418] border border-white/[0.08] shadow-sm">
            <Compass className="w-3.5 h-3.5 text-[#FF3028]" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#FF3028]">
              EXPEDITIONS & FIELD NOTES
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]">
                Beyond the <span className="text-[#FF3028]">Ordinary.</span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-zinc-400 font-light max-w-2xl leading-relaxed">
                Travel fuels engineering creativity. From high-altitude mountain trails to robotics fabrication hubs across the globe, here is where ideas collide with the real world.
              </p>
            </div>

            {/* Metrics Counter */}
            <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs text-zinc-400">
              <div className="p-3.5 rounded-2xl bg-[#121216] border border-white/[0.06]">
                <div className="text-xl sm:text-2xl font-bold text-white font-sans">{stories.length}</div>
                <div className="text-[10px] tracking-wider uppercase text-zinc-500 mt-0.5">Expeditions</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#121216] border border-white/[0.06]">
                <div className="text-xl sm:text-2xl font-bold text-white font-sans">4+</div>
                <div className="text-[10px] tracking-wider uppercase text-zinc-500 mt-0.5">Global Zones</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#121216] border border-white/[0.06]">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-sans">100%</div>
                <div className="text-[10px] tracking-wider uppercase text-zinc-500 mt-0.5">Field Verified</div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Journey Showcase */}
        {featuredStory && (
          <div className="relative rounded-3xl overflow-hidden bg-[#101015] border border-white/[0.1] shadow-[0_24px_64px_rgba(0,0,0,0.85)] group">
            <div className="relative w-full h-[460px] sm:h-[560px] lg:h-[620px] overflow-hidden bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredStory.coverImage}
                alt={featuredStory.altText || featuredStory.title}
                onError={(e) => {
                  if (e.currentTarget.src !== baselineTravels[0].coverImage) {
                    e.currentTarget.src = baselineTravels[0].coverImage;
                  }
                }}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-black/40 to-black/30 pointer-events-none" />

              {/* Featured Badge */}
              <div className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF3028] text-white text-xs font-mono font-bold uppercase tracking-wider shadow-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured Journey
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs text-zinc-200">
                  <MapPin className="w-3 h-3 text-[#FF3028]" />
                  <span>{featuredStory.destination}</span>
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-2xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#FF3028] font-semibold">
                    <Calendar className="w-4 h-4" />
                    <span>{featuredStory.travelDate}</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                    {featuredStory.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-200 font-light leading-relaxed max-w-xl">
                    {featuredStory.shortDescription}
                  </p>
                </div>

                <button
                  data-featured-journey-btn="true"
                  onClick={() => setSelectedStory(featuredStory)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-xl cursor-pointer active:scale-95 shrink-0"
                >
                  <span>Read Full Log</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Complete Archive Feed */}
        <div className="space-y-8">
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Complete Travel Archive</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Explore all verified field excursions, hardware field trials, and expeditions.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              {[
                { id: "all", label: "All Journeys" },
                { id: "mountains", label: "Mountains & Passes" },
                { id: "coastal", label: "Coastal & Marine" },
                { id: "urban", label: "Urban Tech" },
                { id: "astro", label: "Dark Sky" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    activeFilter === tab.id
                      ? "bg-[#FF3028] text-white shadow-[0_0_15px_rgba(255,48,40,0.35)]"
                      : "bg-[#141418] hover:bg-[#1e1e24] text-zinc-400 hover:text-white border border-white/[0.06]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Editorial Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                data-journey-card="true"
                onClick={() => setSelectedStory(story)}
                className="group relative rounded-3xl bg-[#111116] border border-white/[0.08] hover:border-[#FF3028]/60 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.65)] hover:-translate-y-1.5 cursor-pointer"
              >
                {/* Photo Header */}
                <div className="relative w-full h-64 overflow-hidden bg-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={story.coverImage}
                    alt={story.altText || story.title}
                    onError={(e) => {
                      if (e.currentTarget.src !== baselineTravels[0].coverImage) {
                        e.currentTarget.src = baselineTravels[0].coverImage;
                      }
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent to-black/30 pointer-events-none" />

                  {/* Destination Pill */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[11px] text-zinc-200">
                    <MapPin className="w-3 h-3 text-[#FF3028]" />
                    <span className="truncate max-w-[210px]">{story.destination}</span>
                  </div>

                  {/* Gallery Count Badge if multiple images exist */}
                  {story.galleryImages && story.galleryImages.length > 1 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] text-zinc-300 font-mono">
                      <Camera className="w-3 h-3 text-[#FF3028]" />
                      <span>{story.galleryImages.length} Photos</span>
                    </div>
                  )}
                </div>

                {/* Editorial Content */}
                <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#FF3028] mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{story.travelDate}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#FF3028] transition-colors line-clamp-1">
                      {story.title}
                    </h3>

                    <p className="text-xs text-zinc-400 font-light leading-relaxed mt-2 line-clamp-3">
                      {story.shortDescription}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-zinc-400 group-hover:text-white transition-colors">
                    <span>Read Expedition Notes</span>
                    <ArrowRight className="w-4 h-4 text-[#FF3028] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Journey Detail Modal */}
        {selectedStory && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="relative bg-[#111116] border border-white/[0.12] rounded-3xl w-full max-w-3xl my-8 overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.9)] animate-in zoom-in-95 duration-200">
              {/* Close Button */}
              <button
                onClick={() => setSelectedStory(null)}
                className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-black/60 hover:bg-[#FF3028] text-white backdrop-blur-md transition-colors cursor-pointer"
                aria-label="Close Journey Details"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Cover Photo */}
              <div className="relative w-full h-80 sm:h-96 overflow-hidden bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedStory.coverImage}
                  alt={selectedStory.altText || selectedStory.title}
                  onError={(e) => {
                    if (e.currentTarget.src !== baselineTravels[0].coverImage) {
                      e.currentTarget.src = baselineTravels[0].coverImage;
                    }
                  }}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent to-black/30 pointer-events-none" />

                <div className="absolute bottom-6 left-6 sm:left-8 right-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#FF3028] font-bold">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedStory.travelDate}</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {selectedStory.title}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                    <MapPin className="w-3.5 h-3.5 text-[#FF3028]" />
                    <span>{selectedStory.destination}</span>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#FF3028] mb-2 font-bold">
                    FIELD LOG & DISPATCH
                  </h4>
                  <p className="text-sm text-zinc-300 font-light leading-relaxed whitespace-pre-line">
                    {selectedStory.fullDescription || selectedStory.shortDescription}
                  </p>
                </div>

                {/* Photo Gallery if Available */}
                {selectedStory.galleryImages && selectedStory.galleryImages.length > 0 && (
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3 font-semibold flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-[#FF3028]" />
                      <span>Expedition Photo Gallery</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedStory.galleryImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative h-28 sm:h-36 rounded-xl overflow-hidden bg-black/40 border border-white/[0.08] group/photo"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img}
                            alt={`${selectedStory.title} gallery photo ${idx + 1}`}
                            className="w-full h-full object-cover object-center group-hover/photo:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Action */}
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-500">SAIL.06 EXPEDITIONS</span>
                  <button
                    onClick={() => setSelectedStory(null)}
                    className="px-5 py-2.5 rounded-full bg-[#1e1e26] hover:bg-[#282834] text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    Close Log
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#121216] via-[#16161d] to-[#121215] border border-white/[0.08] text-center space-y-4 shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Have an Expedition or Project in Mind?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto font-light leading-relaxed">
            Whether for harsh-environment field hardware testing, telemetry setups, or technology advisories, let&apos;s build something exceptional.
          </p>
          <div className="pt-2">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF3028] hover:bg-[#ff453e] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,48,40,0.35)] cursor-pointer active:scale-95"
            >
              <span>Get In Touch</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
