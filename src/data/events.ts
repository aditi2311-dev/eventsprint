import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Code2,
  GraduationCap,
  Mic,
  Palette,
  Rocket,
  ShieldCheck,
  Smartphone,
  Trophy,
} from "lucide-react";

export type EventCategory = "Hackathon" | "Workshop" | "Competition" | "Talk";
export type EventMode = "Online" | "On-campus";
export type TintKey =
  | "indigo"
  | "sky"
  | "emerald"
  | "amber"
  | "rose"
  | "violet"
  | "teal"
  | "orange";

export interface TechEvent {
  id: string;
  name: string;
  category: EventCategory;
  mode: EventMode;
  /** ISO date string (event start) */
  date: string;
  /** ISO date string (event end, optional) */
  endDate?: string;
  time: string;
  venue: string;
  description: string;
  spots: number;
  spotsLeft: number;
  tags: string[];
  tint: TintKey;
  icon: LucideIcon;
  featured?: boolean;
}

export const CATEGORY_META: Record<
  EventCategory,
  { icon: LucideIcon; blurb: string }
> = {
  Hackathon: {
    icon: Code2,
    blurb: "48-hour build sprints where ideas ship as working products.",
  },
  Workshop: {
    icon: GraduationCap,
    blurb: "Hands-on sessions to learn in-demand skills from the pros.",
  },
  Competition: {
    icon: Trophy,
    blurb: "Battle it out in challenges that test creativity and craft.",
  },
  Talk: {
    icon: Mic,
    blurb: "Insightful talks from engineers and builders in the field.",
  },
};

export const CATEGORIES: EventCategory[] = [
  "Hackathon",
  "Workshop",
  "Competition",
  "Talk",
];

export const EVENTS: TechEvent[] = [
  {
    id: "web-sprint-2026",
    name: "WebSprint 2026",
    category: "Hackathon",
    mode: "On-campus",
    date: "2026-09-18",
    endDate: "2026-09-20",
    time: "10:00 AM",
    venue: "Main Auditorium, Block A",
    description:
      "The flagship 48-hour build sprint. Form a team of up to 4, pick a theme, and ship a working web product before the clock runs out. Mentors, meals and swag included.",
    spots: 200,
    spotsLeft: 48,
    tags: ["48 hours", "Teams of 4", "Build from scratch"],
    tint: "indigo",
    icon: Rocket,
    featured: true,
  },
  {
    id: "ai-ml-bootcamp",
    name: "AI & ML Bootcamp",
    category: "Workshop",
    mode: "On-campus",
    date: "2026-08-29",
    time: "9:30 AM",
    venue: "Innovation Lab, Block C",
    description:
      "A full-day, hands-on introduction to machine learning. Train your first model, understand the math that matters, and walk away with a project you built yourself.",
    spots: 60,
    spotsLeft: 12,
    tags: ["Beginner friendly", "Laptop required"],
    tint: "violet",
    icon: Bot,
    featured: true,
  },
  {
    id: "hack-the-future",
    name: "Hack the Future",
    category: "Hackathon",
    mode: "Online",
    date: "2026-10-09",
    endDate: "2026-10-11",
    time: "6:00 PM",
    venue: "Online · Global",
    description:
      "A 48-hour virtual hackathon focused on climate, health and civic tech. Build for a better tomorrow with builders from 40+ colleges, judged by industry leaders.",
    spots: 300,
    spotsLeft: 120,
    tags: ["Remote", "Global", "Prizes worth ₹1L"],
    tint: "emerald",
    icon: Code2,
  },
  {
    id: "web-dev-masterclass",
    name: "Web Dev Masterclass",
    category: "Workshop",
    mode: "Online",
    date: "2026-09-05",
    time: "4:00 PM",
    venue: "Online · Live session",
    description:
      "From semantic HTML to modern CSS and JavaScript fundamentals — a crash course that turns beginners into builders. Live coding, Q&A, and a starter kit included.",
    spots: 150,
    spotsLeft: 35,
    tags: ["Basics to beyond", "Live Q&A", "Free starter kit"],
    tint: "sky",
    icon: Code2,
  },
  {
    id: "cyberquest-ctf",
    name: "CyberQuest: Capture the Flag",
    category: "Competition",
    mode: "Online",
    date: "2026-09-12",
    time: "11:00 AM",
    venue: "Online · CTF platform",
    description:
      "Solve web, crypto and reverse-engineering challenges to capture flags and climb the leaderboard. Solo or duo — the fastest hackers take home the glory.",
    spots: 120,
    spotsLeft: 40,
    tags: ["Web", "Crypto", "Reverse engineering"],
    tint: "rose",
    icon: ShieldCheck,
    featured: true,
  },
  {
    id: "uiux-design-sprint",
    name: "UI/UX Design Sprint",
    category: "Competition",
    mode: "On-campus",
    date: "2026-10-17",
    time: "10:00 AM",
    venue: "Design Studio, Block B",
    description:
      "Design a product from a surprise brief in under 8 hours — wireframes to high-fidelity prototype. Portfolio pieces, mentorship, and real feedback from product designers.",
    spots: 80,
    spotsLeft: 22,
    tags: ["8 hours", "Figma", "Portfolio piece"],
    tint: "amber",
    icon: Palette,
  },
  {
    id: "scaling-systems-talk",
    name: "Scaling Systems: A Tech Talk",
    category: "Talk",
    mode: "On-campus",
    date: "2026-11-07",
    time: "3:00 PM",
    venue: "Main Auditorium, Block A",
    description:
      "How does a weekend project become a platform serving millions? Engineers from leading product companies break down real-world scaling stories, with an open Q&A.",
    spots: 250,
    spotsLeft: 90,
    tags: ["Open Q&A", "Networking", "Engineer stories"],
    tint: "teal",
    icon: Mic,
  },
  {
    id: "flutter-fast-track",
    name: "Flutter Fast-Track",
    category: "Workshop",
    mode: "Online",
    date: "2026-11-21",
    time: "5:00 PM",
    venue: "Online · Live session",
    description:
      "Build and ship a mobile app in one weekend with Flutter. Learn widgets, state and navigation by building a real app — no prior mobile experience needed.",
    spots: 100,
    spotsLeft: 64,
    tags: ["Weekend sprint", "Cross-platform", "No prior mobile"],
    tint: "orange",
    icon: Smartphone,
  },
];

export function getEventById(id: string): TechEvent | undefined {
  return EVENTS.find((event) => event.id === id);
}

export function getUpcomingEvents(): TechEvent[] {
  const now = Date.now();
  return EVENTS.filter((event) => new Date(event.date).getTime() >= now).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

export function getFeaturedEvents(): TechEvent[] {
  return EVENTS.filter((event) => event.featured);
}
