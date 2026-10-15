"use client";

import { useEffect, useState } from "react";
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

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [siteData, setSiteData] = useState<SiteData>(defaultSiteData);

  // Fetch verified published content from public API
  useEffect(() => {
    fetch("/api/content")
      .then((res) => {
        if (!res.ok) throw new Error("Public content endpoint returned non-200");
        return res.json();
      })
      .then((json) => {
        if (json.success && json.data) {
          const remote: SiteContent = json.data;

          // Map contact social links from config object to string map for SocialDock
          const mappedSocialLinks = {
            instagram: remote.contact?.socialLinks?.instagram?.enabled
              ? remote.contact.socialLinks.instagram.url
              : "",
            youtube: remote.contact?.socialLinks?.youtube?.enabled
              ? remote.contact.socialLinks.youtube.url
              : "",
            facebook: remote.contact?.socialLinks?.facebook?.enabled
              ? remote.contact.socialLinks.facebook.url
              : "",
            whatsapp: remote.contact?.socialLinks?.whatsapp?.enabled
              ? remote.contact.socialLinks.whatsapp.url
              : "",
            x: remote.contact?.socialLinks?.x?.enabled
              ? remote.contact.socialLinks.x.url
              : "",
          };

          setSiteData({
            hero: {
              ...defaultSiteData.hero,
              ...(remote.hero || {}),
            },
            about: {
              ...defaultSiteData.about,
              ...(remote.about || {}),
              pillars: remote.about?.pillars?.length ? remote.about.pillars : defaultSiteData.about.pillars,
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
        console.warn("Using baseline content:", err);
      });
  }, []);

  // Track active section on scroll
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

  return (
    <div className="relative min-h-screen bg-[#0e0e10] text-white selection:bg-[#FF3028] selection:text-white">
      {/* Public Navigation Bar (isOwner is strictly false for public visitors) */}
      <Navbar
        activeSection={activeSection}
        isOwner={false}
      />

      {/* Main Sections */}
      <main>
        {/* Hero Section */}
        <Hero
          heroData={siteData.hero}
          inlineEditMode={false}
          isOwner={false}
        />

        {/* About Section */}
        <About
          aboutData={siteData.about}
          inlineEditMode={false}
          isOwner={false}
        />

        {/* Selected Projects */}
        <Projects
          projectsData={siteData.projects}
          inlineEditMode={false}
          isOwner={false}
        />

        {/* Engineering Blog */}
        <Blog
          blogData={siteData.blog}
          isOwner={false}
        />

        {/* Travel Section */}
        <Travel
          travelData={siteData.travel}
          isOwner={false}
        />

        {/* Contact Section */}
        <Contact
          contactData={siteData.contact}
          inlineEditMode={false}
          isOwner={false}
        />
      </main>

      {/* Public Social Dock (No Owner Edit Controls) */}
      <SocialDock
        socialLinks={siteData.socialLinks || defaultSiteData.socialLinks}
        isOwner={false}
        onUpdateSocialLink={() => {}}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
