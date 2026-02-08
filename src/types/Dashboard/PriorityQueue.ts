import { FocusSettings } from "@/modules/installed-apps";
import { ScheduleBlock, TaskPriority } from "@/src/types/Focus";

export interface PriorityQueueData {
  id?: string;
  status?: string;
  color?: string;
  title?: string;
  count?: number | string;
  subtitle?: string;
  description?: string;
  duration?: string;
  [key: string]: any;
}

export interface PriorityQueueProps {
  settings?: FocusSettings;
  data?: PriorityQueueData[];
}

export interface ItemCardProps {
  item: PriorityQueueData;
}

export interface QueueItem {
  status: string;
  id: string;
  block?: ScheduleBlock;
  isBreak?: boolean;
  priority?: TaskPriority;
  startsIn?: number;
  durationMinutes?: number;
  breakCount?: number;
}

export interface TimerState {
  timeLeft: string;
  progress: number;
  isWaitingToStart: boolean;
}

export interface CurrentBlockInfo {
  block: ScheduleBlock;
  blockIndex: number;
  totalFocusBlocks: number;
  isBreak: boolean;
  priority: TaskPriority;
  breakCount: number;
}

export interface PendingCardProps {
  index: number;
  title: string;
  priority: TaskPriority;
  isBreak: boolean;
  startsIn: number;
  durationMinutes: number;
  breakCount?: number;
  onPress?: () => void;
}

export interface ExtendedItemCardProps extends ItemCardProps {
  index?: number;
}
