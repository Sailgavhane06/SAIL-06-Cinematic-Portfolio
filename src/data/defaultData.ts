import {
  SiteContent,
  HeroContent,
  AboutContent,
  ProjectItem,
  BlogContent,
  BlogPost,
  TravelStory,
} from "@/lib/types";

export interface SiteData {
  hero: HeroContent;
  about: AboutContent;
  projects: ProjectItem[];
  blog: {
    heading: string;
    description: string;
    articles: BlogPost[];
  };
  travel: {
    headingPart1: string;
    headingHighlight: string;
    description: string;
    followTitle: string;
    followSubtitle: string;
    stories?: TravelStory[];
  };
  contact: {
    headingPart1: string;
    headingHighlight: string;
    description: string;
    email: string;
    location: string;
  };
  socialLinks: {
    instagram: string;
    youtube: string;
    facebook: string;
    whatsapp: string;
    x: string;
  };
}

export const defaultSiteData: SiteData = {
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
  projects: [
    {
      id: "project-1",
      title: "Autonomous IoT Sensor Mesh",
      category: "Hardware & Embedded Systems",
      desc: "Low-power edge computing nodes utilizing custom PCB architectures, telemetry transceivers, and real-time sensor fusion algorithms.",
      detailedDesc: "Multi-point wireless sensor mesh built for harsh industrial environments.",
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
      detailedDesc: "Designed with isolated gate drivers and low RDS(on) MOSFETs to minimize thermal losses.",
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
      detailedDesc: "Cinematic portfolio and content engine engineered with Next.js App Router.",
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
      detailedDesc: "Employs high-speed analog front-ends with DSP filtering algorithms to classify electrical anomalies.",
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
        content: "Designing custom electronics is an iterative discipline where simulation can only take you so far.",
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
        content: "When firmware fails on an embedded microcontroller in the field, there is no browser refresh button.",
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
        content: "Theoretical knowledge is essential, but true synthesis occurs when your fingers solder the joints.",
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
  },
  contact: {
    headingPart1: "Let's Build Something",
    headingHighlight: "Exceptional Together.",
    description: "Whether you have an ambitious hardware idea, need technical advisory on systems architecture, or want to discuss a new venture — my inbox is always open.",
    email: "sail@sail06.com",
    location: "India / Global Remote",
  },
  socialLinks: {
    instagram: "https://instagram.com/sail.06",
    youtube: "https://youtube.com/@sail06",
    facebook: "https://facebook.com/sail06",
    whatsapp: "https://wa.me/919999999999",
    x: "https://x.com/sail06",
  },
};
