"use client";

import { SiteData } from "@/data/defaultData";
import { ArrowRight, Clock, Edit3, Plus } from "lucide-react";

interface BlogProps {
  blogData?: SiteData["blog"];
  isOwner?: boolean;
  onEditSection?: () => void;
  onAddArticle?: () => void;
}

export default function Blog({
  blogData,
  isOwner = false,
  onEditSection,
  onAddArticle,
}: BlogProps) {
  const defaultArticles = [
    {
      title: "Designing Robust Hardware: Lessons from 100+ PCB Iterations",
      excerpt:
        "Why signal integrity, thermal dissipation, and ground-loop management are often overlooked in early prototypes and how to prevent field failures.",
      category: "Hardware Engineering",
      readTime: "7 min read",
      date: "October 2026",
    },
    {
      title: "Bridging Silicon & Code: Building Embedded Systems That Don't Crash",
      excerpt:
        "Techniques for deterministic firmware design, state-machine resilience, and hardware-in-the-loop testing workflows for mission-critical electronics.",
      category: "Firmware & Architecture",
      readTime: "5 min read",
      date: "September 2026",
    },
    {
      title: "I Don't Just Learn Things. I Build Things — The Maker Mindset",
      excerpt:
        "How rapid prototyping and an uncompromising builder philosophy accelerates engineering comprehension 10x faster than passive theory.",
      category: "Philosophy & Building",
      readTime: "4 min read",
      date: "August 2026",
    },
  ];

  const heading = blogData?.heading || "Engineering Notes & Learnings";
  const description =
    blogData?.description ||
    "Deep dives into electronics design, product prototyping, and software engineering.";
  const articles = blogData?.articles || defaultArticles;

  return (
    <section
      id="blog"
      className="relative w-full py-28 sm:py-36 bg-[#0e0e10] border-t border-white/[0.06]"
    >
      <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-[#FF3028]" />
              <span className="text-[12px] font-semibold tracking-[0.25em] text-[#FF3028] uppercase">
                IDEAS & INSIGHTS
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {heading}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#C5C5C5] font-light">
              {description}
            </p>
          </div>

          {/* Owner-Only Action Buttons */}
          {isOwner && (
            <div className="flex items-center gap-2.5 shrink-0">
              {onAddArticle && (
                <button
                  onClick={onAddArticle}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF3028] hover:bg-[#ff453e] text-xs font-semibold text-white shadow-md transition-all cursor-pointer active:scale-95"
                  title="Add New Blog Article (Owner Mode)"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Information</span>
                </button>
              )}

              {onEditSection && (
                <button
                  onClick={onEditSection}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#16161b] hover:bg-[#202028] border border-[#FF3028]/50 hover:border-[#FF3028] text-xs font-medium text-white shadow-md transition-all cursor-pointer"
                  title="Edit Blog Section (Owner Mode)"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#FF3028]" />
                  <span>Edit Information</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {articles.map((art, idx) => (
            <article
              key={idx}
              className="group rounded-2xl bg-[#131316] border border-white/[0.06] p-7 sm:p-8 flex flex-col justify-between hover:border-[#FF3028]/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-4 font-mono">
                  <span className="text-[#FF3028] font-semibold tracking-wider uppercase">
                    {art.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{art.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-white transition-colors leading-snug">
                  {art.title}
                </h3>

                <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-mono">{art.date}</span>
                <span className="flex items-center gap-1 text-xs font-semibold text-[#FF3028] group-hover:translate-x-1 transition-transform">
                  Read Article
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
