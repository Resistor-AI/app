import { ReactNode } from "react";

export type StepBadgeVariant = "blue" | "amber" | "green" | "red" | "purple" | "white";

export interface StepBadgeProps {
  icon: ReactNode;
  label: string;
  variant?: StepBadgeVariant;
  className?: string;
}

export type PermissionStatus = "pending" | "granted" | "denied";

export type ColorName = keyof typeof import("@/src/constants/colors").COLORS;

export type Pillar = (typeof import("@/src/constants/data").PILLARS)[number];
export type Permission = (typeof import("@/src/constants/data").PERMISSIONS)[number];
export type UserRole = (typeof import("@/src/constants/data").USER_ROLES)[number];
