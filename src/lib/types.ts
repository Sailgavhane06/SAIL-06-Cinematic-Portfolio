export type PublicationStatus = "draft" | "published";

export interface HeroContent {
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
  portraitImage?: string;
}

export interface AboutPillar {
  id: string;
  title: string;
  desc: string;
  icon?: string;
}

export interface AboutContent {
  quotePart1: string;
  quoteHighlight: string;
  bio: string;
  profilePhoto?: string;
  pillars: AboutPillar[];
  highlights?: string[];
}

export interface EngineeringStat {
  label: string;
  value: string;
}

export interface EngineeringContent {
  heading: string;
  description: string;
  highlights: string[];
  stats?: EngineeringStat[];
}

export interface FounderMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  link?: string;
}

export interface FounderContent {
  heading: string;
  missionStatement: string;
  description: string;
  milestones: FounderMilestone[];
  ctaText?: string;
  ctaLink?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  date: string;
  thumbnail?: string;
  status: PublicationStatus;
}

export interface BlogContent {
  heading: string;
  description: string;
  articles: BlogPost[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  desc: string;
  detailedDesc?: string;
  tech: string[];
  highlight: string;
  image?: string;
  imageAlt?: string;
  link?: string;
  order: number;
  status: PublicationStatus;
}

export interface TravelStory {
  id: string;
  title: string;
  slug?: string;
  destination: string;
  location?: string; // Backwards compatibility
  travelDate: string;
  date?: string; // Backwards compatibility
  coverImage: string;
  imageUrl?: string; // Backwards compatibility
  shortDescription: string;
  note?: string; // Backwards compatibility
  fullDescription?: string;
  caption?: string;
  altText?: string;
  galleryImages?: string[];
  featured?: boolean;
  order: number;
  status: PublicationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface TravelContent {
  headingPart1: string;
  headingHighlight: string;
  description: string;
  followTitle: string;
  followSubtitle: string;
  stories: TravelStory[];
}

export interface SocialLinkConfig {
  url: string;
  enabled: boolean;
}

export interface ContactContent {
  headingPart1: string;
  headingHighlight: string;
  description: string;
  email: string;
  location: string;
  socialLinks: {
    instagram: SocialLinkConfig;
    youtube: SocialLinkConfig;
    facebook: SocialLinkConfig;
    whatsapp: SocialLinkConfig;
    x: SocialLinkConfig;
  };
}

export interface SiteContent {
  hero: HeroContent;
  about: AboutContent;
  engineering: EngineeringContent;
  founder: FounderContent;
  projects: ProjectItem[];
  blog: BlogContent;
  travel: TravelContent;
  contact: ContactContent;
  lastUpdated?: string;
}
