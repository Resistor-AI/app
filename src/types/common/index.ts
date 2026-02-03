import { ReactNode } from "react";

export type StepBadgeVariant = "blue" | "amber" | "green" | "red" | "purple";

export interface StepBadgeProps {
  icon: ReactNode;
  label: string;
  variant?: StepBadgeVariant;
  className?: string;
}
