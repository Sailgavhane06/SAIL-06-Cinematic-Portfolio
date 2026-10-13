"use client";

import { useState, useEffect } from "react";
import { SiteData, defaultSiteData } from "@/data/defaultData";
import {
  Edit3,
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
} from "lucide-react";

interface EditModalProps {
  data: SiteData;
  isOpen: boolean;
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
  onClose,
  onSave,
  onReset,
  inlineEditMode,
  onToggleInlineEdit,
  onExitOwnerMode,
}: EditModalProps) {
  const [formData, setFormData] = useState<SiteData>(data);
  const [activeTab, setActiveTab] = useState<"hero" | "about" | "projects" | "contact">("hero");
  const [copied, setCopied] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    setFormData(data);
  }, [data, isOpen]);

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

  const handleContactChange = (field: keyof SiteData["contact"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
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
    if (confirm("Hide Edit button? You can reactivate it at any time by pressing Alt + E or visiting /?edit=true or triple-clicking the SAIL.06 logo.")) {
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
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Portfolio Data & Text Editor
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Visible only to you. Regular visitors cannot see or access this editor.
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
                title="Hide edit button so you can preview the visitor view"
              >
                <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                <span>Hide Button (Visitor View)</span>
              </button>
            </div>

            {/* Section Tabs */}
            <div className="flex border-b border-white/[0.06] px-6 bg-[#141418] overflow-x-auto gap-2">
              {[
                { id: "hero", label: "Hero Section", icon: Sparkles },
                { id: "about", label: "About", icon: Layers },
                { id: "projects", label: "Projects", icon: Layers },
                { id: "contact", label: "Contact", icon: Mail },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
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
                </div>
              )}

              {/* PROJECTS TAB */}
              {activeTab === "projects" && (
                <div className="space-y-5">
                  {formData.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-[#FF3028]">
                        <span>Project #{idx + 1}</span>
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
