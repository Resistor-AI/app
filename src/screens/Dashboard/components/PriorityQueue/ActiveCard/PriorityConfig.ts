import { Flame, Zap, Target, Coffee } from "lucide-react-native";
import { PriorityConfigItem, PriorityConfigMap } from "@/src/types/Dashboard/ActiveCard";

export const PRIORITY_CONFIG: PriorityConfigMap = {
  urgent: {
    accent: "#ef4444",
    bg: "#ef444420",
    border: "#ef444440",
    glow: "#ef444430",
    label: "Urgent",
    Icon: Flame,
  },
  high: {
    accent: "#f59e0b",
    bg: "#f59e0b20",
    border: "#f59e0b40",
    glow: "#f59e0b30",
    label: "High",
    Icon: Zap,
  },
  normal: {
    accent: "#6366f1",
    bg: "#6366f120",
    border: "#6366f140",
    glow: "#6366f130",
    label: "Focus",
    Icon: Target,
  },
  low: {
    accent: "#71717a",
    bg: "#71717a20",
    border: "#71717a40",
    glow: "#71717a30",
    label: "Low",
    Icon: Target,
  },
};

export const BREAK_CONFIG: PriorityConfigItem = {
  accent: "#10b981",
  bg: "#10b98120",
  border: "#10b98140",
  glow: "#10b98130",
  label: "Break",
  Icon: Coffee,
};

export const PENDING_PRIORITY_CONFIG: PriorityConfigMap = {
  urgent: { accent: "#ef4444", bg: "#ef444415", border: "#ef444425", glow: "transparent", label: "Urgent", Icon: Flame },
  high: { accent: "#f59e0b", bg: "#f59e0b15", border: "#f59e0b25", glow: "transparent", label: "High", Icon: Zap },
  normal: { accent: "#6366f1", bg: "#6366f115", border: "#6366f125", glow: "transparent", label: "Focus", Icon: Target },
  low: { accent: "#71717a", bg: "#71717a15", border: "#71717a25", glow: "transparent", label: "Low", Icon: Target },
};

export const PENDING_BREAK_CONFIG: PriorityConfigItem = {
  accent: "#10b981", bg: "#10b98115", border: "#10b98125", glow: "transparent", label: "Break", Icon: Coffee,
};
