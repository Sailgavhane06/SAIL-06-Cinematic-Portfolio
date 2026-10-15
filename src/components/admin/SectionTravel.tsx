"use client";

import React, { useState } from "react";
import { TravelContent, TravelStory } from "@/lib/types";
import ImageUploader from "./ImageUploader";
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  Loader2,
  Check,
  ArrowUp,
  ArrowDown,
  MapPin,
  Calendar,
  X,
  Compass,
} from "lucide-react";

interface SectionTravelProps {
  initialData: TravelContent;
  onSave: (data: TravelContent) => Promise<boolean>;
}

export default function SectionTravel({ initialData, onSave }: SectionTravelProps) {
  const [data, setData] = useState<TravelContent>(initialData);
  const [editingStory, setEditingStory] = useState<TravelStory | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleStartCreate = () => {
    const newStory: TravelStory = {
      id: `travel-${Date.now()}`,
      title: "",
      location: "",
      date: new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date()),
      imageUrl: "",
      note: "",
      caption: "",
      altText: "",
      order: (data.stories?.length || 0) + 1,
      status: "published",
    };
    setEditingStory(newStory);
    setIsCreating(true);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.stories.length) return;

    const copy = [...data.stories];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);

    const reordered = copy.map((s, idx) => ({ ...s, order: idx + 1 }));
    setData((prev) => ({ ...prev, stories: reordered }));
  };

  const handleToggleStatus = (id: string) => {
    setData((prev) => ({
      ...prev,
      stories: prev.stories.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "published" ? "draft" : "published" }
          : s
      ),
    }));
  };

  const handleDeleteStory = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this travel story?")) return;
    const filtered = data.stories.filter((s) => s.id !== id);
    const reordered = filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
    setData((prev) => ({ ...prev, stories: reordered }));
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;

    if (!editingStory.title.trim()) {
      alert("Story title is required.");
      return;
    }

    if (isCreating) {
      setData((prev) => ({
        ...prev,
        stories: [...prev.stories, editingStory],
      }));
    } else {
      setData((prev) => ({
        ...prev,
        stories: prev.stories.map((s) => (s.id === editingStory.id ? editingStory : s)),
      }));
    }

    setEditingStory(null);
    setIsCreating(false);
  };

  const handleSaveAll = async () => {
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.08] gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Travelling & Field Expeditions</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage travel expedition cards, locations, photography uploads, captions, and draft status.
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
            type="button"
            onClick={handleStartCreate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#202028] hover:bg-[#282834] border border-white/[0.1] text-xs font-semibold text-white transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#FF3028]" />
            <span>Add Travel Story</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#FF3028] hover:bg-[#ff453e] disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-md cursor-pointer active:scale-95"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Travel Content</span>
          </button>
        </div>
      </div>

      {/* Headings */}
      <div className="bg-[#121216] border border-white/[0.07] rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Heading Part 1
            </label>
            <input
              type="text"
              value={data.headingPart1}
              onChange={(e) => setData({ ...data, headingPart1: e.target.value })}
              className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF3028]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Heading Highlight (Red Accent)
            </label>
            <input
              type="text"
              value={data.headingHighlight}
              onChange={(e) => setData({ ...data, headingHighlight: e.target.value })}
              className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF3028]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
            Section Description
          </label>
          <textarea
            rows={2}
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FF3028]"
          />
        </div>
      </div>

      {/* Stories list */}
      <div className="space-y-3">
        {data.stories.map((story, idx) => (
          <div
            key={story.id}
            className="bg-[#121216] border border-white/[0.07] hover:border-white/[0.15] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
          >
            <div className="flex items-center gap-4">
              {/* Order Controls */}
              <div className="flex flex-col items-center gap-1 shrink-0 text-zinc-500">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, "up")}
                  className="p-1 hover:text-white disabled:opacity-20 cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono font-bold text-zinc-400">
                  #{idx + 1}
                </span>
                <button
                  type="button"
                  disabled={idx === data.stories.length - 1}
                  onClick={() => handleMove(idx, "down")}
                  className="p-1 hover:text-white disabled:opacity-20 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Photo */}
              {story.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={story.imageUrl}
                  alt={story.altText || story.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/[0.1]"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[#18181f] border border-white/[0.1] shrink-0 flex items-center justify-center text-zinc-600">
                  <Compass className="w-6 h-6" />
                </div>
              )}

              {/* Info */}
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      story.status === "published"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {story.status}
                  </span>
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#FF3028]" />
                    <span>{story.location}</span>
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs text-zinc-500">{story.date}</span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">{story.title}</h3>
                <p className="text-xs text-zinc-400 line-clamp-1 mt-1 max-w-xl font-light">
                  {story.note}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                type="button"
                onClick={() => handleToggleStatus(story.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  story.status === "published"
                    ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20"
                    : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20"
                }`}
              >
                {story.status === "published" ? "Make Draft" : "Publish"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingStory(story);
                  setIsCreating(false);
                }}
                className="p-2 rounded-lg bg-[#1a1a22] hover:bg-[#252530] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Edit story"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleDeleteStory(story.id)}
                className="p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-red-400 transition-colors cursor-pointer"
                title="Delete story"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Story Modal */}
      {editingStory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121216] border border-white/[0.1] rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF3028]" />
                <h3 className="text-lg font-bold text-white">
                  {isCreating ? "Add Travel Story" : "Edit Travel Story"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingStory(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Story Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingStory.title}
                    onChange={(e) =>
                      setEditingStory({ ...editingStory, title: e.target.value })
                    }
                    placeholder="e.g. Alpine Ridge Exploration"
                    className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Status
                  </label>
                  <select
                    value={editingStory.status}
                    onChange={(e) =>
                      setEditingStory({
                        ...editingStory,
                        status: e.target.value as "draft" | "published",
                      })
                    }
                    className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
                  >
                    <option value="published">Published (Live)</option>
                    <option value="draft">Draft (Owner only)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Location Name
                  </label>
                  <input
                    type="text"
                    value={editingStory.location}
                    onChange={(e) =>
                      setEditingStory({ ...editingStory, location: e.target.value })
                    }
                    placeholder="e.g. Himalayan Foothills & Passes"
                    className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Travel Date
                  </label>
                  <input
                    type="text"
                    value={editingStory.date}
                    onChange={(e) =>
                      setEditingStory({ ...editingStory, date: e.target.value })
                    }
                    placeholder="e.g. September 2026"
                    className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Expedition Notes & Story
                </label>
                <textarea
                  rows={3}
                  value={editingStory.note}
                  onChange={(e) =>
                    setEditingStory({ ...editingStory, note: e.target.value })
                  }
                  placeholder="Field notes, technical tests performed, or observations..."
                  className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FF3028]"
                />
              </div>

              {/* Photo Uploader */}
              <div className="pt-2 border-t border-white/[0.06] space-y-4">
                <ImageUploader
                  label="Expedition Photograph"
                  currentImageUrl={editingStory.imageUrl}
                  onImageChange={(url) => setEditingStory({ ...editingStory, imageUrl: url })}
                  helperText="Upload a landscape photo from your journey."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Photo Caption
                    </label>
                    <input
                      type="text"
                      value={editingStory.caption || ""}
                      onChange={(e) =>
                        setEditingStory({ ...editingStory, caption: e.target.value })
                      }
                      placeholder="Short caption underneath photo..."
                      className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#FF3028]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Alternative Text
                    </label>
                    <input
                      type="text"
                      value={editingStory.altText || ""}
                      onChange={(e) =>
                        setEditingStory({ ...editingStory, altText: e.target.value })
                      }
                      placeholder="Image description for accessibility..."
                      className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#FF3028]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setEditingStory(null)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF3028] hover:bg-[#ff453e] text-white text-xs font-semibold transition-all shadow-md cursor-pointer"
                >
                  Apply to Stories
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
