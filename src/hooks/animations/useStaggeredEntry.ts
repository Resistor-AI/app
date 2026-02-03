import { useEffect, useRef, useCallback } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  cancelAnimation,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { useReducedMotion, ANIMATION_PRESETS } from "./useAnimationConfig";
import { StaggeredEntryOptions } from "@/src/types/animations";

// Return type uses ReturnType to match useAnimatedStyle's actual return

/**
 * Hook for staggered entry animations with fade, slide, and scale.
 * Ideal for list items, cards, and content blocks.
 */
export function useStaggeredEntry(options: StaggeredEntryOptions = {}) {
  const {
    index = 0,
    staggerDelay = 100,
    maxDelay = 500,
    duration = 400,
    useSpring = false,
    springPreset = "gentle",
    translateY: initialTranslateY = 20,
    initialScale = 0.95,
    trigger = true,
    onComplete,
  } = options;

  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const translateY = useSharedValue(reduceMotion ? 0 : initialTranslateY);
  const scale = useSharedValue(reduceMotion ? 1 : initialScale);
  const hasAnimated = useRef(false);

  // Calculate staggered delay with cap
  const delay = Math.min(index * staggerDelay, maxDelay);

  const triggerEntry = useCallback(() => {
    if (hasAnimated.current || reduceMotion) {
      opacity.value = 1;
      translateY.value = 0;
      scale.value = 1;
      return;
    }

    hasAnimated.current = true;

    const springConfig = ANIMATION_PRESETS.spring[springPreset];
    const timingConfig = { duration, easing: Easing.out(Easing.ease) };

    // Opacity always uses timing
    opacity.value = withDelay(delay, withTiming(1, { duration }));

    // TranslateY and scale use spring or timing based on option
    if (useSpring) {
      translateY.value = withDelay(delay, withSpring(0, springConfig));
      scale.value = withDelay(
        delay,
        withSpring(1, springConfig, (finished) => {
          if (finished && onComplete) {
            runOnJS(onComplete)();
          }
        })
      );
    } else {
      translateY.value = withDelay(delay, withTiming(0, timingConfig));
      scale.value = withDelay(
        delay,
        withTiming(1, timingConfig, (finished) => {
          if (finished && onComplete) {
            runOnJS(onComplete)();
          }
        })
      );
    }
  }, [
    reduceMotion,
    delay,
    duration,
    useSpring,
    springPreset,
    onComplete,
    opacity,
    translateY,
    scale,
  ]);

  const reset = useCallback(() => {
    hasAnimated.current = false;
    cancelAnimation(opacity);
    cancelAnimation(translateY);
    cancelAnimation(scale);
    opacity.value = reduceMotion ? 1 : 0;
    translateY.value = reduceMotion ? 0 : initialTranslateY;
    scale.value = reduceMotion ? 1 : initialScale;
  }, [reduceMotion, initialTranslateY, initialScale, opacity, translateY, scale]);

  // Auto-trigger based on trigger prop
  useEffect(() => {
    if (trigger) {
      triggerEntry();
    }
  }, [trigger, triggerEntry]);

  // Cleanup
  useEffect(() => {
    return () => {
      cancelAnimation(opacity);
      cancelAnimation(translateY);
      cancelAnimation(scale);
    };
  }, [opacity, translateY, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return {
    animatedStyle,
    triggerEntry,
    reset,
  };
}
