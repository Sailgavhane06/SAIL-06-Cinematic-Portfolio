export interface SiteData {
  hero: {
    greeting: string;
    name: string;
    rolesLine1: string;
    rolesLine2: string;
    descriptionLine1: string;
    descriptionLine2: string;
    rightTaglineLine1: string;
    rightTaglineLine2: string;
    rightTaglineLine3: string;
    experienceYears: string;
    experienceLine1: string;
    experienceLine2: string;
  };
  about: {
    quotePart1: string;
    quoteHighlight: string;
    bio: string;
    pillars: Array<{
      title: string;
      desc: string;
    }>;
  };
  projects: Array<{
    title: string;
    category: string;
    desc: string;
    tech: string[];
    highlight: string;
  }>;
  contact: {
    headingPart1: string;
    headingHighlight: string;
    description: string;
    email: string;
    location: string;
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
  },
  about: {
    quotePart1: "I don't just learn things.",
    quoteHighlight: "I build things.",
    bio: "I am Sail Gavhane — an electrical engineer, software builder, and founder driven by curiosity and an uncompromising commitment to craftsmanship. I merge the precision of hardware with the agility of modern software to build real-world solutions.",
    pillars: [
      {
        title: "Electrical Engineer",
        desc: "Designing intelligent circuit systems, embedded hardware, and high-performance electronic solutions with precision.",
      },
      {
        title: "Software & Systems Builder",
        desc: "Bridging the gap between silicon and software — architecting full-stack web platforms, firmware, and scalable tools.",
      },
      {
        title: "Creative Technologist",
        desc: "Rapid prototyping from 0 to 1. Transforming complex scientific principles into tangible, elegant physical devices.",
      },
      {
        title: "Founder & Innovator",
        desc: "Building user-centric products and ventures that address real-world engineering bottlenecks and create lasting value.",
      },
    ],
  },
  projects: [
    {
      title: "Autonomous IoT Sensor Mesh",
      category: "Hardware & Embedded Systems",
      desc: "Low-power edge computing nodes utilizing custom PCB architectures, telemetry transceivers, and real-time sensor fusion algorithms.",
      tech: ["KiCad", "STM32", "C++", "MQTT", "FreeRTOS"],
      highlight: "Custom PCB Design",
    },
    {
      title: "Kinetic Motor Controller & Inverter",
      category: "Power Electronics",
      desc: "High-efficiency BLDC motor driver designed for robotic actuators, featuring field-oriented control (FOC) and regenerative braking safety circuits.",
      tech: ["Power MOSFETs", "Embedded C", "CAN Bus", "Thermal Modeling"],
      highlight: "High Efficiency 98.4%",
    },
    {
      title: "SAIL.06 Studio Platform",
      category: "Full-Stack Software Architecture",
      desc: "High-performance interactive web application built with modern reactive principles, dynamic telemetry visualizers, and minimal latency API pipelines.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
      highlight: "Sub-50ms Latency",
    },
    {
      title: "Smart Grid Energy Diagnostics",
      category: "Industrial Automation",
      desc: "Non-invasive current sensing architecture capable of detecting power anomalies, harmonic distortions, and micro-surges across industrial installations.",
      tech: ["DSP Algorithms", "Python", "ADC Processing", "Modbus"],
      highlight: "Field Tested",
    },
  ],
  contact: {
    headingPart1: "Let's Build Something",
    headingHighlight: "Exceptional Together.",
    description: "Whether you have an ambitious hardware idea, need technical advisory on systems architecture, or want to discuss a new venture — my inbox is always open.",
    email: "sail@sail06.com",
    location: "India / Global Remote",
  },
};
