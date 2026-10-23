"use client";

import React, { useState } from "react";
import { BlogContent, BlogPost, PublicationStatus } from "@/lib/types";
import ImageUploader from "./ImageUploader";
import {
  Plus,
  Trash2,
  Pencil,
  Eye,
  Save,
  Loader2,
  Check,
  FileText,
  Clock,
  Calendar,
  X,
  AlertCircle,
} from "lucide-react";

interface SectionBlogProps {
  initialData: BlogContent;
  onSave: (data: BlogContent) => Promise<boolean>;
}

export default function SectionBlog({ initialData, onSave }: SectionBlogProps) {
  const [data, setData] = useState<BlogContent>(initialData);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync if parent updates
  React.useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  // Auto generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleStartCreate = () => {
    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "Engineering & Hardware",
      readTime: "5 min read",
      date: new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date()),
      thumbnail: "",
      status: "published",
    };
    setEditingPost(newPost);
    setIsCreating(true);
  };

  const handleSavePostModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    if (!editingPost.title.trim()) {
      alert("Post title is required.");
      return;
    }

    const finalPost: BlogPost = {
      ...editingPost,
      slug: editingPost.slug.trim() || generateSlug(editingPost.title),
    };

    let nextArticles: BlogPost[];
    if (isCreating) {
      nextArticles = [finalPost, ...data.articles];
    } else {
      nextArticles = data.articles.map((a) => (a.id === finalPost.id ? finalPost : a));
    }

    const nextData = {
      ...data,
      articles: nextArticles,
    };

    setData(nextData);
    setEditingPost(null);
    setIsCreating(false);

    // Persist immediately to database and live website
    setSaving(true);
    const success = await onSave(nextData);
    setSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this blog post?")) {
      return;
    }
    const nextData = {
      ...data,
      articles: data.articles.filter((a) => a.id !== id),
    };
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
    const nextData = {
      ...data,
      articles: data.articles.map((a) =>
        a.id === id
          ? { ...a, status: (a.status === "published" ? "draft" : "published") as PublicationStatus }
          : a
      ),
    };
    setData(nextData);
    setSaving(true);
    const ok = await onSave(nextData);
    setSaving(false);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
          <h2 className="text-xl font-bold text-white">Creator & Engineering Blog</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Publish technical writeups, field notes, and hardware breakdowns. Manage draft vs published visibility.
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
            <span>Write New Post</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#FF3028] hover:bg-[#ff453e] disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-md cursor-pointer active:scale-95"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save All Articles</span>
          </button>
        </div>
      </div>

      {/* Section Headings Editor */}
      <div className="bg-[#121216] border border-white/[0.07] rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
            Blog Section Heading
          </label>
          <input
            type="text"
            value={data.heading}
            onChange={(e) => setData({ ...data, heading: e.target.value })}
            className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF3028]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
            Blog Description
          </label>
          <input
            type="text"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF3028]"
          />
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-3">
        {data.articles.map((post) => (
          <div
            key={post.id}
            className="bg-[#121216] border border-white/[0.07] hover:border-white/[0.15] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
          >
            <div className="flex items-start gap-4">
              {post.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/[0.1]"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[#18181f] border border-white/[0.1] shrink-0 flex items-center justify-center text-zinc-600">
                  <FileText className="w-6 h-6" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      post.status === "published"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {post.status}
                  </span>

                  <span className="text-[11px] text-zinc-500 font-mono">
                    /{post.slug || "no-slug"}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-[11px] text-zinc-400">{post.category}</span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">{post.title}</h3>
                <p className="text-xs text-zinc-400 line-clamp-1 mt-1 max-w-2xl font-light">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                type="button"
                onClick={() => setPreviewPost(post)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1a1a22] hover:bg-[#252530] text-xs text-zinc-300 transition-colors"
                title="Preview post"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleStatus(post.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  post.status === "published"
                    ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20"
                    : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20"
                }`}
                title={post.status === "published" ? "Change to Draft" : "Publish to live website"}
              >
                {post.status === "published" ? "Make Draft" : "Publish"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingPost(post);
                  setIsCreating(false);
                }}
                className="p-2 rounded-lg bg-[#1a1a22] hover:bg-[#252530] text-zinc-300 hover:text-white transition-colors"
                title="Edit post details"
              >
                <Pencil className="w-3.5 h-3.5 text-[#FF3028]" />
              </button>

              <button
                type="button"
                onClick={() => handleDeletePost(post.id)}
                className="p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-red-400 transition-colors"
                title="Delete post"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {data.articles.length === 0 && (
          <div className="text-center py-12 text-zinc-500 bg-[#121216] border border-white/[0.05] rounded-2xl">
            No blog articles yet. Click &quot;Write New Post&quot; to draft one.
          </div>
        )}
      </div>

      {/* Bottom Save & Add Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-white/[0.08]">
        <button
          type="button"
          onClick={handleStartCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#202028] hover:bg-[#282834] border border-white/[0.1] text-xs font-semibold text-white transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#FF3028]" />
          <span>Write Another Article</span>
        </button>

        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF3028] hover:bg-[#ff453e] disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-md cursor-pointer active:scale-95"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Saving to Database..." : "Save All Articles"}</span>
        </button>
      </div>

      {/* Edit / Create Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121216] border border-white/[0.1] rounded-2xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF3028]" />
                <h3 className="text-lg font-bold text-white">
                  {isCreating ? "Write New Article" : "Edit Article"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePostModal} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPost.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setEditingPost({
                        ...editingPost,
                        title: newTitle,
                        slug: isCreating ? generateSlug(newTitle) : editingPost.slug,
                      });
                    }}
                    placeholder="e.g. Designing Robust Hardware: Lessons from 100+ PCB Iterations"
                    className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Publication Status
                  </label>
                  <select
                    value={editingPost.status}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        status: e.target.value as "draft" | "published",
                      })
                    }
                    className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
                  >
                    <option value="draft">Draft (Owner only)</option>
                    <option value="published">Published (Visible to all)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingPost.slug}
                    onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                    placeholder="post-url-slug"
                    className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingPost.category}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    placeholder="e.g. Hardware Engineering"
                    className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Publication Date
                  </label>
                  <input
                    type="text"
                    value={editingPost.date}
                    onChange={(e) => setEditingPost({ ...editingPost, date: e.target.value })}
                    placeholder="e.g. October 2026"
                    className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Short Excerpt / Summary
                </label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  placeholder="Summary shown on the cards..."
                  className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FF3028]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Full Article Body Content
                </label>
                <textarea
                  rows={6}
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  placeholder="Full text or markdown content of your engineering writeup..."
                  className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#FF3028] font-mono text-xs"
                />
              </div>

              {/* Thumbnail Uploader */}
              <div className="pt-2">
                <ImageUploader
                  label="Article Thumbnail Image"
                  currentImageUrl={editingPost.thumbnail}
                  onImageChange={(url) => setEditingPost({ ...editingPost, thumbnail: url })}
                  helperText="Upload a card banner photo or paste an external image URL."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
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
                  <span>{saving ? "Saving to Database..." : "Save Article & Persist"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Preview Modal */}
      {previewPost && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121216] border border-white/[0.12] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    previewPost.status === "published"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-amber-500/15 text-amber-400"
                  }`}
                >
                  {previewPost.status} Preview
                </span>
                <span className="text-xs text-zinc-400">{previewPost.category}</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewPost(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewPost.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewPost.thumbnail}
                alt={previewPost.title}
                className="w-full h-56 object-cover rounded-2xl border border-white/[0.08]"
              />
            )}

            <div>
              <h1 className="text-2xl font-black text-white">{previewPost.title}</h1>
              <div className="flex items-center gap-4 text-xs text-zinc-400 mt-2 font-mono">
                <span>{previewPost.date}</span>
                <span>•</span>
                <span>{previewPost.readTime}</span>
              </div>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed italic border-l-2 border-[#FF3028] pl-4">
              {previewPost.excerpt}
            </p>

            <div className="text-sm text-zinc-200 leading-relaxed space-y-4 pt-2 whitespace-pre-wrap font-light">
              {previewPost.content || "No extended body content provided for this post."}
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewPost(null)}
                className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
