import { LucideIcon } from "lucide-react-native";
import { ViewStyle } from "react-native";

export type TimerPriority = "urgent" | "high" | "normal" | "low" | "break";

export interface PriorityTheme {
  primary: string;
  secondary: string;
  glow: string;
  soft: string;
  label: string;
  Icon: LucideIcon;
}

export type PriorityThemes = Record<TimerPriority, PriorityTheme>;

export interface EnhancedTimerRingProps {
  minutes: number;
  seconds: number;
  progress: number;
  isBreak: boolean;
  isIdle: boolean;
  taskName: string;
  currentBlock: number;
  totalBlocks: number;
  priority?: TimerPriority;
  hideBlockProgress?: boolean;
  endTime?: Date;
  nextBlockName?: string;
}

export interface TimerRingProgressProps {
  theme: PriorityTheme;
  ringContainerStyle: ViewStyle;
  glowStyle: ViewStyle;
  progressStrokeStyle: object;
  indicatorStyle: ViewStyle;
}

export interface TimerRingContentProps {
  minutes: number;
  seconds: number;
  taskName: string;
  currentBlock: number;
  totalBlocks: number;
  hideBlockProgress: boolean;
  endTime?: Date;
  colonStyle: ViewStyle;
  theme: PriorityTheme;
}

export interface TimerRingFooterProps {
  progress: number;
  currentBlock: number;
  totalBlocks: number;
  hideBlockProgress: boolean;
  nextBlockName?: string;
  theme: PriorityTheme;
}

export interface StatusBadgeProps {
  theme: PriorityTheme;
  priority: TimerPriority;
  isBreak: boolean;
}

export interface TimerAnimations {
  colonOpacity: { value: number };
  ringProgress: { value: number };
  breatheScale: { value: number };
  glowOpacity: { value: number };
  contentOpacity: { value: number };
}

export interface ProgressPillProps {
  progress: number;
  theme: PriorityTheme;
}

export interface NextBlockCardProps {
  nextBlockName: string;
}

export interface BlockProgressDotsProps {
  currentBlock: number;
  totalBlocks: number;
  theme: PriorityTheme;
}

export interface TimeDisplayProps {
  minutes: number;
  seconds: number;
  colonStyle: ViewStyle;
  theme: PriorityTheme;
}
