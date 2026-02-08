import { LucideIcon } from "lucide-react-native";
import { TaskPriority } from "@/src/types/Focus";

export interface ActiveCardProps {
  isActive?: boolean;
  timeLeft: string;
  progress: number;
}

export interface ExtendedActiveCardProps extends ActiveCardProps {
  index?: number;
  onPress?: () => void;
  taskName?: string;
  priority?: TaskPriority;
  isBreak?: boolean;
  currentBlock?: number;
  totalBlocks?: number;
  isWaitingToStart?: boolean;
  breakCount?: number;
}

export interface PriorityConfigItem {
  accent: string;
  bg: string;
  border: string;
  glow: string;
  label: string;
  Icon: LucideIcon;
}

export interface PriorityConfigMap {
  urgent: PriorityConfigItem;
  high: PriorityConfigItem;
  normal: PriorityConfigItem;
  low: PriorityConfigItem;
}

export interface ActiveCardOfflineProps {
  entryStyle: object;
}

export interface ActiveCardActiveProps {
  config: PriorityConfigItem;
  displayTitle: string;
  priority: TaskPriority;
  isBreak: boolean;
  currentBlock: number;
  totalBlocks: number;
  isWaitingToStart: boolean;
  timeLeft: string;
  progress: number;
  entryStyle: object;
  pressStyle: object;
  pulseStyle: object;
  glowStyle: object;
  onPress?: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  breakCount?: number;
}

export interface ActiveCardHeaderProps {
  config: PriorityConfigItem;
  priority: TaskPriority;
  isBreak: boolean;
  isWaitingToStart: boolean;
  pulseStyle: object;
}

export interface BlockProgressProps {
  currentBlock: number;
  totalBlocks: number;
  accent: string;
  isWaitingToStart: boolean;
}

export interface ActiveCardTimerProps {
  isWaitingToStart: boolean;
  timeLeft: string;
  progress: number;
  accent: string;
}
