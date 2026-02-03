import { memo } from "react";
import { View, Pressable } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import { SessionSetupHeaderProps } from "@/src/types/Focus";

const ACTIVE_COLOR = "#3b82f6";
const INACTIVE_COLOR = "#27272a";

export const SessionSetupHeader = memo(function SessionSetupHeader({
  step,
  totalSteps,
  onBack,
  onPrevStep,
}: SessionSetupHeaderProps) {
  return (
    <View className="px-6 py-4 flex-row items-center justify-between">
      <Pressable
        onPress={() => (step === 1 ? onBack() : onPrevStep())}
        className="bg-white/5 border border-white/10 h-10 w-10 rounded-full items-center justify-center"
      >
        <AppText className="text-lg text-white">
          {step === 1 ? "✕" : "‹"}
        </AppText>
      </Pressable>

      <View className="flex-row gap-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <View
            key={i}
            className="h-1.5 w-6 rounded-full"
            style={{
              backgroundColor: step >= i + 1 ? ACTIVE_COLOR : INACTIVE_COLOR,
            }}
          />
        ))}
      </View>

      <View className="w-10" />
    </View>
  );
});
