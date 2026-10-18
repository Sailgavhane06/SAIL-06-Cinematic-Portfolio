"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Blog from "@/components/Blog";
import Travel from "@/components/Travel";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SocialDock from "@/components/SocialDock";
import { SiteData, defaultSiteData } from "@/data/defaultData";
import { SiteContent } from "@/lib/types";
import { Pencil } from "lucide-react";
import ProfileAuthModal from "@/components/ProfileAuthModal";
import OwnerEditBar from "@/components/OwnerEditBar";

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [siteData, setSiteData] = useState<SiteData>(defaultSiteData);
  const [isOwner, setIsOwner] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // 1. Fetch verified published content from public API with zero-caching
  const fetchContent = useCallback(() => {
    fetch("/api/content", {
      cache: "no-store",
      headers: {
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Public content endpoint returned non-200");
        return res.json();
      })
      .then((json) => {
        if (json.success && json.data) {
          const remote: SiteContent = json.data;

          const mappedSocialLinks = {
            instagram: remote.contact?.socialLinks?.instagram?.enabled
              ? remote.contact.socialLinks.instagram.url
              : defaultSiteData.socialLinks.instagram,
            youtube: remote.contact?.socialLinks?.youtube?.enabled
              ? remote.contact.socialLinks.youtube.url
              : defaultSiteData.socialLinks.youtube,
            facebook: remote.contact?.socialLinks?.facebook?.enabled
              ? remote.contact.socialLinks.facebook.url
              : defaultSiteData.socialLinks.facebook,
            whatsapp: remote.contact?.socialLinks?.whatsapp?.enabled
              ? remote.contact.socialLinks.whatsapp.url
              : defaultSiteData.socialLinks.whatsapp,
            x: remote.contact?.socialLinks?.x?.enabled
              ? remote.contact.socialLinks.x.url
              : defaultSiteData.socialLinks.x,
          };

          setSiteData({
            hero: {
              ...defaultSiteData.hero,
              ...(remote.hero || {}),
              portraitImage: remote.hero?.portraitImage || defaultSiteData.hero.portraitImage,
            },
            about: {
              ...defaultSiteData.about,
              ...(remote.about || {}),
              profilePhoto: remote.about?.profilePhoto || defaultSiteData.about.profilePhoto,
              pillars: remote.about?.pillars?.length ? remote.about.pillars : defaultSiteData.about.pillars,
              highlights: remote.about?.highlights?.length ? remote.about.highlights : defaultSiteData.about.highlights,
            },
            projects: remote.projects && remote.projects.length > 0 ? remote.projects : defaultSiteData.projects,
            blog: {
              heading: remote.blog?.heading || defaultSiteData.blog.heading,
              description: remote.blog?.description || defaultSiteData.blog.description,
              articles: remote.blog?.articles?.length ? remote.blog.articles : defaultSiteData.blog.articles,
            },
            travel: {
              ...defaultSiteData.travel,
              ...(remote.travel || {}),
              stories: remote.travel?.stories?.length ? remote.travel.stories : defaultSiteData.travel.stories,
            },
            contact: {
              ...defaultSiteData.contact,
              ...(remote.contact || {}),
            },
            socialLinks: {
              ...defaultSiteData.socialLinks,
              ...mappedSocialLinks,
            },
          });
        }
      })
      .catch((err) => {
        console.warn("Using baseline content fallback:", err);
      });
  }, []);

  // Initial load
  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Re-fetch on window focus (so returning from Admin tab immediately displays saved updates)
  useEffect(() => {
    const handleFocus = () => {
      fetchContent();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchContent]);

  // 2. Check if the viewer is authenticated as the owner
  useEffect(() => {
    fetch("/api/admin/me", { cache: "no-store" })
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.authenticated && data.user?.role === "owner") {
          setIsOwner(true);
        }
      })
      .catch(() => {});
  }, []);

  // 3. Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "projects", "blog", "travel", "contact"];
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

  const navigateToAdminTab = (tab: string) => {
    window.location.href = `/admin?tab=${tab}`;
  };

  const handleUpdateSocialLink = async (platform: keyof SiteData["socialLinks"], url: string) => {
    try {
      const updatedLinks = {
        ...siteData.socialLinks,
        [platform]: url,
      };
      setSiteData((prev) => ({ ...prev, socialLinks: updatedLinks }));

      await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "contact",
          data: {
            ...siteData.contact,
            socialLinks: {
              instagram: { url: platform === "instagram" ? url : siteData.socialLinks.instagram, enabled: true },
              youtube: { url: platform === "youtube" ? url : siteData.socialLinks.youtube, enabled: true },
              facebook: { url: platform === "facebook" ? url : siteData.socialLinks.facebook, enabled: true },
              whatsapp: { url: platform === "whatsapp" ? url : siteData.socialLinks.whatsapp, enabled: true },
              x: { url: platform === "x" ? url : siteData.socialLinks.x, enabled: true },
            },
          },
        }),
      });
    } catch (e) {
      console.error("Error saving social link:", e);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0e0e10] text-white selection:bg-[#FF3028] selection:text-white">
      {/* Navigation Bar with Profile Icon Button */}
      <Navbar
        activeSection={activeSection}
        isOwner={isOwner}
        onOpenEditor={() => (window.location.href = "/admin")}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Owner-Only Live Edit Bar for All Sections */}
      <OwnerEditBar
        isOwner={isOwner}
        onOpenSection={navigateToAdminTab}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Sections */}
      <main>
        {/* Hero Section */}
        <Hero
          heroData={siteData.hero}
          inlineEditMode={false}
          isOwner={isOwner}
          onEditSection={() => navigateToAdminTab("about")}
        />

        {/* About Section */}
        <About
          aboutData={siteData.about}
          inlineEditMode={false}
          isOwner={isOwner}
          onEditSection={() => navigateToAdminTab("about")}
        />

        {/* Selected Projects */}
        <Projects
          projectsData={siteData.projects}
          inlineEditMode={false}
          isOwner={isOwner}
          onEditSection={() => navigateToAdminTab("projects")}
        />

        {/* Engineering Blog */}
        <Blog
          blogData={siteData.blog}
          isOwner={isOwner}
          onEditSection={() => navigateToAdminTab("blog")}
        />

        {/* Travel Section */}
        <Travel
          travelData={siteData.travel}
          isOwner={isOwner}
          onEditSection={() => navigateToAdminTab("travel")}
        />

        {/* Contact Section */}
        <Contact
          contactData={siteData.contact}
          inlineEditMode={false}
          isOwner={isOwner}
          onEditSection={() => navigateToAdminTab("contact")}
        />
      </main>

      {/* Public Social Dock */}
      <SocialDock
        socialLinks={siteData.socialLinks || defaultSiteData.socialLinks}
        isOwner={isOwner}
        onUpdateSocialLink={handleUpdateSocialLink}
      />

      {/* Footer */}
      <Footer />

      {/* Floating Owner Pencil Button (Visible ONLY to verified owner) */}
      {isOwner && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 animate-in slide-in-from-bottom duration-300">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#16161b]/95 hover:bg-[#FF3028] border border-[#FF3028]/60 text-xs font-bold text-white shadow-2xl backdrop-blur-md transition-all group active:scale-95 cursor-pointer"
            title="Open Full Admin Dashboard"
          >
            <Pencil className="w-3.5 h-3.5 text-[#FF3028] group-hover:text-white transition-colors" />
            <span>Owner Mode • Edit Website</span>
          </Link>
        </div>
      )}

      {/* Owner Profile / Sign-in Popup Window */}
      <ProfileAuthModal
        isOpen={isProfileModalOpen}
        isOwner={isOwner}
        onClose={() => setIsProfileModalOpen(false)}
        onLoginSuccess={() => {
          setIsOwner(true);
          fetchContent();
        }}
        onLogoutSuccess={() => {
          setIsOwner(false);
          fetchContent();
        }}
      />
    </div>
  );
}
