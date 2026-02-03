import { useCallback } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  cancelAnimation,
} from "react-native-reanimated";
import { useReducedMotion, ANIMATION_PRESETS } from "./useAnimationConfig";
import { ScalePressOptions } from "@/src/types/animations";

/**
 * Hook for press scale animations.
 * Returns handlers for onPressIn/onPressOut and animated style.
 */
export function useScalePress(options: ScalePressOptions = {}) {
  const { minScale = 0.9, springPreset = "snappy" } = options;

  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const onPressIn = useCallback(() => {
    if (reduceMotion) {
      scale.value = minScale;
      return;
    }
    scale.value = withSpring(minScale, ANIMATION_PRESETS.spring[springPreset]);
  }, [reduceMotion, minScale, springPreset, scale]);

  const onPressOut = useCallback(() => {
    if (reduceMotion) {
      scale.value = 1;
      return;
    }
    scale.value = withSpring(1, ANIMATION_PRESETS.spring[springPreset]);
  }, [reduceMotion, springPreset, scale]);

  const reset = useCallback(() => {
    cancelAnimation(scale);
    scale.value = 1;
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return {
    animatedStyle,
    onPressIn,
    onPressOut,
    reset,
  };
}
