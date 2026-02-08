import { ScheduleBlock } from "./index";

export interface FocusBlockData {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  totalDuration: number;
  focusDuration: number;
  breakDuration: number;
  breakCount: number;
  priority?: string;
  taskName?: string;
  notes?: string | null;
  segments: {
    type: "focus" | "break";
    duration: number;
    title?: string;
  }[];
}

export interface FocusBlockCardProps {
  block: FocusBlockData;
  index: number;
}

export interface FocusBlockExpandedProps {
  block: FocusBlockData;
}

export interface ScheduleErrorStateProps {
  error: string;
  onRetry: () => void;
}

export interface ScheduleSummaryProps {
  totalFocusMinutes: number;
  totalBreakMinutes: number;
  focusBlockCount: number;
  totalTasks: number;
  scheduledTasks: number;
  unscheduledTasks: string[];
  suggestion?: string;
}
