import { useEffect } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  cancelAnimation,
  Easing,
  interpolateColor,
} from "react-native-reanimated";
import { useReducedMotion } from "./useAnimationConfig";
import { ProgressAnimationOptions } from "@/src/types/animations";

/**
 * Hook for animating progress bars.
 * Smoothly animates width changes and optionally color.
 */
export function useProgressAnimation(options: ProgressAnimationOptions) {
  const {
    progress,
    duration = 500,
    startColor = "#3b82f6",
    endColor = "#22c55e",
    animateColor = false,
  } = options;

  const reduceMotion = useReducedMotion();
  const animatedProgress = useSharedValue(reduceMotion ? progress : 0);

  useEffect(() => {
    if (reduceMotion) {
      animatedProgress.value = progress;
    } else {
      animatedProgress.value = withTiming(progress, {
        duration,
        easing: Easing.out(Easing.ease),
      });
    }

    return () => {
      cancelAnimation(animatedProgress);
    };
  }, [progress, reduceMotion, duration, animatedProgress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value}%`,
  }));

  const colorStyle = useAnimatedStyle(() => {
    if (!animateColor) {
      return { backgroundColor: startColor };
    }

    const color = interpolateColor(
      animatedProgress.value,
      [0, 100],
      [startColor, endColor]
    );

    return { backgroundColor: color };
  });

  return {
    progressStyle,
    colorStyle,
    animatedProgress,
  };
}
