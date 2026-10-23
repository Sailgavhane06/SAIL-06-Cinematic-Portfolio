"use client";

import React, { useState } from "react";
import { ContactContent, SocialLinkConfig } from "@/lib/types";
import { Save, Loader2, Check, AlertCircle, Link as LinkIcon } from "lucide-react";

interface SectionContactProps {
  initialData: ContactContent;
  onSave: (data: ContactContent) => Promise<boolean>;
}

export default function SectionContact({ initialData, onSave }: SectionContactProps) {
  const [data, setData] = useState<ContactContent>(initialData);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [urlErrors, setUrlErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const validateUrlScheme = (url: string): boolean => {
    if (!url) return true;
    const trimmed = url.trim().toLowerCase();
    if (
      trimmed.startsWith("javascript:") ||
      trimmed.startsWith("data:") ||
      trimmed.startsWith("vbscript:")
    ) {
      return false;
    }
    return true;
  };

  const handleUpdateSocial = (
    platform: keyof ContactContent["socialLinks"],
    field: keyof SocialLinkConfig,
    value: string | boolean
  ) => {
    if (field === "url" && typeof value === "string") {
      if (!validateUrlScheme(value)) {
        setUrlErrors((prev) => ({
          ...prev,
          [platform]: "Unsafe URL scheme detected (javascript:/data: not permitted)",
        }));
      } else {
        setUrlErrors((prev) => {
          const next = { ...prev };
          delete next[platform];
          return next;
        });
      }
    }

    setData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: {
          ...prev.socialLinks[platform],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for any URL errors
    if (Object.keys(urlErrors).length > 0) {
      alert("Please fix unsafe URL errors before saving.");
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    const success = await onSave(data);
    setSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  };

  const platforms: Array<{
    id: keyof ContactContent["socialLinks"];
    name: string;
    placeholder: string;
  }> = [
    { id: "instagram", name: "Instagram", placeholder: "https://instagram.com/sail.06" },
    { id: "youtube", name: "YouTube", placeholder: "https://youtube.com/@sail06" },
    { id: "facebook", name: "Facebook", placeholder: "https://facebook.com/sail06" },
    { id: "whatsapp", name: "WhatsApp Direct", placeholder: "https://wa.me/919999999999" },
    { id: "x", name: "X (Twitter)", placeholder: "https://x.com/sail06" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl font-bold text-white">Contact & Social Links</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Configure public inquiries email, location display, and social media connectivity.
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
            <span>Save Contact Info</span>
          </button>
        </div>
      </div>

      {/* Contact info */}
      <div className="bg-[#121216] border border-white/[0.07] rounded-2xl p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF3028]" />
          <span>Contact Inquiries & Location</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Public Contact Email
            </label>
            <input
              type="email"
              required
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              placeholder="sail@sail06.com"
              className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Display Location
            </label>
            <input
              type="text"
              value={data.location}
              onChange={(e) => setData({ ...data, location: e.target.value })}
              placeholder="India / Global Remote"
              className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Heading Part 1
            </label>
            <input
              type="text"
              value={data.headingPart1}
              onChange={(e) => setData({ ...data, headingPart1: e.target.value })}
              className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Heading Highlight (Red Accent)
            </label>
            <input
              type="text"
              value={data.headingHighlight}
              onChange={(e) => setData({ ...data, headingHighlight: e.target.value })}
              className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF3028]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Section Description
          </label>
          <textarea
            rows={2}
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="w-full bg-[#18181f] border border-white/[0.1] rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FF3028]"
          />
        </div>

        {/* Social Platforms */}
        <div className="pt-6 border-t border-white/[0.06] space-y-4">
          <div>
            <h4 className="text-sm font-bold text-white">Social Media Profile Links</h4>
            <p className="text-xs text-zinc-400">
              Enable or disable specific channels and customize their target URLs.
            </p>
          </div>

          <div className="space-y-3">
            {platforms.map((p) => {
              const current = data.socialLinks[p.id] || { url: "", enabled: true };
              const err = urlErrors[p.id];

              return (
                <div
                  key={p.id}
                  className="bg-[#18181f] border border-white/[0.08] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="w-32 flex items-center justify-between sm:justify-start gap-3">
                    <span className="text-xs font-bold text-white">{p.name}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={current.enabled}
                        onChange={(e) =>
                          handleUpdateSocial(p.id, "enabled", e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#FF3028]"></div>
                    </label>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                        <LinkIcon className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        disabled={!current.enabled}
                        value={current.url}
                        onChange={(e) => handleUpdateSocial(p.id, "url", e.target.value)}
                        placeholder={p.placeholder}
                        className="w-full bg-[#121216] disabled:opacity-40 border border-white/[0.08] rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF3028]"
                      />
                    </div>
                    {err && <p className="text-[11px] text-red-400">{err}</p>}
                  </div>
                </div>
              );
            })}
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
          <span className="text-xs text-zinc-500 font-mono">Contact & Social Links</span>
        )}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF3028] hover:bg-[#ff453e] disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-md cursor-pointer active:scale-95"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Saving to Database..." : "Save Contact Info"}</span>
        </button>
      </div>
    </form>
  );
}
