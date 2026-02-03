import { ReactNode } from "react";

// Step configuration
export const TOTAL_STEPS = 4;

export type StepNumber = 1 | 2 | 3 | 4;
export type StepDirection = "forward" | "back";

// Existing component props
export interface AnimatedCollapsibleProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  className?: string;
  headerClassName?: string;
}

export interface TimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label: string;
  minTime?: Date;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export interface DurationDisplayProps {
  durationText: string;
  startTimeDisplay: string;
  endTimeDisplay: string;
}

export interface TimeValidationErrorProps {
  message: string;
}

// Step 1: Time Selection
export interface TimeSelectionStepProps {
  startTime: Date;
  endTime: Date;
  onStartTimeChange: (date: Date) => void;
  onEndTimeChange: (date: Date) => void;
  isStartTimeValid: boolean;
  isValidTimeRange: boolean;
  isFormValid: boolean;
  durationText: string;
  formatTimeDisplay: (date: Date) => string;
}

// Step 2: App Selection - uses AppInfo from native module
// Props defined in component file

// Step 3: Brain Dump
export interface BrainDumpStepProps {
  brainDump: string;
  onBrainDumpChange: (text: string) => void;
  durationText: string;
  startTimeDisplay: string;
}

// Step 4: AI Session Planning
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

export interface AISessionPlanningStepProps {
  schedule: GeneratedSchedule | null;
  isLoading: boolean;
  error: string | null;
  onReorder: (schedule: ScheduleBlock[]) => void;
  onRegenerateSchedule: () => void;
  durationText: string;
  startTimeDisplay: string;
  hasBrainDump: boolean;
}

// Header and Footer
export interface SessionSetupHeaderProps {
  step: StepNumber;
  totalSteps: number;
  onBack: () => void;
  onPrevStep: () => void;
}

export interface SessionSetupFooterProps {
  step: StepNumber;
  isFormValid: boolean;
  hasBrainDump: boolean;
  isLoading?: boolean;
  onContinue: () => void;
  onSkip: () => void;
  onStartSession: () => void;
  bottomInset: number;
}

// Session Setup State
export interface SessionSetupState {
  step: StepNumber;
  startTime: Date;
  endTime: Date;
  selectedPackages: Set<string>;
  brainDump: string;
  generatedSchedule: GeneratedSchedule | null;
  isGeneratingSchedule: boolean;
  scheduleError: string | null;
}
