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

export type ButtonVariant = "blue" | "amber" | "green" | "purple" | "white";

export const VARIANT_COLORS: Record<ButtonVariant, { bg: string; text: string }> = {
  blue: { bg: "#0A84FF", text: "text-textPrimary" },
  amber: { bg: "#F59E0B", text: "text-background" },
  green: { bg: "#30D158", text: "text-background" },
  purple: { bg: "#5E5CE6", text: "text-textPrimary" },
  white: { bg: "#ffffff", text: "text-background" },
};

export interface OnboardingButtonProps extends PressableProps {
  label: string;
  variant?: ButtonVariant;
  showArrow?: boolean;
  leftIcon?: import("react").ReactNode;
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

export interface RoleSelectorProps {
  selectedRole: string;
  onSelect: (role: string) => void;
}
