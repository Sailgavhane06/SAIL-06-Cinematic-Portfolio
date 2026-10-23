"use client";

import React, { useState } from "react";
import { TravelContent, TravelStory, PublicationStatus, TravelFollower } from "@/lib/types";
import ImageUploader from "./ImageUploader";
import {
  Plus,
  Trash2,
  Pencil,
  Save,
  Loader2,
  Check,
  ArrowUp,
  ArrowDown,
  MapPin,
  Calendar,
  X,
  Compass,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Mail,
  Users,
  ClipboardCopy,
  Shield,
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
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [copiedEmails, setCopiedEmails] = useState(false);
  const [deletingFollowerId, setDeletingFollowerId] = useState<string | null>(null);

  // Sync if parent updates
  React.useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const handleDeleteFollower = async (followerId: string) => {
    if (!window.confirm("Remove this follower from the expedition list?")) return;
    setDeletingFollowerId(followerId);
    const currentFollowers = data.followers || [];
    const updatedFollowers = currentFollowers.filter((f) => f.id !== followerId);
    const nextData = { ...data, followers: updatedFollowers };
    setData(nextData);

    setSaving(true);
    const ok = await onSave(nextData);
    setSaving(false);
    setDeletingFollowerId(null);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const handleCopyAllEmails = () => {
    const emails = (data.followers || []).map((f) => f.email).filter(Boolean).join(", ");
    if (!emails) return;
    navigator.clipboard.writeText(emails);
    setCopiedEmails(true);
    setTimeout(() => setCopiedEmails(false), 2500);
  };

  const handleStartCreate = () => {
    const newStory: TravelStory = {
      id: `travel-${Date.now()}`,
      title: "",
      slug: `expedition-${Date.now()}`,
      destination: "",
      location: "",
      travelDate: new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date()),
      date: new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date()),
      coverImage: "",
      imageUrl: "",
      shortDescription: "",
      note: "",
      fullDescription: "",
      caption: "",
      altText: "",
      galleryImages: [],
      featured: (data.stories?.length || 0) === 0,
      order: (data.stories?.length || 0) + 1,
      status: "published",
    };
    setEditingStory(newStory);
    setIsCreating(true);
    setNewGalleryUrl("");
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.stories.length) return;

    const copy = [...data.stories];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);

    const reordered = copy.map((s, idx) => ({ ...s, order: idx + 1 }));
    const nextData = { ...data, stories: reordered };
    setData(nextData);

    setSaving(true);
    const ok = await onSave(nextData);
    setSaving(false);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleToggleStatus = async (id: string) => {
    const updated = data.stories.map((s) =>
      s.id === id
        ? { ...s, status: (s.status === "published" ? "draft" : "published") as PublicationStatus }
        : s
    );
    const nextData = { ...data, stories: updated };
    setData(nextData);

    setSaving(true);
    const ok = await onSave(nextData);
    setSaving(false);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    const updated = data.stories.map((s) => ({
      ...s,
      featured: s.id === id,
    }));
    const nextData = { ...data, stories: updated };
    setData(nextData);

    setSaving(true);
    const ok = await onSave(nextData);
    setSaving(false);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleDeleteStory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this travel story?")) return;
    const filtered = data.stories.filter((s) => s.id !== id);
    const reordered = filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
    const nextData = { ...data, stories: reordered };
    setData(nextData);

    setSaving(true);
    const ok = await onSave(nextData);
    setSaving(false);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleAddGalleryImage = (urlToAdd: string) => {
    if (!editingStory || !urlToAdd.trim()) return;
    const currentList = editingStory.galleryImages || [];
    setEditingStory({
      ...editingStory,
      galleryImages: [...currentList, urlToAdd.trim()],
    });
    setNewGalleryUrl("");
  };

  const handleRemoveGalleryImage = (idxToRemove: number) => {
    if (!editingStory) return;
    const currentList = editingStory.galleryImages || [];
    setEditingStory({
      ...editingStory,
      galleryImages: currentList.filter((_, idx) => idx !== idxToRemove),
    });
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;

    if (!editingStory.title.trim()) {
      alert("Story title is required.");
      return;
    }

    const normalizedStory: TravelStory = {
      ...editingStory,
      location: editingStory.destination || editingStory.location,
      date: editingStory.travelDate || editingStory.date,
      imageUrl: editingStory.coverImage || editingStory.imageUrl,
      note: editingStory.shortDescription || editingStory.note,
      slug:
        editingStory.slug ||
        editingStory.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };

    let nextStories: TravelStory[];
    if (isCreating) {
      let stories = [...data.stories];
      if (normalizedStory.featured) {
        stories = stories.map((s) => ({ ...s, featured: false }));
      }
      nextStories = [...stories, normalizedStory];
    } else {
      let stories = data.stories.map((s) => (s.id === normalizedStory.id ? normalizedStory : s));
      if (normalizedStory.featured) {
        stories = stories.map((s) => (s.id === normalizedStory.id ? s : { ...s, featured: false }));
      }
      nextStories = stories;
    }

    const nextData = {
      ...data,
      stories: nextStories,
    };

    setData(nextData);
    setEditingStory(null);
    setIsCreating(false);

    // Persist immediately to database and public website
    setSaving(true);
    const success = await onSave(nextData);
    setSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
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
              {story.coverImage || story.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={story.coverImage || story.imageUrl}
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
                <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      story.status === "published"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {story.status}
                  </span>

                  {story.featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF3028]/15 text-[#FF3028] border border-[#FF3028]/30">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </span>
                  )}

                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#FF3028]" />
                    <span>{story.destination || story.location}</span>
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs text-zinc-500">{story.travelDate || story.date}</span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">{story.title}</h3>
                <p className="text-xs text-zinc-400 line-clamp-1 mt-1 max-w-xl font-light">
                  {story.shortDescription || story.note}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                type="button"
                onClick={() => handleToggleFeatured(story.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  story.featured
                    ? "bg-[#FF3028] text-white"
                    : "bg-[#1a1a22] hover:bg-[#252530] text-zinc-300"
                }`}
                title="Toggle featured status"
              >
                {story.featured ? "Featured ★" : "Set Featured"}
              </button>

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
                  setEditingStory({
                    ...story,
                    destination: story.destination || story.location || "",
                    travelDate: story.travelDate || story.date || "",
                    coverImage: story.coverImage || story.imageUrl || "",
                    shortDescription: story.shortDescription || story.note || "",
                    fullDescription: story.fullDescription || story.shortDescription || story.note || "",
                    galleryImages: story.galleryImages || [],
                  });
                  setIsCreating(false);
                }}
                className="p-2 rounded-lg bg-[#1a1a22] hover:bg-[#252530] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Edit story"
              >
                <Pencil className="w-3.5 h-3.5 text-[#FF3028]" />
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

      {/* Bottom Save & Add Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-white/[0.08]">
        <button
          type="button"
          onClick={handleStartCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#202028] hover:bg-[#282834] border border-white/[0.1] text-xs font-semibold text-white transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#FF3028]" />
          <span>Add Another Journey</span>
        </button>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF3028] hover:bg-[#ff453e] disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-md cursor-pointer active:scale-95"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Saving to Database..." : "Save All Stories"}</span>
        </button>
      </div>

      {/* Expedition Followers & Subscriber Management Card (Admin-Only with Emails) */}
      <div className="mt-12 bg-[#121216] border border-white/[0.08] rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF3028]/15 border border-[#FF3028]/30 text-[#FF3028] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Expedition Followers & Subscribers
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  <Shield className="w-2.5 h-2.5" />
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Subscribers who clicked Follow. Follower emails are strictly kept private here and never shown to the public.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-[#18181f] border border-white/[0.06] text-xs font-mono">
              <span className="text-zinc-500">Subscribers: </span>
              <span className="text-white font-bold">{data.followers?.length || 0}</span>
            </div>

            {data.followers && data.followers.length > 0 && (
              <button
                type="button"
                onClick={handleCopyAllEmails}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#202028] hover:bg-[#282834] border border-white/[0.1] text-xs font-medium text-white transition-all cursor-pointer active:scale-95"
                title="Copy all follower email addresses comma-separated"
              >
                {copiedEmails ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <ClipboardCopy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy All Emails</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Followers List / Table */}
        {!data.followers || data.followers.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            No followers have subscribed yet. When visitors submit their Name and Email on the public travel section, they will appear here.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05] border border-white/[0.06] rounded-xl overflow-hidden bg-[#16161c]">
            {data.followers.map((follower) => {
              const initials =
                follower.name
                  .split(" ")
                  .map((n) => n[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() || "EX";

              return (
                <div
                  key={follower.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#24242e] to-[#16161d] border border-white/[0.1] text-white flex items-center justify-center font-bold text-xs tracking-wider shrink-0">
                      {initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                        <span>{follower.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          Follower
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Mail className="w-3 h-3 text-[#FF3028]" />
                        <span className="text-xs text-zinc-300 font-mono select-all">
                          {follower.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-12 sm:pl-0">
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {follower.createdAt
                        ? new Date(follower.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Joined"}
                    </span>

                    <button
                      type="button"
                      disabled={deletingFollowerId === follower.id}
                      onClick={() => handleDeleteFollower(follower.id)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Remove follower"
                    >
                      {deletingFollowerId === follower.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Story Modal */}
      {editingStory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121216] border border-white/[0.1] rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF3028]" />
                <h3 className="text-lg font-bold text-white">
                  {isCreating ? "Add Travel Journey" : "Edit Travel Journey"}
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

            <form onSubmit={handleSaveModal} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Journey Title *
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
                    Destination / Location
                  </label>
                  <input
                    type="text"
                    value={editingStory.destination || editingStory.location || ""}
                    onChange={(e) =>
                      setEditingStory({
                        ...editingStory,
                        destination: e.target.value,
                        location: e.target.value,
                      })
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
                    value={editingStory.travelDate || editingStory.date || ""}
                    onChange={(e) =>
                      setEditingStory({
                        ...editingStory,
                        travelDate: e.target.value,
                        date: e.target.value,
                      })
                    }
                    placeholder="e.g. September 2026"
                    className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Short Description / Summary *
                </label>
                <textarea
                  rows={2}
                  value={editingStory.shortDescription || editingStory.note || ""}
                  onChange={(e) =>
                    setEditingStory({
                      ...editingStory,
                      shortDescription: e.target.value,
                      note: e.target.value,
                    })
                  }
                  placeholder="Summary for cards and homepage showcase..."
                  className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FF3028]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Full Expedition Log & Details
                </label>
                <textarea
                  rows={4}
                  value={editingStory.fullDescription || ""}
                  onChange={(e) =>
                    setEditingStory({ ...editingStory, fullDescription: e.target.value })
                  }
                  placeholder="Detailed field notes, testing methodology, observations for the /travel page..."
                  className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FF3028]"
                />
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#181820] border border-white/[0.08]">
                <input
                  type="checkbox"
                  id="featured-story-checkbox"
                  checked={editingStory.featured || false}
                  onChange={(e) =>
                    setEditingStory({ ...editingStory, featured: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#FF3028] cursor-pointer"
                />
                <label
                  htmlFor="featured-story-checkbox"
                  className="text-xs text-white font-medium cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FF3028]" />
                  <span>Feature as primary showcase on homepage and /travel</span>
                </label>
              </div>

              {/* Cover Photograph Uploader */}
              <div className="pt-2 border-t border-white/[0.06] space-y-4">
                <ImageUploader
                  label="Cover Photograph"
                  currentImageUrl={editingStory.coverImage || editingStory.imageUrl}
                  onImageChange={(url) =>
                    setEditingStory({ ...editingStory, coverImage: url, imageUrl: url })
                  }
                  helperText="Upload an immersive landscape photo from your journey."
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

              {/* Multiple Gallery Images Management */}
              <div className="pt-2 border-t border-white/[0.06] space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#FF3028]" />
                  <span>Multiple Gallery Photographs</span>
                </label>

                {/* Add new photo input */}
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="Paste image URL to add to journey gallery..."
                    className="flex-1 bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#FF3028]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddGalleryImage(newGalleryUrl)}
                    className="px-4 py-2 rounded-xl bg-[#202028] hover:bg-[#282834] text-xs font-semibold text-white border border-white/[0.1] cursor-pointer"
                  >
                    Add Photo
                  </button>
                </div>

                {/* Gallery Preview Thumbnails */}
                {editingStory.galleryImages && editingStory.galleryImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                    {editingStory.galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative h-20 rounded-xl overflow-hidden bg-black/40 border border-white/[0.1] group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`Gallery photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF3028] hover:bg-[#ff453e] disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-md cursor-pointer active:scale-95"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? "Saving to Database..." : "Save Travel Story & Persist"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
