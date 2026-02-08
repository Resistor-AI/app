import { View } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import { FRICTION_TOTAL_STEPS } from "@/src/types/Block/index";
import { FrictionHeaderProps } from "@/src/types/Block/components";

function StepDots({ currentStep }: { currentStep: number }) {
  return (
    <View className="flex-row gap-2 mb-2">
      {Array.from({ length: FRICTION_TOTAL_STEPS }, (_, i) => (
        <View
          key={i}
          className="h-1.5 rounded-full"
          style={{
            width: 24,
            backgroundColor:
              i < currentStep ? "#FFFFFF" : "rgba(255,255,255,0.15)",
          }}
        />
      ))}
    </View>
  );
}

export function FrictionHeader({ currentStep }: FrictionHeaderProps) {
  return (
    <View className="items-center pt-2 pb-4">
      <StepDots currentStep={currentStep} />

      <AppText variant="body-sm" className="text-white">
        Step {currentStep} of {FRICTION_TOTAL_STEPS}
      </AppText>
    </View>
  );
}
