"use client";

import { SiteData } from "@/data/defaultData";
import { ArrowUpRight, Pencil, Plus } from "lucide-react";

interface ProjectsProps {
  projectsData: SiteData["projects"];
  inlineEditMode?: boolean;
  isOwner?: boolean;
  onEditSection?: () => void;
  onAddProject?: () => void;
}

export default function Projects({
  projectsData,
  inlineEditMode = false,
  isOwner = false,
  onEditSection,
  onAddProject,
}: ProjectsProps) {
  const editableClass = inlineEditMode
    ? "outline-dashed outline-1 outline-[#FF3028]/60 hover:outline-[#FF3028] hover:bg-white/[0.04] rounded px-1 cursor-text transition-all"
    : "";

  return (
    <section
      id="projects"
      className="relative w-full py-28 sm:py-36 bg-[#0a0a0c] border-t border-white/[0.06]"
    >
      <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-[#FF3028]" />
              <span className="text-[12px] font-semibold tracking-[0.25em] text-[#FF3028] uppercase">
                FEATURED WORK
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Selected Engineering & Software Projects
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#C5C5C5] font-light max-w-xl">
              From circuit boards to high-throughput software architectures — designed, built, and shipped to solve concrete engineering challenges.
            </p>
          </div>

          {/* Owner-Only Action Buttons */}
          {isOwner && (
            <div className="flex items-center gap-2.5 shrink-0">
              {onAddProject && (
                <button
                  onClick={onAddProject}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF3028] hover:bg-[#ff453e] text-xs font-semibold text-white shadow-md transition-all cursor-pointer active:scale-95"
                  title="Add New Project (Owner Mode)"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Information</span>
                </button>
              )}

              {onEditSection && (
                <button
                  onClick={onEditSection}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#16161b] hover:bg-[#FF3028] border border-[#FF3028]/50 hover:border-[#FF3028] text-xs font-semibold text-white shadow-md transition-all cursor-pointer group active:scale-95"
                  title="Edit Projects Data (Owner Only)"
                >
                  <Pencil className="w-3.5 h-3.5 text-[#FF3028] group-hover:text-white transition-colors" />
                  <span>Edit Projects</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {projectsData.map((proj, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl bg-[#121215] border border-white/[0.07] p-8 sm:p-10 flex flex-col justify-between hover:border-[#FF3028]/50 transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span
                    className={`text-xs font-semibold tracking-wider uppercase text-[#FF3028] px-3 py-1 rounded-full bg-[#FF3028]/10 border border-[#FF3028]/20 ${editableClass}`}
                  >
                    {proj.category}
                  </span>
                  <span className={`text-xs text-zinc-400 font-mono ${editableClass}`}>
                    {proj.highlight}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-white transition-colors flex items-center justify-between">
                  <span className={editableClass}>{proj.title}</span>
                  <div className="flex items-center gap-1.5">
                    {isOwner && onEditSection && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditSection();
                        }}
                        className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-[#FF3028] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Edit project data"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-[#FF3028] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                  </div>
                </h3>

                <p className={`text-sm text-zinc-400 leading-relaxed font-light mb-6 ${editableClass}`}>
                  {proj.desc}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.06]">
                  {proj.tech.map((t, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.04]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
