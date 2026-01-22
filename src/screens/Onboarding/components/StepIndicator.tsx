import { View } from "react-native";

export interface StepIndicatorProps {
  /** Total number of steps */
  totalSteps?: number;
  /** Current step (0-indexed) */
  currentStep: number;
  /** Active step color - use Tailwind color class without 'bg-' prefix */
  activeColor?: "electricBlue" | "amber-500" | "successGreen" | "deepPurple";
}

/**
 * StepIndicator - Displays onboarding progress dots
 */
export function StepIndicator({
  totalSteps = 5,
  currentStep,
  activeColor = "electricBlue",
}: StepIndicatorProps) {
  const activeColorClass = `bg-${activeColor}`;

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
