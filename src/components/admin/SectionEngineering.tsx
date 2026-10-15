"use client";

import React, { useState } from "react";
import { EngineeringContent, EngineeringStat } from "@/lib/types";
import { Plus, Trash2, Save, Loader2, Check } from "lucide-react";

interface SectionEngineeringProps {
  initialData: EngineeringContent;
  onSave: (data: EngineeringContent) => Promise<boolean>;
}

export default function SectionEngineering({
  initialData,
  onSave,
}: SectionEngineeringProps) {
  const [data, setData] = useState<EngineeringContent>(initialData);
  const [newHighlight, setNewHighlight] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    setData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, newHighlight.trim()],
    }));
    setNewHighlight("");
  };

  const handleRemoveHighlight = (idx: number) => {
    setData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== idx),
    }));
  };

  const handleAddStat = () => {
    const newStat: EngineeringStat = {
      label: "Metric Name",
      value: "99%",
    };
    setData((prev) => ({
      ...prev,
      stats: [...(prev.stats || []), newStat],
    }));
  };

  const handleUpdateStat = (idx: number, field: "label" | "value", value: string) => {
    setData((prev) => ({
      ...prev,
      stats: (prev.stats || []).map((stat, i) =>
        i === idx ? { ...stat, [field]: value } : stat
      ),
    }));
  };

  const handleRemoveStat = (idx: number) => {
    setData((prev) => ({
      ...prev,
      stats: (prev.stats || []).filter((_, i) => i !== idx),
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
          <h2 className="text-xl font-bold text-white">Engineering Architecture Section</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Configure technical headings, systems overview, engineering highlights, and metrics.
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
            <span>Save Engineering</span>
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
            Technical Description
          </label>
          <textarea
            rows={3}
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#FF3028]"
          />
        </div>

        {/* Highlights List */}
        <div className="pt-4 border-t border-white/[0.06] space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Technical Competencies & Highlights
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              placeholder="e.g. High-speed circuit design and impedance matching"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddHighlight();
                }
              }}
              className="flex-1 bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
            />
            <button
              type="button"
              onClick={handleAddHighlight}
              className="px-4 py-2.5 rounded-xl bg-[#202028] hover:bg-[#282834] border border-white/[0.1] text-xs font-medium text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF3028]" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2 mt-3">
            {data.highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-[#18181f] border border-white/[0.06] text-xs text-zinc-300"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF3028]" />
                  <span>{h}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveHighlight(i)}
                  className="text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Engineering Stats */}
        <div className="pt-4 border-t border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Technical Metrics / Proof Points
            </label>
            <button
              type="button"
              onClick={handleAddStat}
              className="text-xs text-[#FF3028] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Add Metric</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(data.stats || []).map((stat, i) => (
              <div
                key={i}
                className="bg-[#18181f] border border-white/[0.08] rounded-xl p-3 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-mono">Metric #{i + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStat(i)}
                    className="text-zinc-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => handleUpdateStat(i, "value", e.target.value)}
                  placeholder="Value (e.g. 100+)"
                  className="w-full bg-[#121216] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-[#FF3028]"
                />
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => handleUpdateStat(i, "label", e.target.value)}
                  placeholder="Label (e.g. Hardware Iterations)"
                  className="w-full bg-[#121216] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-zinc-400 focus:outline-none focus:border-[#FF3028]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
