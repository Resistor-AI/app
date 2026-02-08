import { COLORS } from "./colors";

/**
 * Static data for onboarding screens
 */

export const PILLARS = [
  {
    icon: "🧠",
    title: "The Brain",
    desc: "AI schedules your focus",
    color: COLORS.electricBlue,
  },
  {
    icon: "🛡️",
    title: "The Shield",
    desc: "Blocks distractions",
    color: COLORS.amber,
  },
  {
    icon: "❤️",
    title: "The Heart",
    desc: "Protects your energy",
    color: COLORS.successGreen,
  },
  {
    icon: "👥",
    title: "The Squad",
    desc: "Keeps you accountable",
    color: COLORS.deepPurple,
  },
] as const;

export const PERMISSIONS = [
  {
    key: "notifications" as const,
    icon: "🔔",
    title: "Notifications",
    desc: "Gentle reminders to stay on track",
  },
  {
    key: "accessibility" as const,
    icon: "🔓",
    title: "App Blocking",
    desc: "Required to detect and block distracting apps",
  },
] as const;



export const USER_ROLES = [
  { id: "student", icon: "📚", label: "Student" },
  { id: "worker", icon: "💼", label: "Worker" },
  { id: "freelancer", icon: "💻", label: "Freelancer" },
  { id: "creator", icon: "🎨", label: "Creator" },
] as const;

export const ROLES = ["Student", "Professional", "Entrepreneur", "Creative", "Developer", "Other"] as const;

export const ROLLING_WORDS = ["Focus", "Energy", "Life", "Brain", "Work"] as const;

export const NOTIFICATION_BULLET_POINTS: string[] = [
  "Remind you to maintain your focus streaks",
  "Alert you when the Shield blocks apps",
  "Keep you accountable to your daily goals",
];
