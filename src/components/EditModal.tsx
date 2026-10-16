"use client";

import { useState, useEffect } from "react";
import { SiteData, defaultSiteData } from "@/data/defaultData";
import {
  Pencil,
  X,
  Save,
  RotateCcw,
  Copy,
  Check,
  Type,
  Layers,
  Sparkles,
  Mail,
  EyeOff,
  Compass,
  BookOpen,
  Share2,
  Plus,
  Trash2,
} from "lucide-react";

export type EditorTab = "hero" | "about" | "projects" | "blog" | "travel" | "contact" | "social";

interface EditModalProps {
  data: SiteData;
  isOpen: boolean;
  initialTab?: EditorTab;
  onClose: () => void;
  onSave: (newData: SiteData) => void;
  onReset: () => void;
  inlineEditMode: boolean;
  onToggleInlineEdit: (enabled: boolean) => void;
  onExitOwnerMode: () => void;
}

export default function EditModal({
  data,
  isOpen,
  initialTab = "hero",
  onClose,
  onSave,
  onReset,
  inlineEditMode,
  onToggleInlineEdit,
  onExitOwnerMode,
}: EditModalProps) {
  const [formData, setFormData] = useState<SiteData>(data);
  const [activeTab, setActiveTab] = useState<EditorTab>(initialTab);
  const [copied, setCopied] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    setFormData(data);
  }, [data, isOpen]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  const handleHeroChange = (field: keyof SiteData["hero"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));
  };

  const handleAboutChange = (field: keyof SiteData["about"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        [field]: value,
      },
    }));
  };

  const handleBlogChange = (field: keyof SiteData["blog"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      blog: {
        ...prev.blog,
        [field]: value,
      },
    }));
  };

  const handleTravelChange = (field: keyof SiteData["travel"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      travel: {
        ...prev.travel,
        [field]: value,
      },
    }));
  };

  const handleContactChange = (field: keyof SiteData["contact"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));
  };

  const handleSocialChange = (field: keyof SiteData["socialLinks"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...(prev.socialLinks || defaultSiteData.socialLinks),
        [field]: value,
      },
    }));
  };

  const handleProjectChange = (
    index: number,
    field: "title" | "category" | "desc" | "highlight",
    value: string
  ) => {
    setFormData((prev) => {
      const nextProjects = [...prev.projects];
      nextProjects[index] = {
        ...nextProjects[index],
        [field]: value,
      };
      return {
        ...prev,
        projects: nextProjects,
      };
    });
  };

  const handleArticleChange = (
    index: number,
    field: "title" | "excerpt" | "category" | "readTime" | "date",
    value: string
  ) => {
    setFormData((prev) => {
      const nextArticles = [...prev.blog.articles];
      nextArticles[index] = {
        ...nextArticles[index],
        [field]: value,
      };
      return {
        ...prev,
        blog: {
          ...prev.blog,
          articles: nextArticles,
        },
      };
    });
  };

  const handleAddProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: "New Engineering Project",
          category: "Hardware & Software",
          desc: "Description of the new project, engineering challenges solved, and technical architecture.",
          tech: ["Next.js", "TypeScript", "C++"],
          highlight: "Newly Built",
        },
      ],
    }));
  };

  const handleDeleteProject = (index: number) => {
    if (confirm("Remove this project item?")) {
      setFormData((prev) => ({
        ...prev,
        projects: prev.projects.filter((_, i) => i !== index),
      }));
    }
  };

  const handleAddArticle = () => {
    const currentMonthYear = new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    setFormData((prev) => ({
      ...prev,
      blog: {
        ...prev.blog,
        articles: [
          ...prev.blog.articles,
          {
            title: "New Technical Deep Dive",
            excerpt: "Key learnings, design decisions, and hardware/software implementation insights.",
            category: "Engineering & Tech",
            readTime: "5 min read",
            date: currentMonthYear,
          },
        ],
      },
    }));
  };

  const handleDeleteArticle = (index: number) => {
    if (confirm("Remove this article?")) {
      setFormData((prev) => ({
        ...prev,
        blog: {
          ...prev.blog,
          articles: prev.blog.articles.filter((_, i) => i !== index),
        },
      }));
    }
  };

  const handleAddPillar = () => {
    setFormData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        pillars: [
          ...(prev.about.pillars || []),
          {
            title: "New Core Discipline",
            desc: "Engineering methodology and hands-on execution solving critical technical bottlenecks.",
          },
        ],
      },
    }));
  };

  const handleDeletePillar = (index: number) => {
    if (confirm("Remove this pillar?")) {
      setFormData((prev) => ({
        ...prev,
        about: {
          ...prev.about,
          pillars: prev.about.pillars.filter((_, i) => i !== index),
        },
      }));
    }
  };

  const handlePillarChange = (
    index: number,
    field: "title" | "desc",
    value: string
  ) => {
    setFormData((prev) => {
      const nextPillars = [...(prev.about.pillars || [])];
      nextPillars[index] = {
        ...nextPillars[index],
        [field]: value,
      };
      return {
        ...prev,
        about: {
          ...prev.about,
          pillars: nextPillars,
        },
      };
    });
  };

  const handleSave = () => {
    onSave(formData);
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 900);
  };

  const handleReset = () => {
    if (confirm("Reset all text to default reference values?")) {
      onReset();
      setFormData(defaultSiteData);
      onClose();
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHideOwnerMode = () => {
    if (
      confirm(
        "Hide all owner edit buttons? You can reactivate owner mode at any time by pressing Alt + E, visiting /?edit=true, or triple-clicking the SAIL.06 logo."
      )
    ) {
      onExitOwnerMode();
      onClose();
    }
  };

  return (
    <>
      {/* Floating Indicator when Inline Editing is Active */}
      {inlineEditMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[#FF3028] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl animate-pulse">
          <span className="w-2 h-2 rounded-full bg-white" />
          <span>Click any text on the page to edit directly</span>
          <button
            onClick={() => onToggleInlineEdit(false)}
            className="ml-2 bg-black/30 hover:bg-black/50 text-white rounded-full px-2 py-0.5 text-[10px]"
          >
            Done
          </button>
        </div>
      )}

      {/* Editor Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#121215] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#16161b]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FF3028]/15 border border-[#FF3028]/30 flex items-center justify-center text-[#FF3028]">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Portfolio Data & Text Editor
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Visible only to you. Regular viewers cannot see or access these edit buttons.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                aria-label="Close editor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Mode Switch & Owner Privacy Banner */}
            <div className="px-6 py-3 bg-[#18181f] border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-zinc-400" />
                <span className="text-xs text-zinc-300">
                  Direct In-Page Click-to-Edit Mode:
                </span>
                <button
                  onClick={() => onToggleInlineEdit(!inlineEditMode)}
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium transition-colors ${
                    inlineEditMode
                      ? "bg-[#FF3028] text-white"
                      : "bg-white/[0.08] text-zinc-400 hover:text-white"
                  }`}
                >
                  {inlineEditMode ? "Active" : "Off"}
                </button>
              </div>

              <button
                onClick={handleHideOwnerMode}
                className="flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-white px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                title="Hide all edit buttons so you can preview the visitor view"
              >
                <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                <span>Hide Edit Buttons (Viewer View)</span>
              </button>
            </div>

            {/* Section Tabs */}
            <div className="flex border-b border-white/[0.06] px-6 bg-[#141418] overflow-x-auto gap-2">
              {[
                { id: "hero", label: "Hero", icon: Sparkles },
                { id: "about", label: "About", icon: Layers },
                { id: "projects", label: "Projects", icon: Layers },
                { id: "blog", label: "Blog", icon: BookOpen },
                { id: "travel", label: "Travel", icon: Compass },
                { id: "contact", label: "Contact", icon: Mail },
                { id: "social", label: "Social Dock", icon: Share2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as EditorTab)}
                    className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all ${
                      isActive
                        ? "border-[#FF3028] text-white"
                        : "border-transparent text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form Fields Area */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 max-h-[58vh]">
              {/* HERO TAB */}
              {activeTab === "hero" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                        Greeting
                      </label>
                      <input
                        type="text"
                        value={formData.hero.greeting}
                        onChange={(e) => handleHeroChange("greeting", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                        Main Headline (Red)
                      </label>
                      <input
                        type="text"
                        value={formData.hero.name}
                        onChange={(e) => handleHeroChange("name", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm font-bold focus:outline-none focus:border-[#FF3028]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                      Roles Line 1
                    </label>
                    <input
                      type="text"
                      value={formData.hero.rolesLine1}
                      onChange={(e) => handleHeroChange("rolesLine1", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                      Roles Line 2
                    </label>
                    <input
                      type="text"
                      value={formData.hero.rolesLine2}
                      onChange={(e) => handleHeroChange("rolesLine2", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                        Description Line 1
                      </label>
                      <input
                        type="text"
                        value={formData.hero.descriptionLine1}
                        onChange={(e) => handleHeroChange("descriptionLine1", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                        Description Line 2
                      </label>
                      <input
                        type="text"
                        value={formData.hero.descriptionLine2}
                        onChange={(e) => handleHeroChange("descriptionLine2", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06]">
                    <span className="text-xs font-bold text-zinc-300 block mb-2">
                      Right Tagline
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={formData.hero.rightTaglineLine1}
                        onChange={(e) => handleHeroChange("rightTaglineLine1", e.target.value)}
                        className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#FF3028]"
                        placeholder="Line 1"
                      />
                      <input
                        type="text"
                        value={formData.hero.rightTaglineLine2}
                        onChange={(e) => handleHeroChange("rightTaglineLine2", e.target.value)}
                        className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#FF3028]"
                        placeholder="Line 2"
                      />
                      <input
                        type="text"
                        value={formData.hero.rightTaglineLine3}
                        onChange={(e) => handleHeroChange("rightTaglineLine3", e.target.value)}
                        className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#FF3028]"
                        placeholder="Line 3"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06]">
                    <span className="text-xs font-bold text-zinc-300 block mb-2">
                      Bottom-Left Experience Badge
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Years (e.g. 5+)</label>
                        <input
                          type="text"
                          value={formData.hero.experienceYears}
                          onChange={(e) => handleHeroChange("experienceYears", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-zinc-400 mb-1">Description Line 1</label>
                        <input
                          type="text"
                          value={formData.hero.experienceLine1}
                          onChange={(e) => handleHeroChange("experienceLine1", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#FF3028]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ABOUT TAB */}
              {activeTab === "about" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                        Quote Part 1
                      </label>
                      <input
                        type="text"
                        value={formData.about.quotePart1}
                        onChange={(e) => handleAboutChange("quotePart1", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                        Quote Highlight (Red)
                      </label>
                      <input
                        type="text"
                        value={formData.about.quoteHighlight}
                        onChange={(e) => handleAboutChange("quoteHighlight", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm font-bold focus:outline-none focus:border-[#FF3028]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                      Biography
                    </label>
                    <textarea
                      rows={3}
                      value={formData.about.bio}
                      onChange={(e) => handleAboutChange("bio", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028] resize-none"
                    />
                  </div>

                  {/* Pillars / Core Disciplines List */}
                  <div className="pt-3 border-t border-white/[0.06] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-300">
                        Engineering Pillars & Disciplines ({formData.about.pillars?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={handleAddPillar}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-[#FF3028]/15 hover:bg-[#FF3028] text-[#FF3028] hover:text-white border border-[#FF3028]/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Pillar</span>
                      </button>
                    </div>

                    {formData.about.pillars?.map((pillar, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#FF3028]">
                            Pillar #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeletePillar(idx)}
                            className="text-zinc-500 hover:text-red-400 p-1 rounded transition-colors"
                            title="Delete pillar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={pillar.title}
                          onChange={(e) => handlePillarChange(idx, "title", e.target.value)}
                          placeholder="Pillar Title"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs font-semibold focus:outline-none focus:border-[#FF3028]"
                        />
                        <textarea
                          rows={2}
                          value={pillar.desc}
                          onChange={(e) => handlePillarChange(idx, "desc", e.target.value)}
                          placeholder="Description"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#FF3028] resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROJECTS TAB */}
              {activeTab === "projects" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Featured Projects ({formData.projects.length})
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        Add or modify projects displayed on the homepage.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddProject}
                      className="flex items-center gap-1.5 text-xs font-semibold bg-[#FF3028] hover:bg-[#ff453e] text-white px-3.5 py-1.5 rounded-xl shadow-[0_0_15px_rgba(255,48,40,0.3)] transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Project</span>
                    </button>
                  </div>

                  {formData.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-[#FF3028]">
                        <span>Project #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(idx)}
                          className="text-zinc-500 hover:text-red-400 p-1 rounded transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => handleProjectChange(idx, "title", e.target.value)}
                          placeholder="Project Title"
                          className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                        />
                        <input
                          type="text"
                          value={proj.category}
                          onChange={(e) => handleProjectChange(idx, "category", e.target.value)}
                          placeholder="Category"
                          className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#FF3028]"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={proj.desc}
                        onChange={(e) => handleProjectChange(idx, "desc", e.target.value)}
                        placeholder="Project Description"
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#FF3028] resize-none"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="w-full py-2.5 border border-dashed border-white/20 hover:border-[#FF3028] text-zinc-400 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#FF3028]" />
                    <span>+ Add Another Project</span>
                  </button>
                </div>
              )}

              {/* BLOG TAB */}
              {activeTab === "blog" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Articles & Notes ({formData.blog.articles.length})
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        Add or modify engineering posts and insights.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddArticle}
                      className="flex items-center gap-1.5 text-xs font-semibold bg-[#FF3028] hover:bg-[#ff453e] text-white px-3.5 py-1.5 rounded-xl shadow-[0_0_15px_rgba(255,48,40,0.3)] transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Article</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                        Section Heading
                      </label>
                      <input
                        type="text"
                        value={formData.blog.heading}
                        onChange={(e) => handleBlogChange("heading", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={formData.blog.description}
                        onChange={(e) => handleBlogChange("description", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    {formData.blog.articles.map((art, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-[#FF3028]">
                          <span>Article #{idx + 1}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-zinc-500 font-mono text-[11px]">{art.date}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteArticle(idx)}
                              className="text-zinc-500 hover:text-red-400 p-1 rounded transition-colors"
                              title="Delete article"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={art.title}
                          onChange={(e) => handleArticleChange(idx, "title", e.target.value)}
                          placeholder="Article Title"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                        />
                        <textarea
                          rows={2}
                          value={art.excerpt}
                          onChange={(e) => handleArticleChange(idx, "excerpt", e.target.value)}
                          placeholder="Article Excerpt"
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-[#FF3028] resize-none"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddArticle}
                    className="w-full py-2.5 border border-dashed border-white/20 hover:border-[#FF3028] text-zinc-400 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#FF3028]" />
                    <span>+ Add Another Article</span>
                  </button>
                </div>
              )}

              {/* TRAVEL TAB */}
              {activeTab === "travel" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                        Heading Part 1
                      </label>
                      <input
                        type="text"
                        value={formData.travel.headingPart1}
                        onChange={(e) => handleTravelChange("headingPart1", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                        Heading Highlight (Red)
                      </label>
                      <input
                        type="text"
                        value={formData.travel.headingHighlight}
                        onChange={(e) => handleTravelChange("headingHighlight", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm font-bold focus:outline-none focus:border-[#FF3028]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                      Section Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.travel.description}
                      onChange={(e) => handleTravelChange("description", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/[0.06]">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                        Follow Banner Title
                      </label>
                      <input
                        type="text"
                        value={formData.travel.followTitle}
                        onChange={(e) => handleTravelChange("followTitle", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                        Follow Banner Subtitle
                      </label>
                      <input
                        type="text"
                        value={formData.travel.followSubtitle}
                        onChange={(e) => handleTravelChange("followSubtitle", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CONTACT TAB */}
              {activeTab === "contact" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                        Direct Email
                      </label>
                      <input
                        type="email"
                        value={formData.contact.email}
                        onChange={(e) => handleContactChange("email", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.contact.location}
                        onChange={(e) => handleContactChange("location", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                      Contact Subtitle
                    </label>
                    <textarea
                      rows={2}
                      value={formData.contact.description}
                      onChange={(e) => handleContactChange("description", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028] resize-none"
                    />
                  </div>
                </div>
              )}

              {/* SOCIAL MEDIA DOCK TAB */}
              {activeTab === "social" && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-[#FF3028]/10 border border-[#FF3028]/20 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#FF3028] mt-1.5 shrink-0" />
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      These links populate your floating vertical social dock on the right side.
                      When visitors click an icon, your linked profile opens in a new tab.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                      1. Instagram Profile URL
                    </label>
                    <input
                      type="text"
                      value={formData.socialLinks?.instagram || ""}
                      onChange={(e) => handleSocialChange("instagram", e.target.value)}
                      placeholder="https://instagram.com/yourusername"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                      2. YouTube Channel URL
                    </label>
                    <input
                      type="text"
                      value={formData.socialLinks?.youtube || ""}
                      onChange={(e) => handleSocialChange("youtube", e.target.value)}
                      placeholder="https://youtube.com/@yourchannel"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                      3. Facebook Profile / Page URL
                    </label>
                    <input
                      type="text"
                      value={formData.socialLinks?.facebook || ""}
                      onChange={(e) => handleSocialChange("facebook", e.target.value)}
                      placeholder="https://facebook.com/yourpage"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                      4. WhatsApp (Phone Number or Chat Link)
                    </label>
                    <input
                      type="text"
                      value={formData.socialLinks?.whatsapp || ""}
                      onChange={(e) => handleSocialChange("whatsapp", e.target.value)}
                      placeholder="+91 9999999999 or https://wa.me/919999999999"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                      5. X (formerly Twitter) URL
                    </label>
                    <input
                      type="text"
                      value={formData.socialLinks?.x || ""}
                      onChange={(e) => handleSocialChange("x", e.target.value)}
                      placeholder="https://x.com/yourhandle"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#FF3028]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 border-t border-white/[0.08] bg-[#16161b] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied JSON!" : "Copy JSON"}</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="text-xs text-zinc-400 hover:text-white px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-[#FF3028] hover:bg-[#ff453e] text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(255,48,40,0.35)] transition-all cursor-pointer active:scale-95"
                >
                  {savedMessage ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  <span>{savedMessage ? "Applied!" : "Save & Apply Changes"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
