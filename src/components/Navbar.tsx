"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, Pencil, Plus, User } from "lucide-react";

interface NavbarProps {
  activeSection?: string;
  isOwner?: boolean;
  onOpenEditor?: () => void;
  onOpenAdd?: () => void;
  onLogoClick?: () => void;
  onOpenProfile?: () => void;
}

export default function Navbar({
  activeSection = "home",
  isOwner = false,
  onOpenEditor,
  onOpenAdd,
  onLogoClick,
  onOpenProfile,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoSecretClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    if (newCount >= 3) {
      setLogoClickCount(0);
      if (onLogoClick) {
        onLogoClick();
      }
    }
    setTimeout(() => {
      setLogoClickCount(0);
    }, 1200);
  };

  const navLinks = [
    { name: "Home", href: "#home", id: "home" },
    { name: "About", href: "#about", id: "about" },
    { name: "Projects", href: "#projects", id: "projects" },
    { name: "Blog", href: "#blog", id: "blog" },
    { name: "Travel", href: "#travel", id: "travel" },
    { name: "Contact", href: "#contact", id: "contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0e0e10]/90 backdrop-blur-md py-4 border-b border-white/[0.06]"
          : "bg-transparent pt-6 sm:pt-9 pb-3"
      }`}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-12 lg:px-16 flex items-center justify-between">
        {/* Left: Brand Logo & Text */}
        <div
          onClick={handleLogoSecretClick}
          className="flex items-center gap-2.5 sm:gap-3.5 group select-none cursor-pointer"
        >
          {/* Stylized Red "S" Logo Matching Reference */}
          <div className="relative flex items-center justify-center">
            <svg
              viewBox="0 0 36 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[25px] sm:w-[27px] h-[20px] sm:h-[22px] transition-transform duration-300 group-hover:scale-105"
            >
              <path
                d="M13 5.5H30.5C28.5 8.5 24.5 10.5 18 11H11.5C9 11 7.5 12.2 7.5 14C7.5 15.8 9 17 12.5 17.6L19 18.7C24.5 19.6 28 22 28 25.5C28 28.5 24.8 30.5 18.5 30.5H3.5C6 27.5 10 25.5 16 25H21.5C23.5 25 24.5 24 24.5 22.5C24.5 20.8 23 19.8 19.5 19.2L13 18.1C7.5 17.2 4 14.8 4 11.2C4 7.8 7.5 5.5 13 5.5Z"
                fill="#FF3028"
              />
            </svg>
          </div>
          <Link
            href="#home"
            className="text-[16.5px] sm:text-[17.5px] font-bold tracking-tight text-white group-hover:text-zinc-200 transition-colors"
          >
            SAIL.06
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-9">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <div key={link.name} className="relative flex flex-col items-center">
                <Link
                  href={link.href}
                  className={`text-[14px] lg:text-[14.5px] font-normal tracking-wide transition-colors duration-200 py-1 ${
                    isActive
                      ? "text-white font-medium"
                      : "text-zinc-300 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
                {/* Active Red Underline */}
                {isActive && (
                  <span className="absolute -bottom-1 w-[24px] h-[2px] bg-[#FF3028] rounded-full" />
                )}
              </div>
            );
          })}
        </nav>

        {/* Right: Pill Button "View My Work" + Owner Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Owner-Only: Edit Information & Add Information Buttons */}
          {isOwner && (
            <div className="flex items-center gap-2 animate-in fade-in duration-200">
              {onOpenAdd && (
                <button
                  onClick={onOpenAdd}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#FF3028] hover:bg-[#ff453e] px-3 py-2 rounded-full shadow-[0_0_15px_rgba(255,48,40,0.35)] transition-all cursor-pointer active:scale-95"
                  title="Add New Project, Blog Article, or Skill (Owner Mode)"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="hidden lg:inline">Add Information</span>
                </button>
              )}

              {onOpenEditor && (
                <button
                  onClick={onOpenEditor}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#16161b] hover:bg-[#FF3028] border border-[#FF3028]/50 hover:border-[#FF3028] px-3.5 py-2 rounded-full transition-all cursor-pointer group active:scale-95 shadow-md"
                  title="Edit Portfolio Data (Owner Mode)"
                >
                  <Pencil className="w-3.5 h-3.5 text-[#FF3028] group-hover:text-white transition-colors" />
                  <span className="hidden lg:inline">Edit Data</span>
                </button>
              )}
            </div>
          )}

          <Link
            href="#projects"
            className="group flex items-center gap-3 bg-white text-zinc-950 font-semibold text-[13.5px] pl-1.5 pr-5 py-1.5 rounded-full transition-all duration-300 hover:shadow-[0_0_24px_rgba(255,255,255,0.22)] hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Red Circle with Arrow */}
            <div className="w-[32px] h-[32px] rounded-full bg-[#FF3028] flex items-center justify-center text-white shrink-0 shadow-sm transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight className="w-4 h-4 stroke-[2.4]" />
            </div>
            <span className="tracking-tight text-[#111111]">View My Work</span>
          </Link>

          {/* Profile button opens owner authentication. */}
          <button
            id="nav-profile-btn"
            onClick={onOpenProfile}
            className={`relative flex items-center justify-center w-[36px] h-[36px] rounded-full transition-all duration-300 cursor-pointer active:scale-95 group ${
              isOwner
                ? "bg-[#1b1718] border border-[#FF3028]/70 shadow-[0_0_12px_rgba(255,48,40,0.35)]"
                : "bg-[#16161b] hover:bg-[#202028] border border-white/[0.1] hover:border-[#FF3028]/50"
            }`}
            aria-label="Owner Profile"
            title={isOwner ? "Owner Mode Active • Click to manage" : "Owner Profile Sign In"}
          >
            <User
              className={`w-4 h-4 transition-colors ${
                isOwner ? "text-[#FF3028]" : "text-zinc-400 group-hover:text-[#FF3028]"
              }`}
            />
            {isOwner && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0e0e10] rounded-full animate-pulse" />
            )}
          </button>
        </div>

        {/* Mobile Menu Button & Mobile Edit/Add/Profile Buttons */}
        <div className="flex md:hidden items-center gap-1.5 shrink-0">
          {/* Mobile Profile Icon Button */}
          <button
            id="nav-profile-btn-mobile"
            onClick={onOpenProfile}
            className={`relative flex items-center justify-center w-7 h-7 rounded-full transition-all cursor-pointer active:scale-95 ${
              isOwner
                ? "bg-[#1b1718] border border-[#FF3028]/70 text-[#FF3028]"
                : "bg-[#16161b] border border-white/[0.1] text-zinc-400"
            }`}
            aria-label="Owner Profile"
            title={isOwner ? "Owner Mode Active • Click to manage" : "Owner Profile Sign In"}
          >
            <User className="w-3.5 h-3.5" />
            {isOwner && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 border border-[#0e0e10] rounded-full" />
            )}
          </button>

          {isOwner && (
            <div className="flex items-center gap-1">
              {onOpenAdd && (
                <button
                  onClick={onOpenAdd}
                  className="p-1.5 rounded-full bg-[#FF3028] text-white"
                  aria-label="Add Information"
                  title="Add Information (Owner Mode)"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
              {onOpenEditor && (
                <button
                  onClick={onOpenEditor}
                  className="p-1.5 text-[#FF3028] hover:text-white transition-colors"
                  aria-label="Edit Information"
                  title="Edit Information (Owner Mode)"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
          <Link
            href="#projects"
            className="flex sm:hidden items-center justify-center w-7 h-7 rounded-full bg-[#FF3028] text-white shrink-0 shadow-sm"
            aria-label="View My Work"
          >
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.4]" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-zinc-300 hover:text-white transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e0e10]/95 backdrop-blur-xl border-b border-white/[0.08] px-6 py-6 transition-all duration-200">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-[16px] py-1 flex items-center justify-between ${
                  activeSection === link.id
                    ? "text-[#FF3028] font-semibold"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                <span>{link.name}</span>
                {activeSection === link.id && (
                  <span className="w-2 h-2 rounded-full bg-[#FF3028]" />
                )}
              </Link>
            ))}

            {isOwner && onOpenEditor && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenEditor();
                  }}
                  className="flex items-center justify-center gap-2 bg-[#1b1b22] border border-[#FF3028]/40 text-white font-medium text-[13px] py-2 px-4 rounded-xl w-full"
                >
                  <Pencil className="w-3.5 h-3.5 text-[#FF3028]" />
                  <span>Edit Data (Owner Mode)</span>
                </button>
              </div>
            )}

            {/* Profile Sign In / Owner Status inside Mobile Drawer */}
            <div className="pt-2 border-t border-white/[0.08]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenProfile) onOpenProfile();
                }}
                className={`flex items-center justify-center gap-2 font-medium text-[13px] py-2.5 px-4 rounded-xl w-full transition-all cursor-pointer ${
                  isOwner
                    ? "bg-[#1b1718] border border-[#FF3028]/40 text-[#FF3028]"
                    : "bg-[#181820] border border-white/[0.08] text-zinc-300 hover:text-white"
                }`}
              >
                <User className="w-4 h-4" />
                <span>{isOwner ? "Owner Profile Active" : "Owner Sign In"}</span>
              </button>
            </div>

            <div className="pt-2">
              <Link
                href="#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-3 bg-white text-zinc-950 font-semibold text-[14px] py-2.5 px-4 rounded-full w-full"
              >
                <div className="w-6 h-6 rounded-full bg-[#FF3028] flex items-center justify-center text-white shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span>View My Work</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
