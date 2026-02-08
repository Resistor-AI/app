import { memo } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { useProgressAnimation } from "@/src/hooks/animations/useProgressAnimation";
import { AnimatedProgressBarProps } from "@/src/types/animations";

export const AnimatedProgressBar = memo(function AnimatedProgressBar({
  progress,
  height = 4,
  trackColor = "#27272a",
  fillColor = "#eab308",
  borderRadius = 2,
  duration = 500,
  style,
}: AnimatedProgressBarProps) {
  const { progressStyle } = useProgressAnimation({
    progress,
    duration,
  });

  return (
    <View
      style={[
        {
          height,
          backgroundColor: trackColor,
          borderRadius,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          {
            height: "100%",
            backgroundColor: fillColor,
            borderRadius,
          },
          progressStyle,
        ]}
      />
    </View>
  );
});
