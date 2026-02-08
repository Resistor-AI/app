import { ReactNode } from "react";
import { GeneratedSchedule, ScheduleBlock, StepNumber, StepDirection } from "./index";

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

export interface BrainDumpStepProps {
  brainDump: string;
  onBrainDumpChange: (text: string) => void;
  durationText: string;
  startTimeDisplay: string;
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

export interface StepAnimatorProps {
  stepKey: string;
  stepDirection: StepDirection;
  variant: "scroll" | "view";
  children: ReactNode;
  paddingBottom?: number;
}
