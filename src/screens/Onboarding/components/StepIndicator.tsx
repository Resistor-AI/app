import { View } from "react-native";

// Explicit class mappings for Tailwind to detect at build time
const ACTIVE_COLORS = {
  electricBlue: "bg-electricBlue",
  amber: "bg-amber",
  successGreen: "bg-successGreen",
  deepPurple: "bg-deepPurple",
} as const;

export interface StepIndicatorProps {
  /** Total number of steps */
  totalSteps?: number;
  /** Current step (0-indexed) */
  currentStep: number;
  /** Active step color */
  activeColor?: keyof typeof ACTIVE_COLORS;
}

/**
 * StepIndicator - Displays onboarding progress dots
 */
export function StepIndicator({
  totalSteps = 6,
  currentStep,
  activeColor = "electricBlue",
}: StepIndicatorProps) {
  const activeColorClass = ACTIVE_COLORS[activeColor];

  return (
    <View className="flex-row justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <View
          key={i}
          className={`h-2 rounded-full ${
            i === currentStep
              ? `w-6 ${activeColorClass}`
              : "w-2 bg-surfaceHighlight"
          }`}
        />
      ))}
    </View>
  );
}
