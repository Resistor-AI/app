import { memo } from "react";
import { View, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { useProgressAnimation } from "@/src/hooks/animations";

interface AnimatedProgressBarProps {
  /** Progress value 0-100 */
  progress: number;
  /** Height of the bar (default: 4) */
  height?: number;
  /** Background color of track (default: #27272a) */
  trackColor?: string;
  /** Color of progress fill (default: #eab308) */
  fillColor?: string;
  /** Border radius (default: 2) */
  borderRadius?: number;
  /** Animation duration (default: 500) */
  duration?: number;
  /** Container style */
  style?: ViewStyle;
}

/**
 * Animated progress bar component with smooth width transitions.
 * Respects reduced motion settings.
 */
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
