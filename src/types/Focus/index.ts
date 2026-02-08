export const TOTAL_STEPS = 4;

export type StepNumber = 1 | 2 | 3 | 4;
export type StepDirection = "forward" | "back";

export type TaskPriority = "urgent" | "high" | "normal" | "low";
export type ScheduleBlockType = "task" | "short_break" | "regenerative_break";

export interface ParsedTask {
  id: string;
  title: string;
  estimatedMinutes: number;
  priority: TaskPriority;
  originalText: string;
  notes: string | null;
}

export interface ScheduleBlock {
  id: string;
  type: ScheduleBlockType;
  title: string;
  taskId?: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  priority?: TaskPriority;
  isCompleted?: boolean;
}

export interface ScheduleSummary {
  totalTasks: number;
  scheduledTasks?: number;
  totalFocusMinutes: number;
  totalBreakMinutes: number;
  urgentTasks: number;
  unscheduledTasks?: string[];
  suggestion: string;
}

export interface GeneratedSchedule {
  tasks: ParsedTask[];
  schedule: ScheduleBlock[];
  summary: ScheduleSummary;
}

export interface CurrentBlockInfo {
  block: ScheduleBlock;
  blockIndex: number;
  totalFocusBlocks: number;
  isBreak: boolean;
  priority: TaskPriority;
  breakCount: number;
}

export interface UpcomingBlockInfo {
  block: ScheduleBlock;
  isBreak: boolean;
  priority: TaskPriority;
  startsIn: number;
  breakCount?: number;
}

export interface MilestoneData {
  threshold: number;
  emoji: string;
  title: string;
  message: string;
}
