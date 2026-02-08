import { ReactNode } from "react";
import { ViewStyle } from "react-native";

export interface OnboardingLayoutProps {
  children: ReactNode;
  gradientColors: [string, string, ...string[]];
  currentStep: number;
  totalSteps?: number;
  nextRoute?: string;
  ctaText?: string;
  onCtaPress?: () => void;
  showSkip?: boolean;
  statusBarStyle?: "light" | "dark";
}

export interface OnboardingBackgroundProps {
  gradientColors: [string, string, ...string[]];
  floatingStyle: ViewStyle;
  showSkip: boolean;
  statusBarStyle: "light" | "dark";
  onSkip: () => void;
}

export interface OnboardingFooterProps {
  currentStep: number;
  totalSteps: number;
  ctaText: string;
  onCta: () => void;
}
