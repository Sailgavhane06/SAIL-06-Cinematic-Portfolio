"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import EditModal from "@/components/EditModal";
import { SiteData, defaultSiteData } from "@/data/defaultData";

const STORAGE_KEY = "sail06_portfolio_data_v1";
const OWNER_STORAGE_KEY = "sail06_owner_auth";

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [siteData, setSiteData] = useState<SiteData>(defaultSiteData);
  const [inlineEditMode, setInlineEditMode] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // Initialize data and owner mode check
  useEffect(() => {
    // 1. Load saved portfolio content
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSiteData(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load saved data from localStorage", e);
    }

    // 2. Check if owner mode is authenticated
    try {
      const isOwnerSaved = localStorage.getItem(OWNER_STORAGE_KEY) === "true";
      const params = new URLSearchParams(window.location.search);
      const hasParam = params.get("edit") === "true" || params.get("admin") === "true";

      if (isOwnerSaved || hasParam) {
        setIsOwner(true);
        localStorage.setItem(OWNER_STORAGE_KEY, "true");
      }
    } catch (e) {
      console.warn("Could not verify owner status", e);
    }

    // 3. Secret keyboard shortcut for owner: Alt + E toggles owner mode
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "e" || e.key === "E")) {
        setIsOwner((prev) => {
          const next = !prev;
          if (next) {
            localStorage.setItem(OWNER_STORAGE_KEY, "true");
          } else {
            localStorage.removeItem(OWNER_STORAGE_KEY);
          }
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleOwner = () => {
    setIsOwner((prev) => {
      const next = !prev;
      if (next) {
        localStorage.setItem(OWNER_STORAGE_KEY, "true");
      } else {
        localStorage.removeItem(OWNER_STORAGE_KEY);
      }
      return next;
    });
  };

  const handleExitOwnerMode = () => {
    setIsOwner(false);
    setInlineEditMode(false);
    try {
      localStorage.removeItem(OWNER_STORAGE_KEY);
    } catch (e) {
      console.warn("Could not remove owner auth", e);
    }
  };

  const handleSaveData = (newData: SiteData) => {
    setSiteData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.warn("Could not save data to localStorage", e);
    }
  };

  const handleResetData = () => {
    setSiteData(defaultSiteData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Could not remove data from localStorage", e);
    }
  };

  const handleUpdateHeroField = (field: keyof SiteData["hero"], val: string) => {
    setSiteData((prev) => {
      const updated = {
        ...prev,
        hero: {
          ...prev.hero,
          [field]: val,
        },
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not sync to localStorage", e);
      }
      return updated;
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "projects", "blog", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0e0e10] text-white selection:bg-[#FF3028] selection:text-white">
      {/* Navigation Bar: Edit button only visible if isOwner is true */}
      <Navbar
        activeSection={activeSection}
        isOwner={isOwner}
        onOpenEditor={() => setIsEditorOpen(true)}
        onLogoClick={handleToggleOwner}
      />

      {/* Main Content */}
      <main>
        {/* Full Viewport Hero (Exact Reference Recreation & Fixed Portrait) */}
        <Hero
          heroData={siteData.hero}
          inlineEditMode={inlineEditMode && isOwner}
          onUpdateHero={handleUpdateHeroField}
        />

        {/* Subsequent Sections */}
        <About
          aboutData={siteData.about}
          inlineEditMode={inlineEditMode && isOwner}
        />
        <Projects
          projectsData={siteData.projects}
          inlineEditMode={inlineEditMode && isOwner}
        />
        <Blog />
        <Contact
          contactData={siteData.contact}
          inlineEditMode={inlineEditMode && isOwner}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Data & Text Editor (Only Accessible when in Owner Mode) */}
      {isOwner && (
        <EditModal
          data={siteData}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveData}
          onReset={handleResetData}
          inlineEditMode={inlineEditMode}
          onToggleInlineEdit={setInlineEditMode}
          onExitOwnerMode={handleExitOwnerMode}
        />
      )}
    </div>
  );
}
