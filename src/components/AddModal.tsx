"use client";

import React, { useState } from "react";
import { X, Plus, Sparkles, Layers, BookOpen, Check } from "lucide-react";
import { SiteData } from "@/data/defaultData";

export type AddCategory = "project" | "article" | "pillar";

interface AddModalProps {
  isOpen: boolean;
  initialCategory?: AddCategory;
  onClose: () => void;
  onAddProject: (newProject: SiteData["projects"][0]) => void;
  onAddArticle: (newArticle: SiteData["blog"]["articles"][0]) => void;
  onAddPillar: (newPillar: SiteData["about"]["pillars"][0]) => void;
}

export default function AddModal({
  isOpen,
  initialCategory = "project",
  onClose,
  onAddProject,
  onAddArticle,
  onAddPillar,
}: AddModalProps) {
  const [category, setCategory] = useState<AddCategory>(initialCategory);
  const [isSuccess, setIsSuccess] = useState(false);

  // Project Form State
  const [projectTitle, setProjectTitle] = useState("");
  const [projectCategory, setProjectCategory] = useState("Hardware & Embedded Systems");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectTech, setProjectTech] = useState("Next.js, TypeScript, C++");
  const [projectHighlight, setProjectHighlight] = useState("Newly Built");

  // Article Form State
  const [articleTitle, setArticleTitle] = useState("");
  const [articleCategory, setArticleCategory] = useState("Hardware Engineering");
  const [articleExcerpt, setArticleExcerpt] = useState("");
  const [articleReadTime, setArticleReadTime] = useState("5 min read");
  const [articleDate, setArticleDate] = useState(() =>
    new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
  );

  // Pillar Form State
  const [pillarTitle, setPillarTitle] = useState("");
  const [pillarDesc, setPillarDesc] = useState("");

  React.useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory, isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (category === "project") {
      if (!projectTitle.trim()) return;
      const techArray = projectTech
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      onAddProject({
        title: projectTitle.trim(),
        category: projectCategory.trim() || "Hardware & Software",
        desc: projectDesc.trim() || "Project engineered to solve real-world problems.",
        tech: techArray.length ? techArray : ["Custom Hardware", "Embedded"],
        highlight: projectHighlight.trim() || "Production Ready",
      });
      setProjectTitle("");
      setProjectDesc("");
    } else if (category === "article") {
      if (!articleTitle.trim()) return;
      onAddArticle({
        title: articleTitle.trim(),
        excerpt: articleExcerpt.trim() || "Deep-dive technical learnings and engineering observations.",
        category: articleCategory.trim() || "Engineering Insights",
        readTime: articleReadTime.trim() || "5 min read",
        date: articleDate.trim() || "October 2026",
      });
      setArticleTitle("");
      setArticleExcerpt("");
    } else if (category === "pillar") {
      if (!pillarTitle.trim()) return;
      onAddPillar({
        title: pillarTitle.trim(),
        desc: pillarDesc.trim() || "Engineering discipline focused on real-world execution.",
      });
      setPillarTitle("");
      setPillarDesc("");
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#121215] border border-white/15 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 cursor-default"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#16161b]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF3028]/15 border border-[#FF3028]/30 flex items-center justify-center text-[#FF3028]">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Add New Information
              </h3>
              <p className="text-xs text-zinc-400">
                Visible only to you. Regular viewers cannot see or add items.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label="Close add modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Selector Pills */}
        <div className="flex border-b border-white/[0.06] px-6 py-3 bg-[#141418] gap-2 overflow-x-auto">
          {[
            { id: "project" as AddCategory, label: "Add Project", icon: Layers },
            { id: "article" as AddCategory, label: "Add Blog Article", icon: BookOpen },
            { id: "pillar" as AddCategory, label: "Add Skill / Pillar", icon: Sparkles },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#FF3028] text-white shadow-[0_0_12px_rgba(255,48,40,0.35)]"
                    : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* PROJECT FORM */}
          {category === "project" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Robotic Drone System"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hardware & Embedded Systems"
                    value={projectCategory}
                    onChange={(e) => setProjectCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#FF3028]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                    Highlight Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Custom PCB Design / 99% Efficiency"
                    value={projectHighlight}
                    onChange={(e) => setProjectHighlight(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#FF3028]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Technologies (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. KiCad, STM32, C++, FreeRTOS, MQTT"
                  value={projectTech}
                  onChange={(e) => setProjectTech(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#FF3028]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Project Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain the engineering challenges, hardware/software solutions built, and impact."
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028] resize-none"
                />
              </div>
            </div>
          )}

          {/* ARTICLE FORM */}
          {category === "article" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High-Speed PCB Routing: Signal Integrity in Practice"
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hardware Engineering"
                    value={articleCategory}
                    onChange={(e) => setArticleCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#FF3028]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                    Read Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 6 min read"
                    value={articleReadTime}
                    onChange={(e) => setArticleReadTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#FF3028]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                    Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. October 2026"
                    value={articleDate}
                    onChange={(e) => setArticleDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#FF3028]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Article Excerpt / Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Short engaging abstract summarizing the key insights of this engineering note."
                  value={articleExcerpt}
                  onChange={(e) => setArticleExcerpt(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028] resize-none"
                />
              </div>
            </div>
          )}

          {/* PILLAR FORM */}
          {category === "pillar" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Skill / Discipline Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Robotics & Autonomous Systems"
                  value={pillarTitle}
                  onChange={(e) => setPillarTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Description & Impact
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your capabilities, practical experience, and what you build in this domain."
                  value={pillarDesc}
                  onChange={(e) => setPillarDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028] resize-none"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-zinc-400 hover:text-white px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#FF3028] hover:bg-[#ff453e] text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(255,48,40,0.35)] transition-all cursor-pointer active:scale-95"
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Website!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add {category === "project" ? "Project" : category === "article" ? "Article" : "Skill"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
