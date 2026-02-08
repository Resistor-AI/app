import { View } from "react-native";
import { memo } from "react";
import Animated from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { ActiveCardHeaderProps } from "@/src/types/Dashboard/ActiveCard";

export const ActiveCardHeader = memo(function ActiveCardHeader({
  config,
  priority,
  isBreak,
  isWaitingToStart,
  pulseStyle,
}: ActiveCardHeaderProps) {
  const PriorityIcon = config.Icon;

  return (
    <View className="flex-row items-center justify-between mb-3">
      <View
        style={{ backgroundColor: config.bg, borderColor: config.border }}
        className="flex-row items-center gap-1.5 px-2.5 py-1.5 rounded-full border"
      >
        <PriorityIcon
          size={11}
          color={config.accent}
          fill={priority === "urgent" || priority === "high" || isBreak ? config.accent : "transparent"}
        />
        <AppText
          style={{ color: config.accent }}
          className="text-[10px] font-bold uppercase tracking-wide"
        >
          {config.label}
        </AppText>
      </View>

      <Animated.View
        style={[pulseStyle, { backgroundColor: isWaitingToStart ? "#f59e0b" : "#22c55e" }]}
        className="h-2.5 w-2.5 rounded-full"
      />
    </View>
  );
});
