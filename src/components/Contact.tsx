"use client";

import { SiteData } from "@/data/defaultData";
import { Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";

interface ContactProps {
  contactData: SiteData["contact"];
  inlineEditMode?: boolean;
}

export default function Contact({ contactData, inlineEditMode = false }: ContactProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const editableClass = inlineEditMode
    ? "outline-dashed outline-1 outline-[#FF3028]/60 hover:outline-[#FF3028] hover:bg-white/[0.04] rounded px-1 cursor-text transition-all"
    : "";

  return (
    <section
      id="contact"
      className="relative w-full py-28 sm:py-36 bg-[#0a0a0c] border-t border-white/[0.06]"
    >
      <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column: Direct info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-[#FF3028]" />
              <span className="text-[12px] font-semibold tracking-[0.25em] text-[#FF3028] uppercase">
                GET IN TOUCH
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-6">
              <span className={editableClass}>{contactData.headingPart1}</span> <br />
              <span className={`text-[#FF3028] ${editableClass}`}>
                {contactData.headingHighlight}
              </span>
            </h2>
            <p
              className={`text-base text-[#C5C5C5] font-light leading-relaxed max-w-lg mb-10 ${editableClass}`}
            >
              {contactData.description}
            </p>

            <div className="space-y-5">
              <a
                href={`mailto:${contactData.email}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#141417] border border-white/[0.06] hover:border-[#FF3028]/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#FF3028]/10 flex items-center justify-center text-[#FF3028]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400 font-mono">DIRECT INQUIRIES</div>
                  <div
                    className={`text-sm font-semibold text-white group-hover:text-[#FF3028] transition-colors ${editableClass}`}
                  >
                    {contactData.email}
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#141417] border border-white/[0.06]">
                <div className="w-10 h-10 rounded-lg bg-[#FF3028]/10 flex items-center justify-center text-[#FF3028]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400 font-mono">LOCATION</div>
                  <div className={`text-sm font-semibold text-white ${editableClass}`}>
                    {contactData.location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[#121215] border border-white/[0.08] shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 tracking-tight">
              Send a Direct Message
            </h3>

            {submitted ? (
              <div className="p-6 rounded-xl bg-[#FF3028]/10 border border-[#FF3028]/30 text-center">
                <h4 className="text-base font-bold text-white mb-2">Message Received</h4>
                <p className="text-sm text-zinc-300">
                  Thank you for reaching out. I will get back to you promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#FF3028] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#FF3028] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                    Project / Message Details
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell me about your idea, engineering requirements, or timeline..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#FF3028] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#FF3028] text-white font-semibold text-sm hover:bg-[#ff453e] active:scale-[0.99] transition-all duration-200 shadow-[0_0_20px_rgba(255,48,40,0.3)]"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
