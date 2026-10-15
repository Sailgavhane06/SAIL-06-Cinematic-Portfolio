"use client";

import React, { useState } from "react";
import { FounderContent, FounderMilestone } from "@/lib/types";
import { Plus, Trash2, Save, Loader2, Check } from "lucide-react";

interface SectionFounderProps {
  initialData: FounderContent;
  onSave: (data: FounderContent) => Promise<boolean>;
}

export default function SectionFounder({
  initialData,
  onSave,
}: SectionFounderProps) {
  const [data, setData] = useState<FounderContent>(initialData);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddMilestone = () => {
    const newM: FounderMilestone = {
      id: `milestone-${Date.now()}`,
      year: new Date().getFullYear().toString(),
      title: "New Venture Milestone",
      description: "Description of company launch, product ship, or funding round.",
      link: "#",
    };
    setData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, newM],
    }));
  };

  const handleUpdateMilestone = (id: string, field: keyof FounderMilestone, value: string) => {
    setData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    }));
  };

  const handleDeleteMilestone = (id: string) => {
    setData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((m) => m.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    const success = await onSave(data);
    setSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Action Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl font-bold text-white">Founder & Ventures Section</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your founder philosophy, mission statement, startup milestones, and call to action.
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
            <span>Save Founder Content</span>
          </button>
        </div>
      </div>

      <div className="bg-[#121216] border border-white/[0.07] rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Section Heading
          </label>
          <input
            type="text"
            value={data.heading}
            onChange={(e) => setData({ ...data, heading: e.target.value })}
            className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Founder Mission Statement
          </label>
          <textarea
            rows={2}
            value={data.missionStatement}
            onChange={(e) => setData({ ...data, missionStatement: e.target.value })}
            className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#FF3028] font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Founder Story & Approach
          </label>
          <textarea
            rows={3}
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#FF3028]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Call to Action Button Text
            </label>
            <input
              type="text"
              value={data.ctaText || ""}
              onChange={(e) => setData({ ...data, ctaText: e.target.value })}
              placeholder="e.g. Explore Joint Ventures"
              className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Call to Action Link Target
            </label>
            <input
              type="text"
              value={data.ctaLink || ""}
              onChange={(e) => setData({ ...data, ctaLink: e.target.value })}
              placeholder="e.g. #contact"
              className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
            />
          </div>
        </div>

        {/* Milestones */}
        <div className="pt-6 border-t border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Startup Milestones & Timeline</h4>
              <p className="text-xs text-zinc-400">Chronological track record of ventures and deployments.</p>
            </div>
            <button
              type="button"
              onClick={handleAddMilestone}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202028] hover:bg-[#282834] border border-white/[0.1] text-xs font-medium text-white transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF3028]" />
              <span>Add Milestone</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="bg-[#18181f] border border-white/[0.08] rounded-xl p-4 space-y-3 relative"
              >
                <div className="flex items-center justify-between gap-4">
                  <input
                    type="text"
                    value={milestone.year}
                    onChange={(e) => handleUpdateMilestone(milestone.id, "year", e.target.value)}
                    placeholder="Year (e.g. 2026)"
                    className="w-24 bg-[#121216] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs font-bold text-[#FF3028] focus:outline-none focus:border-[#FF3028]"
                  />
                  <input
                    type="text"
                    value={milestone.title}
                    onChange={(e) => handleUpdateMilestone(milestone.id, "title", e.target.value)}
                    placeholder="Milestone Title"
                    className="flex-1 bg-[#121216] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-[#FF3028]"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteMilestone(milestone.id)}
                    className="text-zinc-500 hover:text-red-400 p-1 cursor-pointer"
                    title="Delete milestone"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <textarea
                  rows={2}
                  value={milestone.description}
                  onChange={(e) => handleUpdateMilestone(milestone.id, "description", e.target.value)}
                  placeholder="Milestone description..."
                  className="w-full bg-[#121216] border border-white/[0.08] rounded-lg p-2.5 text-xs text-zinc-300 focus:outline-none focus:border-[#FF3028]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
