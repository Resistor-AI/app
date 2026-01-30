import { PressableProps } from "react-native";

// Explicit class mappings for Tailwind to detect at build time
export const ACCENT_COLORS = {
  textPrimary: "text-textPrimary",
  electricBlue: "text-electricBlue",
  amberLight: "text-amberLight",
  successGreen: "text-successGreen",
  deepPurple: "text-deepPurple",
  neonRed: "text-neonRed",
} as const;

export interface OnboardingHeaderProps {
  /** First line of header (primary color) */
  title: string;
  /** Second line of header (accent color) */
  subtitle?: string;
  /** Color for subtitle - uses Tailwind config colors */
  accentColor?: keyof typeof ACCENT_COLORS;
  /** Animation delay offset in ms */
  animationDelay?: number;

  className?: string;

  subTitleClassName?: string;
}

export type ButtonVariant = "blue" | "amber" | "green" | "purple";

export const VARIANT_COLORS: Record<ButtonVariant, { bg: string; text: string }> = {
  blue: { bg: "#0A84FF", text: "text-textPrimary" }, // electricBlue
  amber: { bg: "#F59E0B", text: "text-background" }, // amber
  green: { bg: "#30D158", text: "text-background" }, // successGreen
  purple: { bg: "#5E5CE6", text: "text-textPrimary" }, // deepPurple
};

export interface OnboardingButtonProps extends PressableProps {
  /** Button text */
  label: string;
  /** Color variant */
  variant?: ButtonVariant;
  /** Show arrow indicator */
  showArrow?: boolean;
}

export interface OnboardingStepperProps {
  totalSteps: number;
  currentStep: number;
}

export interface OnboardingSubtextProps {
  /** Main description text */
  children?: string;
  /** Optional emphasized follow-up line */
  emphasis?: string;
  /** Animation delay offset in ms */
  animationDelay?: number;

  className?: string;
}
