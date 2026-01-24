import React from "react";
import { View } from "react-native";

interface OnboardingStepperProps {
  totalSteps: number;
  currentStep: number;
}

export function OnboardingStepper({
  totalSteps,
  currentStep,
}: OnboardingStepperProps) {
  return (
    <View className="flex-row gap-2 pt-2 mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          className={`h-1 flex-1 rounded-full ${
            index <= currentStep ? "bg-white" : "bg-white/20"
          }`}
        />
      ))}
    </View>
  );
}
