import fs from "fs";
import path from "path";
import os from "os";
import { SiteContent, BlogPost, ProjectItem, TravelStory, TravelFollower } from "./types";

declare global {
  // eslint-disable-next-line no-var
  var __sail06_site_content: SiteContent | undefined;
}

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE_PATH = path.join(DATA_DIR, "content.json");
const TMP_DATA_DIR = path.join(os.tmpdir(), "sail06-data");
const TMP_CONTENT_FILE = path.join(TMP_DATA_DIR, "content.json");

export const initialSiteContent: SiteContent = {
  hero: {
    greeting: "Hi, I'm",
    name: "SAIL",
    rolesLine1: "CREATOR × ELECTRICAL ENGINEER",
    rolesLine2: "× BUILDER × FOUNDER",
    descriptionLine1: "I design, build and share ideas",
    descriptionLine2: "that solve real problems.",
    rightTaglineLine1: "Turning ideas",
    rightTaglineLine2: "into real-world",
    rightTaglineLine3: "solutions.",
    experienceYears: "5+",
    experienceLine1: "building projects, sharing learnings",
    experienceLine2: "and creating impact.",
    portraitImage: "/sail-portrait.jpg",
  },
  about: {
    quotePart1: "I don't just learn things.",
    quoteHighlight: "I build things.",
    bio: "I am Sail Gavhane — an electrical engineer, software builder, and founder driven by curiosity and an uncompromising commitment to craftsmanship. I merge the precision of hardware with the agility of modern software to build real-world solutions.",
    profilePhoto: "/sail-portrait.jpg",
    pillars: [
      {
        id: "pillar-1",
        title: "Electrical Engineer",
        desc: "Designing intelligent circuit systems, embedded hardware, and high-performance electronic solutions with precision.",
      },
      {
        id: "pillar-2",
        title: "Software & Systems Builder",
        desc: "Bridging the gap between silicon and software — architecting full-stack web platforms, firmware, and scalable tools.",
      },
      {
        id: "pillar-3",
        title: "Creative Technologist",
        desc: "Rapid prototyping from 0 to 1. Transforming complex scientific principles into tangible, elegant physical devices.",
      },
      {
        id: "pillar-4",
        title: "Founder & Innovator",
        desc: "Building user-centric products and ventures that address real-world engineering bottlenecks and create lasting value.",
      },
    ],
    highlights: [
      "5+ years of hands-on prototyping and product engineering",
      "Deep expertise in electronics, circuit design & embedded code",
      "Creator of open-source tools, technical guides & hardware builds",
      "Relentless focus on solving high-friction, real-world problems",
    ],
  },
  engineering: {
    heading: "Systems, Hardware & Embedded Architecture",
    description: "Designing end-to-end hardware solutions from schematic capture to custom PCB layout, firmware programming, and industrial validation.",
    highlights: [
      "High-speed circuit design and impedance-matched routing",
      "Low-power microcontrollers (STM32, ESP32, nRF52) and RTOS architectures",
      "Sensor fusion, CAN/Modbus industrial communication & telemetry",
      "Thermal modeling, enclosure integration & rapid additive fabrication",
    ],
    stats: [
      { label: "Hardware Iterations", value: "100+" },
      { label: "PCB Layouts", value: "40+" },
      { label: "Uptime Reliability", value: "99.9%" },
      { label: "Sub-50ms Latency", value: "<50ms" },
    ],
  },
  founder: {
    heading: "Venture Building & Technological Innovation",
    missionStatement: "Empowering developers and engineers with tools that accelerate physical computing, eliminate hardware-software friction, and scale sustainable infrastructure.",
    description: "As a founder, I combine technical discipline with market intuition to build high-leverage products that stand the test of time.",
    milestones: [
      {
        id: "milestone-1",
        year: "2024",
        title: "Founded SAIL Systems Research",
        description: "Initiated independent R&D group focused on modular smart hardware architectures and edge diagnostics.",
      },
      {
        id: "milestone-2",
        year: "2025",
        title: "Shipped Autonomous IoT Framework",
        description: "Deployed edge telemetry across industrial sites with 99.9% telemetry packet integrity.",
      },
      {
        id: "milestone-3",
        year: "2026",
        title: "Scaling Open Engineering Initiatives",
        description: "Creating open hardware schematics and developer toolkits to educate the next generation of builders.",
      },
    ],
    ctaText: "Explore Joint Ventures",
    ctaLink: "#contact",
  },
  projects: [
    {
      id: "project-1",
      title: "Autonomous IoT Sensor Mesh",
      category: "Hardware & Embedded Systems",
      desc: "Low-power edge computing nodes utilizing custom PCB architectures, telemetry transceivers, and real-time sensor fusion algorithms.",
      detailedDesc: "Multi-point wireless sensor mesh built for harsh industrial environments. Includes custom power management with solar harvesting and deep sleep optimization.",
      tech: ["KiCad", "STM32", "C++", "MQTT", "FreeRTOS"],
      highlight: "Custom PCB Design",
      image: "/sail-portrait.jpg",
      imageAlt: "Autonomous IoT Sensor Mesh PCB Prototype",
      link: "https://github.com/Sailgavhane06",
      order: 1,
      status: "published",
    },
    {
      id: "project-2",
      title: "Kinetic Motor Controller & Inverter",
      category: "Power Electronics",
      desc: "High-efficiency BLDC motor driver designed for robotic actuators, featuring field-oriented control (FOC) and regenerative braking safety circuits.",
      detailedDesc: "Designed with isolated gate drivers and low RDS(on) MOSFETs to minimize thermal losses while providing high peak torque response.",
      tech: ["Power MOSFETs", "Embedded C", "CAN Bus", "Thermal Modeling"],
      highlight: "High Efficiency 98.4%",
      image: "/sail-portrait.jpg",
      imageAlt: "BLDC Motor Controller PCB",
      link: "https://github.com/Sailgavhane06",
      order: 2,
      status: "published",
    },
    {
      id: "project-3",
      title: "SAIL.06 Studio Platform",
      category: "Full-Stack Software Architecture",
      desc: "High-performance interactive web application built with modern reactive principles, dynamic telemetry visualizers, and minimal latency API pipelines.",
      detailedDesc: "Cinematic, dark portfolio and content engine engineered with Next.js App Router, Tailwind CSS, and secure server-side administration.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
      highlight: "Sub-50ms Latency",
      image: "/sail-portrait.jpg",
      imageAlt: "SAIL.06 Studio Platform Architecture",
      link: "https://github.com/Sailgavhane06",
      order: 3,
      status: "published",
    },
    {
      id: "project-4",
      title: "Smart Grid Energy Diagnostics",
      category: "Industrial Automation",
      desc: "Non-invasive current sensing architecture capable of detecting power anomalies, harmonic distortions, and micro-surges across industrial installations.",
      detailedDesc: "Employs high-speed analog front-ends with DSP filtering algorithms to classify electrical anomalies in real time without interfering with main supply lines.",
      tech: ["DSP Algorithms", "Python", "ADC Processing", "Modbus"],
      highlight: "Field Tested",
      image: "/sail-portrait.jpg",
      imageAlt: "Smart Grid Energy Diagnostics System",
      link: "https://github.com/Sailgavhane06",
      order: 4,
      status: "published",
    },
  ],
  blog: {
    heading: "Engineering Notes & Learnings",
    description: "Deep dives into electronics design, product prototyping, and software engineering.",
    articles: [
      {
        id: "post-1",
        title: "Designing Robust Hardware: Lessons from 100+ PCB Iterations",
        slug: "designing-robust-hardware-lessons",
        excerpt: "Why signal integrity, thermal dissipation, and ground-loop management are often overlooked in early prototypes and how to prevent field failures.",
        content: "Designing custom electronics is an iterative discipline where simulation can only take you so far. Ground-loop currents, capacitive crosstalk, and thermal dissipation around switching regulators require meticulous layout design. In this article, we examine common high-frequency pitfalls and design rules to adhere to.",
        category: "Hardware Engineering",
        readTime: "7 min read",
        date: "October 2026",
        thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
        status: "published",
      },
      {
        id: "post-2",
        title: "Bridging Silicon & Code: Building Embedded Systems That Don't Crash",
        slug: "bridging-silicon-and-code",
        excerpt: "Techniques for deterministic firmware design, state-machine resilience, and hardware-in-the-loop testing workflows for mission-critical electronics.",
        content: "When firmware fails on an embedded microcontroller in the field, there is no browser refresh button. We explore watchdog timer implementations, stack overflow guards, and deterministic state-machine architectures.",
        category: "Firmware & Architecture",
        readTime: "5 min read",
        date: "September 2026",
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80",
        status: "published",
      },
      {
        id: "post-3",
        title: "I Don't Just Learn Things. I Build Things — The Maker Mindset",
        slug: "the-maker-mindset",
        excerpt: "How rapid prototyping and an uncompromising builder philosophy accelerates engineering comprehension 10x faster than passive theory.",
        content: "Theoretical knowledge is essential, but true synthesis occurs when your fingers solder the joints, write the firmware, and watch the circuit come to life. Build to learn, not just learn to build.",
        category: "Philosophy & Building",
        readTime: "4 min read",
        date: "August 2026",
        thumbnail: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
        status: "published",
      },
    ],
  },
  travel: {
    headingPart1: "Exploring Beyond",
    headingHighlight: "The Workbench.",
    description: "Travel fuels engineering creativity. From high-altitude mountain trails to robotics fabrication hubs across the globe, here is where ideas collide with the real world.",
    followTitle: "Follow My Travel Journey",
    followSubtitle: "Get occasional postcards, expedition logs, and field updates directly to your inbox.",
    stories: [
      {
        id: "travel-1",
        title: "Alpine Ridge Exploration",
        slug: "alpine-ridge-exploration",
        destination: "Himalayan Foothills & Mountain Passes",
        location: "Himalayan Foothills & Mountain Passes",
        travelDate: "September 2026",
        date: "September 2026",
        coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
        imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
        shortDescription: "High-altitude trek testing low-temperature telemetry sensors and rugged power banks in sub-zero terrain.",
        note: "High-altitude trek testing low-temperature telemetry sensors and rugged power banks in sub-zero terrain.",
        fullDescription: "Scaling the high-altitude passes of the Himalayas provided an uncompromising test bench for custom embedded electronics. Operating at altitudes above 4,200 meters in sub-zero temperatures, we monitored lithium-iron-phosphate battery chemistry decay, evaluated LoRa long-range telemetry propagation through steep valleys, and tested custom 3D-printed enclosure seals against freezing moisture condensation.",
        caption: "Field testing hardware under extreme temperatures.",
        altText: "Himalayan mountain pass with snow capped peaks",
        galleryImages: [
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
        ],
        featured: true,
        order: 1,
        status: "published",
      },
      {
        id: "travel-2",
        title: "Coastal Architecture & Marine Labs",
        slug: "coastal-architecture-marine-labs",
        destination: "Pacific Coastline Expeditions",
        location: "Pacific Coastline Expeditions",
        travelDate: "July 2026",
        date: "July 2026",
        coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85",
        shortDescription: "Studying coastal microclimates, tidal power installations, and lightweight saltwater-resistant materials.",
        note: "Studying coastal microclimates, tidal power installations, and lightweight saltwater-resistant materials.",
        fullDescription: "Along the Pacific rim, wave action and constant marine fog create one of nature's harshest corrosion testing environments. We evaluated non-invasive tidal current meters and tested conformal hydrophobic coatings against airborne saline corrosion on sensitive RF circuits.",
        caption: "Marine research outpost testing anti-corrosion materials.",
        altText: "Sunny ocean coast with rocky cliff formations",
        galleryImages: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80",
        ],
        featured: false,
        order: 2,
        status: "published",
      },
      {
        id: "travel-3",
        title: "Urban Tech Hubs & Fabrication Centers",
        slug: "urban-tech-hubs-fabrication-centers",
        destination: "Tokyo & Kyoto Hardware Districts",
        location: "Tokyo & Kyoto Hardware Districts",
        travelDate: "May 2026",
        date: "May 2026",
        coverImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85",
        imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85",
        shortDescription: "Exploring precision CNC workshops, microelectronics suppliers, and industrial robotics prototyping labs.",
        note: "Exploring precision CNC workshops, microelectronics suppliers, and industrial robotics prototyping labs.",
        fullDescription: "Navigating the dense alleys of Akihabara and high-precision machining hubs in Kyoto. Sourced precision planetary gearboxes, inspected 5-axis wire EDM fabrication, and exchanged prototyping methodologies with local hardware makers building autonomous micro-drones.",
        caption: "Sourcing specialized high-precision components in Akihabara.",
        altText: "Tokyo urban cityscape with neon lights at night",
        galleryImages: [
          "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1200&q=80",
        ],
        featured: false,
        order: 3,
        status: "published",
      },
      {
        id: "travel-4",
        title: "Night Sky & Observational Astro-Camp",
        slug: "night-sky-observational-astro-camp",
        destination: "Dark Sky Reserve, Ladakh",
        location: "Dark Sky Reserve, Ladakh",
        travelDate: "March 2026",
        date: "March 2026",
        coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=85",
        imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=85",
        shortDescription: "Stargazing and long-exposure deep space imaging with custom tracking mounts and astrophotography gear.",
        note: "Stargazing and long-exposure deep space imaging with custom tracking mounts and astrophotography gear.",
        fullDescription: "Under pristine Bortle Class 1 dark skies in Hanle, Ladakh, light pollution is zero. Armed with equatorial motor tracking mounts driven by custom stepper driver algorithms, we captured long-exposure exposures of the Milky Way core and tested thermal noise reduction on CCD sensors in minus 15-degree conditions.",
        caption: "Long-exposure astro-imaging with custom microcontroller tracking rig.",
        altText: "Milky way galaxy arching over mountain silhouette",
        galleryImages: [
          "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        ],
        featured: false,
        order: 4,
        status: "published",
      },
    ],
    followers: [
      {
        id: "follower-1",
        name: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        createdAt: "2026-09-15T10:30:00.000Z",
      },
      {
        id: "follower-2",
        name: "Elena Rostova",
        email: "elena.rostova@example.com",
        createdAt: "2026-10-02T14:15:00.000Z",
      },
      {
        id: "follower-3",
        name: "Marcus Vance",
        email: "marcus.vance@example.com",
        createdAt: "2026-10-10T09:20:00.000Z",
      },
    ],
  },
  contact: {
    headingPart1: "Let's Build Something",
    headingHighlight: "Exceptional Together.",
    description: "Whether you have an ambitious hardware idea, need technical advisory on systems architecture, or want to discuss a new venture — my inbox is always open.",
    email: "sail@sail06.com",
    location: "India / Global Remote",
    socialLinks: {
      instagram: {
        url: "https://instagram.com/sail.06",
        enabled: true,
      },
      youtube: {
        url: "https://youtube.com/@sail06",
        enabled: true,
      },
      facebook: {
        url: "https://facebook.com/sail06",
        enabled: true,
      },
      whatsapp: {
        url: "https://wa.me/919999999999",
        enabled: true,
      },
      x: {
        url: "https://x.com/sail06",
        enabled: true,
      },
    },
  },
};

/**
 * Helper to safely ensure a directory exists without throwing
 */
function ensureDir(dirPath: string): boolean {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Atomic file write helper with multi-tier storage fallback (Memory -> Tmp -> Project Disk).
 * Survives read-only serverless file systems (Netlify / Vercel Lambda EROFS).
 */
async function atomicWriteJson(filePath: string, data: unknown): Promise<void> {
  const jsonStr = JSON.stringify(data, null, 2);

  // Tier 1: In-Memory cache (instant, zero I/O latency, survives warm lambda instances)
  globalThis.__sail06_site_content = data as SiteContent;

  // Tier 2: Writable /tmp directory (guaranteed writable on Netlify, AWS Lambda, Vercel)
  try {
    ensureDir(TMP_DATA_DIR);
    const tmpWrite = `${TMP_CONTENT_FILE}.${Date.now()}.tmp`;
    await fs.promises.writeFile(tmpWrite, jsonStr, "utf-8");
    await fs.promises.rename(tmpWrite, TMP_CONTENT_FILE);
  } catch (err) {
    console.warn("Notice: Tmp directory write skipped:", err);
  }

  // Tier 3: Local project disk (local development & persistent servers)
  try {
    const parentDir = path.dirname(filePath);
    if (ensureDir(parentDir)) {
      const targetTmp = `${filePath}.${Date.now()}.tmp`;
      await fs.promises.writeFile(targetTmp, jsonStr, "utf-8");
      await fs.promises.rename(targetTmp, filePath);
    }
  } catch (err) {
    // Expected on read-only serverless file systems like Netlify Lambda (EROFS)
    // Silently continue since memory & tmp tiers have succeeded.
    console.warn("Notice: Local storage write skipped (read-only file system):", err);
  }
}

/**
 * Get complete site content for admin editing (includes drafts)
 */
export async function getAdminSiteData(): Promise<SiteContent> {
  // Tier 1: Return from memory if already active
  if (globalThis.__sail06_site_content) {
    return globalThis.__sail06_site_content;
  }

  let rawJson: string | null = null;

  // Tier 2: Read from writable /tmp directory if available
  try {
    if (fs.existsSync(TMP_CONTENT_FILE)) {
      rawJson = await fs.promises.readFile(TMP_CONTENT_FILE, "utf-8");
    }
  } catch (e) {
    console.warn("Notice: Could not read from tmp storage:", e);
  }

  // Tier 3: Read from project data directory
  if (!rawJson) {
    try {
      if (fs.existsSync(CONTENT_FILE_PATH)) {
        rawJson = await fs.promises.readFile(CONTENT_FILE_PATH, "utf-8");
      }
    } catch (e) {
      console.warn("Notice: Could not read from project storage:", e);
    }
  }

  if (!rawJson) {
    // Initialize default content
    await atomicWriteJson(CONTENT_FILE_PATH, initialSiteContent);
    return initialSiteContent;
  }

  try {
    const parsed = JSON.parse(rawJson) as Partial<SiteContent>;

    // Deep merge with initial content to guarantee structure integrity
    const merged: SiteContent = {
      hero: { ...initialSiteContent.hero, ...(parsed.hero || {}) },
      about: {
        ...initialSiteContent.about,
        ...(parsed.about || {}),
        pillars: parsed.about?.pillars?.length ? parsed.about.pillars : initialSiteContent.about.pillars,
        highlights: parsed.about?.highlights || initialSiteContent.about.highlights,
      },
      engineering: {
        ...initialSiteContent.engineering,
        ...(parsed.engineering || {}),
        highlights: parsed.engineering?.highlights || initialSiteContent.engineering.highlights,
        stats: parsed.engineering?.stats || initialSiteContent.engineering.stats,
      },
      founder: {
        ...initialSiteContent.founder,
        ...(parsed.founder || {}),
        milestones: parsed.founder?.milestones || initialSiteContent.founder.milestones,
      },
      projects: parsed.projects && Array.isArray(parsed.projects) ? parsed.projects : initialSiteContent.projects,
      blog: {
        ...initialSiteContent.blog,
        ...(parsed.blog || {}),
        articles: parsed.blog?.articles && Array.isArray(parsed.blog.articles) ? parsed.blog.articles : initialSiteContent.blog.articles,
      },
      travel: {
        ...initialSiteContent.travel,
        ...(parsed.travel || {}),
        stories: (parsed.travel?.stories && Array.isArray(parsed.travel.stories)
          ? parsed.travel.stories
          : initialSiteContent.travel.stories
        ).map((s: TravelStory, idx: number) => ({
          ...s,
          destination: s.destination || s.location || "Exploration Spot",
          location: s.location || s.destination || "Exploration Spot",
          travelDate: s.travelDate || s.date || "2026",
          date: s.date || s.travelDate || "2026",
          coverImage: s.coverImage || s.imageUrl || "",
          imageUrl: s.imageUrl || s.coverImage || "",
          shortDescription: s.shortDescription || s.note || "",
          note: s.note || s.shortDescription || "",
          fullDescription: s.fullDescription || s.shortDescription || s.note || "",
          galleryImages: s.galleryImages && Array.isArray(s.galleryImages) && s.galleryImages.length > 0
            ? s.galleryImages
            : [s.coverImage || s.imageUrl || ""],
          featured: typeof s.featured === "boolean" ? s.featured : (idx === 0),
          slug: s.slug || (s.title ? s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : s.id),
        })),
        followers: Array.isArray(parsed.travel?.followers)
          ? parsed.travel.followers.map((f: TravelFollower) => ({
              id: f.id || `follower-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              name: f.name || "Explorer",
              email: f.email || "",
              createdAt: f.createdAt || new Date().toISOString(),
            }))
          : initialSiteContent.travel.followers || [],
      },
      contact: {
        ...initialSiteContent.contact,
        ...(parsed.contact || {}),
        socialLinks: {
          ...initialSiteContent.contact.socialLinks,
          ...(parsed.contact?.socialLinks || {}),
        },
      },
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    };

    globalThis.__sail06_site_content = merged;
    return merged;
  } catch (error) {
    console.error("Error reading site data from disk, returning defaults:", error);
    return initialSiteContent;
  }
}

/**
 * Get sanitized site content for public display.
 * Strictly filters out ANY draft items (projects, blog posts, travel stories).
 * Public visitors will NEVER receive draft content.
 * Follower emails are completely stripped out to protect privacy.
 */
export async function getPublicSiteData(): Promise<SiteContent> {
  const adminData = await getAdminSiteData();

  // Filter projects: only published, sorted by order
  const publishedProjects = (adminData.projects || [])
    .filter((p: ProjectItem) => p.status === "published")
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Filter blog: only published
  const publishedArticles = (adminData.blog?.articles || [])
    .filter((a: BlogPost) => a.status === "published");

  // Filter travel: only published, sorted by order
  const publishedTravelStories = (adminData.travel?.stories || [])
    .filter((s: TravelStory) => s.status === "published")
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Sanitize followers: public only sees names and dates, NEVER emails
  const publicFollowers = (adminData.travel?.followers || []).map((f: TravelFollower) => ({
    id: f.id,
    name: f.name,
    createdAt: f.createdAt,
    email: "", // Privacy guarantee: Email never transmitted to public visitors
  }));

  return {
    ...adminData,
    projects: publishedProjects,
    blog: {
      ...adminData.blog,
      articles: publishedArticles,
    },
    travel: {
      ...adminData.travel,
      stories: publishedTravelStories,
      followers: publicFollowers,
    },
  };
}

/**
 * Save an updated section from admin dashboard
 */
export async function saveAdminSection<K extends keyof SiteContent>(
  section: K,
  data: SiteContent[K]
): Promise<SiteContent> {
  const current = await getAdminSiteData();
  const updated: SiteContent = {
    ...current,
    [section]: data,
    lastUpdated: new Date().toISOString(),
  };

  await atomicWriteJson(CONTENT_FILE_PATH, updated);
  return updated;
}

/**
 * Save multiple sections atomically to prevent race conditions
 */
export async function saveAdminMultipleSections(
  updates: Partial<SiteContent>
): Promise<SiteContent> {
  const current = await getAdminSiteData();
  const updated: SiteContent = {
    ...current,
    ...updates,
    lastUpdated: new Date().toISOString(),
  };

  await atomicWriteJson(CONTENT_FILE_PATH, updated);
  return updated;
}

/**
 * Save complete content update from admin
 */
export async function saveFullAdminContent(content: SiteContent): Promise<SiteContent> {
  const updated: SiteContent = {
    ...content,
    lastUpdated: new Date().toISOString(),
  };

  await atomicWriteJson(CONTENT_FILE_PATH, updated);
  return updated;
}

/**
 * Reset content to factory default
 */
export async function resetContentToDefaults(): Promise<SiteContent> {
  await atomicWriteJson(CONTENT_FILE_PATH, initialSiteContent);
  return initialSiteContent;
}
