"use client";

import React, { useState } from "react";
import { ProjectItem } from "@/lib/types";
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
  Layers,
  X,
  ExternalLink,
} from "lucide-react";

interface SectionProjectsProps {
  initialData: ProjectItem[];
  onSave: (projects: ProjectItem[]) => Promise<boolean>;
}

export default function SectionProjects({ initialData, onSave }: SectionProjectsProps) {
  const [projects, setProjects] = useState<ProjectItem[]>(initialData);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleStartCreate = () => {
    const newProj: ProjectItem = {
      id: `project-${Date.now()}`,
      title: "",
      category: "Hardware & Embedded Systems",
      desc: "",
      detailedDesc: "",
      tech: [],
      highlight: "Custom Engineering",
      image: "",
      imageAlt: "",
      link: "https://github.com/Sailgavhane06",
      order: projects.length + 1,
      status: "published",
    };
    setEditingProject(newProj);
    setIsCreating(true);
    setTechInput("");
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const copy = [...projects];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);

    // Re-index order property
    const reordered = copy.map((p, idx) => ({ ...p, order: idx + 1 }));
    setProjects(reordered);
  };

  const handleToggleStatus = (id: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "published" ? "draft" : "published" }
          : p
      )
    );
  };

  const handleDeleteProject = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    const filtered = projects.filter((p) => p.id !== id);
    const reordered = filtered.map((p, idx) => ({ ...p, order: idx + 1 }));
    setProjects(reordered);
  };

  const handleAddTechTag = () => {
    if (!editingProject || !techInput.trim()) return;
    const tag = techInput.trim();
    if (!editingProject.tech.includes(tag)) {
      setEditingProject({
        ...editingProject,
        tech: [...editingProject.tech, tag],
      });
    }
    setTechInput("");
  };

  const handleRemoveTechTag = (tag: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      tech: editingProject.tech.filter((t) => t !== tag),
    });
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (!editingProject.title.trim()) {
      alert("Project title is required.");
      return;
    }

    if (isCreating) {
      setProjects((prev) => [...prev, editingProject]);
    } else {
      setProjects((prev) =>
        prev.map((p) => (p.id === editingProject.id ? editingProject : p))
      );
    }

    setEditingProject(null);
    setIsCreating(false);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSaveSuccess(false);

    const success = await onSave(projects);
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
          <h2 className="text-xl font-bold text-white">Selected Engineering Projects</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Add, reorder, edit technologies, upload project photos, and toggle public visibility.
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
            <span>Add Project</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#FF3028] hover:bg-[#ff453e] disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-md cursor-pointer active:scale-95"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Projects</span>
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {projects.map((proj, idx) => (
          <div
            key={proj.id}
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
                  disabled={idx === projects.length - 1}
                  onClick={() => handleMove(idx, "down")}
                  className="p-1 hover:text-white disabled:opacity-20 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Project Image */}
              {proj.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={proj.image}
                  alt={proj.imageAlt || proj.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/[0.1]"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[#18181f] border border-white/[0.1] shrink-0 flex items-center justify-center text-zinc-600">
                  <Layers className="w-6 h-6" />
                </div>
              )}

              {/* Information */}
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      proj.status === "published"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {proj.status}
                  </span>
                  <span className="text-[11px] font-semibold text-[#FF3028] uppercase tracking-wider">
                    {proj.category}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-[11px] text-zinc-400 font-mono">{proj.highlight}</span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">{proj.title}</h3>
                <p className="text-xs text-zinc-400 line-clamp-1 mt-1 max-w-xl font-light">
                  {proj.desc}
                </p>

                {/* Tech badges */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {proj.tech.map((t, ti) => (
                    <span
                      key={ti}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#18181f] text-zinc-300 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                type="button"
                onClick={() => handleToggleStatus(proj.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  proj.status === "published"
                    ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20"
                    : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20"
                }`}
                title={proj.status === "published" ? "Change to Draft" : "Publish to live website"}
              >
                {proj.status === "published" ? "Make Draft" : "Publish"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingProject(proj);
                  setIsCreating(false);
                }}
                className="p-2 rounded-lg bg-[#1a1a22] hover:bg-[#252530] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Edit project"
              >
                <Pencil className="w-3.5 h-3.5 text-[#FF3028]" />
              </button>

              <button
                type="button"
                onClick={() => handleDeleteProject(proj.id)}
                className="p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-red-400 transition-colors cursor-pointer"
                title="Delete project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121216] border border-white/[0.1] rounded-2xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF3028]" />
                <h3 className="text-lg font-bold text-white">
                  {isCreating ? "Add Engineering Project" : "Edit Project Details"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, title: e.target.value })
                    }
                    placeholder="e.g. Autonomous IoT Sensor Mesh"
                    className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Visibility Status
                  </label>
                  <select
                    value={editingProject.status}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
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
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={editingProject.category}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, category: e.target.value })
                    }
                    placeholder="e.g. Hardware & Embedded Systems"
                    className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Key Highlight Tag
                  </label>
                  <input
                    type="text"
                    value={editingProject.highlight}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, highlight: e.target.value })
                    }
                    placeholder="e.g. Custom PCB Design"
                    className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingProject.desc}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, desc: e.target.value })
                  }
                  placeholder="Primary summary for project card..."
                  className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FF3028]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Detailed Technical Overview
                </label>
                <textarea
                  rows={3}
                  value={editingProject.detailedDesc || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, detailedDesc: e.target.value })
                  }
                  placeholder="Extended technical specifications and system notes..."
                  className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FF3028]"
                />
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Technologies & Tools (Tech Stack)
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="e.g. KiCad, FreeRTOS, STM32"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTechTag();
                      }
                    }}
                    className="flex-1 bg-[#18181f] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FF3028]"
                  />
                  <button
                    type="button"
                    onClick={handleAddTechTag}
                    className="px-3 py-2 rounded-xl bg-[#202028] text-xs font-medium text-white hover:bg-[#282834]"
                  >
                    Add Tag
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {editingProject.tech.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-[#18181f] border border-white/[0.08] text-zinc-300"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTechTag(t)}
                        className="text-zinc-500 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Image & Alt */}
              <div className="pt-2 border-t border-white/[0.06] space-y-4">
                <ImageUploader
                  label="Project Image"
                  currentImageUrl={editingProject.image}
                  onImageChange={(url) => setEditingProject({ ...editingProject, image: url })}
                  helperText="Upload hardware render, PCB layout, or system screenshot."
                />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Image Alternative Text (Accessibility)
                  </label>
                  <input
                    type="text"
                    value={editingProject.imageAlt || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, imageAlt: e.target.value })
                    }
                    placeholder="Describe image content for screen readers and SEO..."
                    className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#FF3028]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    External Project / GitHub Link
                  </label>
                  <input
                    type="text"
                    value={editingProject.link || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, link: e.target.value })
                    }
                    placeholder="https://github.com/Sailgavhane06/..."
                    className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#FF3028]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF3028] hover:bg-[#ff453e] text-white text-xs font-semibold transition-all shadow-md cursor-pointer"
                >
                  Apply to Projects List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
