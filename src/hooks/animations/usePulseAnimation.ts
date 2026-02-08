import { useEffect, useCallback } from "react";
import {
  useSharedValue, useAnimatedStyle, withRepeat, withSequence,
  withTiming, cancelAnimation, Easing,
} from "react-native-reanimated";
import { useReducedMotion } from "./useAnimationConfig";
import { PulseAnimationOptions } from "@/src/types/animations";

export function usePulseAnimation(options: PulseAnimationOptions = {}) {
  const {
    minOpacity = 0.4, maxOpacity = 1, duration = 1500,
    isActive = true, useScale = false, minScale = 0.95, maxScale = 1.05,
  } = options;

  const reduceMotion = useReducedMotion();
  const pulseValue = useSharedValue(useScale ? 1 : maxOpacity);

  const startAnimation = useCallback(() => {
    if (reduceMotion) { pulseValue.value = useScale ? 1 : maxOpacity; return; }
    const minVal = useScale ? minScale : minOpacity;
    const maxVal = useScale ? maxScale : maxOpacity;
    pulseValue.value = withRepeat(
      withSequence(
        withTiming(minVal, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(maxVal, { duration, easing: Easing.inOut(Easing.ease) }),
      ), -1, true,
    );
  }, [reduceMotion, duration, minOpacity, maxOpacity, minScale, maxScale, useScale, pulseValue]);

  const stopAnimation = useCallback(() => {
    cancelAnimation(pulseValue);
    pulseValue.value = useScale ? 1 : maxOpacity;
  }, [useScale, maxOpacity, pulseValue]);

  useEffect(() => {
    if (isActive && !reduceMotion) startAnimation();
    else stopAnimation();
    return () => { cancelAnimation(pulseValue); };
  }, [isActive, reduceMotion, startAnimation, stopAnimation, pulseValue]);

  const animatedStyle = useAnimatedStyle(() => {
    if (useScale) return { transform: [{ scale: pulseValue.value }] };
    return { opacity: pulseValue.value };
  });

  return { animatedStyle, pulseValue, start: startAnimation, stop: stopAnimation };
}
