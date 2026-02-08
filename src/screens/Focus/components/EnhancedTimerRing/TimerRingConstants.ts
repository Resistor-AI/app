import { Target, Flame, Zap, Coffee } from "lucide-react-native";
import { PriorityThemes } from "@/src/types/Focus/TimerRing";

// Re-export ring dimensions from lib
export { RING_SIZE, STROKE_WIDTH, RADIUS, CIRCUMFERENCE } from "@/src/lib/constants/timerRing";

// Priority color system with icons (kept here because it has component dependencies)
export const PRIORITY_THEMES: PriorityThemes = {
  urgent: {
    primary: "#ff4757",
    secondary: "#ff6b7a",
    glow: "rgba(255, 71, 87, 0.3)",
    soft: "rgba(255, 71, 87, 0.15)",
    label: "URGENT",
    Icon: Flame,
  },
  high: {
    primary: "#ffa502",
    secondary: "#ffbe4d",
    glow: "rgba(255, 165, 2, 0.3)",
    soft: "rgba(255, 165, 2, 0.15)",
    label: "HIGH PRIORITY",
    Icon: Zap,
  },
  normal: {
    primary: "#7c5dfa",
    secondary: "#9f8afb",
    glow: "rgba(124, 93, 250, 0.3)",
    soft: "rgba(124, 93, 250, 0.15)",
    label: "DEEP FOCUS",
    Icon: Target,
  },
  low: {
    primary: "#636e72",
    secondary: "#7f8c8d",
    glow: "rgba(99, 110, 114, 0.25)",
    soft: "rgba(99, 110, 114, 0.15)",
    label: "LOW PRIORITY",
    Icon: Target,
  },
  break: {
    primary: "#00d2d3",
    secondary: "#5ce1e6",
    glow: "rgba(0, 210, 211, 0.3)",
    soft: "rgba(0, 210, 211, 0.15)",
    label: "BREAK TIME",
    Icon: Coffee,
  },
};
