"use client";

import React, { useState, useEffect } from "react";
import { SiteContent } from "@/lib/types";
import SectionHeroAbout from "@/components/admin/SectionHeroAbout";
import SectionEngineering from "@/components/admin/SectionEngineering";
import SectionFounder from "@/components/admin/SectionFounder";
import SectionBlog from "@/components/admin/SectionBlog";
import SectionProjects from "@/components/admin/SectionProjects";
import SectionTravel from "@/components/admin/SectionTravel";
import SectionContact from "@/components/admin/SectionContact";
import {
  User,
  Cpu,
  Briefcase,
  BookOpen,
  FolderGit2,
  Plane,
  Mail,
  RotateCcw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";

type AdminTab =
  | "about"
  | "engineering"
  | "founder"
  | "blog"
  | "projects"
  | "travel"
  | "contact";

export default function AdminDashboardPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("about");
  const [globalNotice, setGlobalNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load complete admin data on mount
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/content");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to load admin content");
      }
      setContent(json.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error connecting to content service";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save specific section
  const handleSaveSection = async (section: keyof SiteContent, data: unknown): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Save operation rejected by server");
      }

      setContent(result.data);
      showNotice("success", `Changes saved to database and live.`);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to persist changes";
      showNotice("error", msg);
      return false;
    }
  };

  const showNotice = (type: "success" | "error", text: string) => {
    setGlobalNotice({ type, text });
    setTimeout(() => setGlobalNotice(null), 4000);
  };

  const handleResetToDefaults = async () => {
    if (
      !window.confirm(
        "WARNING: This will reset all portfolio sections to factory defaults. All customized text and uploaded image links will be reverted. Do you wish to continue?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      // We can trigger reset through content PUT with initial content
      const res = await fetch("/api/content");
      const defaultData = await res.json();
      if (defaultData.data) {
        await fetch("/api/admin/content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: defaultData.data }),
        });
      }
      await loadData();
      showNotice("success", "Reset completed. Content reloaded.");
    } catch {
      showNotice("error", "Failed to reset content.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !content) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF3028]" />
        <p className="text-xs uppercase tracking-wider font-mono">Loading encrypted portfolio content...</p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center p-6">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <h3 className="text-lg font-bold text-white">Failed to connect to content store</h3>
        <p className="text-xs text-zinc-400 max-w-md">{error || "Unknown storage error occurred"}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 rounded-xl bg-[#202028] hover:bg-[#282834] text-xs font-semibold text-white cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  const tabs: Array<{ id: AdminTab; label: string; icon: React.ElementType }> = [
    { id: "about", label: "About & Hero", icon: User },
    { id: "engineering", label: "Engineering", icon: Cpu },
    { id: "founder", label: "Founder & Ventures", icon: Briefcase },
    { id: "blog", label: "Blog & Notes", icon: BookOpen },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "travel", label: "Travelling", icon: Plane },
    { id: "contact", label: "Contact & Social", icon: Mail },
  ];

  // Quick stats
  const publishedProjects = content.projects?.filter((p) => p.status === "published").length || 0;
  const draftProjects = (content.projects?.length || 0) - publishedProjects;
  const publishedArticles = content.blog?.articles?.filter((a) => a.status === "published").length || 0;
  const draftArticles = (content.blog?.articles?.length || 0) - publishedArticles;
  const publishedStories = content.travel?.stories?.filter((s) => s.status === "published").length || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner & Quick Metrics */}
      <div className="bg-[#121216] border border-white/[0.08] rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              SYSTEM LIVE & PERSISTENT
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Portfolio Content Management
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Directly update text, upload photos, and control draft visibility across all portfolio sections.
          </p>
        </div>

        {/* Metrics Row */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="px-3.5 py-2 rounded-xl bg-[#18181f] border border-white/[0.06]">
            <span className="text-zinc-500">Projects: </span>
            <span className="text-emerald-400 font-bold">{publishedProjects} Live</span>
            {draftProjects > 0 && <span className="text-amber-400 ml-1">({draftProjects} Draft)</span>}
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-[#18181f] border border-white/[0.06]">
            <span className="text-zinc-500">Articles: </span>
            <span className="text-emerald-400 font-bold">{publishedArticles} Live</span>
            {draftArticles > 0 && <span className="text-amber-400 ml-1">({draftArticles} Draft)</span>}
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-[#18181f] border border-white/[0.06]">
            <span className="text-zinc-500">Expeditions: </span>
            <span className="text-emerald-400 font-bold">{publishedStories} Stories</span>
          </div>

          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs"
            title="Reset all sections to default data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Global Notice Toast */}
      {globalNotice && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-medium animate-in slide-in-from-top duration-200 ${
            globalNotice.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
              : "bg-red-950/40 border-red-500/30 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {globalNotice.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{globalNotice.text}</span>
          </div>
          <button
            onClick={() => setGlobalNotice(null)}
            className="text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/[0.08]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-[#FF3028] text-white shadow-md shadow-[#FF3028]/20"
                  : "bg-[#141419] hover:bg-[#1c1c24] text-zinc-400 hover:text-white border border-white/[0.05]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panes */}
      <div className="pt-2">
        {activeTab === "about" && (
          <SectionHeroAbout
            initialHero={content.hero}
            initialAbout={content.about}
            onSave={async (hero, about) => {
              const resHero = await handleSaveSection("hero", hero);
              const resAbout = await handleSaveSection("about", about);
              return resHero && resAbout;
            }}
          />
        )}

        {activeTab === "engineering" && (
          <SectionEngineering
            initialData={content.engineering}
            onSave={(engineering) => handleSaveSection("engineering", engineering)}
          />
        )}

        {activeTab === "founder" && (
          <SectionFounder
            initialData={content.founder}
            onSave={(founder) => handleSaveSection("founder", founder)}
          />
        )}

        {activeTab === "blog" && (
          <SectionBlog
            initialData={content.blog}
            onSave={(blog) => handleSaveSection("blog", blog)}
          />
        )}

        {activeTab === "projects" && (
          <SectionProjects
            initialData={content.projects}
            onSave={(projects) => handleSaveSection("projects", projects)}
          />
        )}

        {activeTab === "travel" && (
          <SectionTravel
            initialData={content.travel}
            onSave={(travel) => handleSaveSection("travel", travel)}
          />
        )}

        {activeTab === "contact" && (
          <SectionContact
            initialData={content.contact}
            onSave={(contact) => handleSaveSection("contact", contact)}
          />
        )}
      </div>
    </div>
  );
}
