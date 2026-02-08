import { useEffect, useCallback } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { useReducedMotion } from "./useAnimationConfig";
import { FloatingAnimationOptions } from "@/src/types/animations";

/**
 * Hook for floating/breathing animations.
 * Creates a gentle up-down motion, optionally with horizontal sway.
 */
export function useFloatingAnimation(options: FloatingAnimationOptions = {}) {
  const {
    distance = 8,
    duration = 3000,
    isActive = true,
    includeSway = false,
    swayDistance = 4,
  } = options;

  const reduceMotion = useReducedMotion();
  const floatValue = useSharedValue(0);

  const startAnimation = useCallback(() => {
    if (reduceMotion) {
      floatValue.value = 0;
      return;
    }

    floatValue.value = withRepeat(
      withSequence(
        withTiming(-1, {
          duration,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );
  }, [reduceMotion, duration, floatValue]);

  const stopAnimation = useCallback(() => {
    cancelAnimation(floatValue);
    floatValue.value = 0;
  }, [floatValue]);

  useEffect(() => {
    if (isActive && !reduceMotion) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => {
      cancelAnimation(floatValue);
    };
  }, [isActive, reduceMotion, startAnimation, stopAnimation, floatValue]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(floatValue.value, [-1, 0], [-distance, 0]);

    if (includeSway) {
      const translateX = interpolate(
        floatValue.value,
        [-1, -0.5, 0],
        [-swayDistance, swayDistance, -swayDistance]
      );

      return {
        transform: [{ translateY }, { translateX }],
      };
    }

    return {
      transform: [{ translateY }],
    };
  });

  return {
    animatedStyle,
    floatValue,
    start: startAnimation,
    stop: stopAnimation,
  };
}
