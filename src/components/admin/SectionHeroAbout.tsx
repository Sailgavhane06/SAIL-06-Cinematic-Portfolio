"use client";

import React, { useState } from "react";
import { HeroContent, AboutContent, AboutPillar } from "@/lib/types";
import ImageUploader from "./ImageUploader";
import { Plus, Trash2, Save, Loader2, Check } from "lucide-react";

interface SectionHeroAboutProps {
  initialHero: HeroContent;
  initialAbout: AboutContent;
  onSave: (hero: HeroContent, about: AboutContent) => Promise<boolean>;
}

export default function SectionHeroAbout({
  initialHero,
  initialAbout,
  onSave,
}: SectionHeroAboutProps) {
  const [hero, setHero] = useState<HeroContent>(initialHero);
  const [about, setAbout] = useState<AboutContent>(initialAbout);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    if (initialHero) setHero(initialHero);
    if (initialAbout) setAbout(initialAbout);
  }, [initialHero, initialAbout]);

  // Pillar management
  const handleAddPillar = () => {
    const newPillar: AboutPillar = {
      id: `pillar-${Date.now()}`,
      title: "New Expertise / Pillar",
      desc: "Detailed description of engineering or creative expertise.",
    };
    setAbout((prev) => ({
      ...prev,
      pillars: [...prev.pillars, newPillar],
    }));
  };

  const handleUpdatePillar = (id: string, field: "title" | "desc", value: string) => {
    setAbout((prev) => ({
      ...prev,
      pillars: prev.pillars.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  };

  const handleDeletePillar = (id: string) => {
    if (about.pillars.length <= 1) {
      alert("At least one pillar is required.");
      return;
    }
    setAbout((prev) => ({
      ...prev,
      pillars: prev.pillars.filter((p) => p.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    const success = await onSave(hero, about);
    setSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Action Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl font-bold text-white">Hero & About Sections</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Edit introductory titles, hero portrait photo, personal biography, and expertise pillars.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>Saved to database</span>
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF3028] hover:bg-[#ff453e] disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-md cursor-pointer active:scale-95"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Hero Configuration */}
      <div className="bg-[#121216] border border-white/[0.07] rounded-2xl p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF3028]" />
          <span>Hero Banner Content & Portrait</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Greeting Text
            </label>
            <input
              type="text"
              value={hero.greeting}
              onChange={(e) => setHero({ ...hero, greeting: e.target.value })}
              className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={hero.name}
              onChange={(e) => setHero({ ...hero, name: e.target.value })}
              className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Roles Line 1
            </label>
            <input
              type="text"
              value={hero.rolesLine1}
              onChange={(e) => setHero({ ...hero, rolesLine1: e.target.value })}
              className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Roles Line 2
            </label>
            <input
              type="text"
              value={hero.rolesLine2}
              onChange={(e) => setHero({ ...hero, rolesLine2: e.target.value })}
              className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Description Line 1
            </label>
            <input
              type="text"
              value={hero.descriptionLine1}
              onChange={(e) => setHero({ ...hero, descriptionLine1: e.target.value })}
              className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Description Line 2
            </label>
            <input
              type="text"
              value={hero.descriptionLine2}
              onChange={(e) => setHero({ ...hero, descriptionLine2: e.target.value })}
              className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
            />
          </div>
        </div>

        {/* Hero Portrait Photo */}
        <div className="pt-4 border-t border-white/[0.06]">
          <ImageUploader
            label="Hero Cinematic Portrait Photo"
            currentImageUrl={hero.portraitImage || "/sail-portrait.jpg"}
            onImageChange={(url) => setHero({ ...hero, portraitImage: url })}
            helperText="Upload a high-resolution dark portrait photo. Recommended format: PNG or WebP with clean background integration."
          />
        </div>
      </div>

      {/* About Section Configuration */}
      <div className="bg-[#121216] border border-white/[0.07] rounded-2xl p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF3028]" />
          <span>About Biography & Philosophy Quote</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Quote Part 1 (White Text)
            </label>
            <input
              type="text"
              value={about.quotePart1}
              onChange={(e) => setAbout({ ...about, quotePart1: e.target.value })}
              placeholder="I don't just learn things."
              className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Quote Highlight (Red Accent Text)
            </label>
            <input
              type="text"
              value={about.quoteHighlight}
              onChange={(e) => setAbout({ ...about, quoteHighlight: e.target.value })}
              placeholder="I build things."
              className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Main Biography Paragraph
          </label>
          <textarea
            rows={4}
            value={about.bio}
            onChange={(e) => setAbout({ ...about, bio: e.target.value })}
            className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#FF3028] leading-relaxed"
          />
        </div>

        {/* About Profile Photo */}
        <div className="pt-4 border-t border-white/[0.06]">
          <ImageUploader
            label="About Profile Photo"
            currentImageUrl={about.profilePhoto || "/sail-portrait.jpg"}
            onImageChange={(url) => setAbout({ ...about, profilePhoto: url })}
            helperText="Dedicated profile image for the About biography section."
          />
        </div>

        {/* Pillars / Competencies */}
        <div className="pt-6 border-t border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Engineering Pillars & Competencies</h4>
              <p className="text-xs text-zinc-400">Cards displayed in the 4-column about grid.</p>
            </div>
            <button
              type="button"
              onClick={handleAddPillar}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202028] hover:bg-[#282834] border border-white/[0.1] text-xs font-medium text-white transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF3028]" />
              <span>Add Pillar</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {about.pillars.map((pillar, idx) => (
              <div
                key={pillar.id || idx}
                className="bg-[#18181f] border border-white/[0.08] rounded-xl p-4 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF3028]">
                    Pillar #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeletePillar(pillar.id)}
                    className="text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete pillar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={pillar.title}
                  onChange={(e) => handleUpdatePillar(pillar.id, "title", e.target.value)}
                  placeholder="Pillar Title"
                  className="w-full bg-[#121216] border border-white/[0.08] rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#FF3028]"
                />

                <textarea
                  rows={2}
                  value={pillar.desc}
                  onChange={(e) => handleUpdatePillar(pillar.id, "desc", e.target.value)}
                  placeholder="Pillar description..."
                  className="w-full bg-[#121216] border border-white/[0.08] rounded-lg p-2.5 text-xs text-zinc-300 focus:outline-none focus:border-[#FF3028]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
        {saveSuccess ? (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Saved to database and live</span>
          </span>
        ) : (
          <span className="text-xs text-zinc-500 font-mono">Hero & About Section</span>
        )}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF3028] hover:bg-[#ff453e] disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-md cursor-pointer active:scale-95"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Saving to Database..." : "Save Changes"}</span>
        </button>
      </div>
    </form>
  );
}
