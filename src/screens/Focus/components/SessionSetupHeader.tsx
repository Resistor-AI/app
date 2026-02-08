import { memo } from "react";
import { View, Pressable } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import { SessionSetupHeaderProps } from "@/src/types/Focus/SessionSetup";

export const SessionSetupHeader = memo(function SessionSetupHeader({
  step,
  totalSteps,
  onBack,
  onPrevStep,
}: SessionSetupHeaderProps) {
  return (
    <View className="px-6 py-4 flex-row items-center gap-4">
      <Pressable
        onPress={() => (step === 1 ? onBack() : onPrevStep())}
        className="bg-white/5 border border-white/10 h-10 w-10 rounded-full items-center justify-center"
      >
        <AppText className="text-lg text-white">
          {step === 1 ? "✕" : "‹"}
        </AppText>
      </Pressable>
      <View className="flex-1 flex-row gap-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <View
            key={i}
            className="h-1 rounded-full flex-1"
            style={{ backgroundColor: step >= i + 1 ? "#ffffff" : "#27272a" }}
          />
        ))}
      </View>
    </View>
  );
});
