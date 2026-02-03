import { useEffect, useState, useCallback } from "react";
import { AccessibilityInfo } from "react-native";
import {
  useSharedValue,
  withTiming,
  Easing,
  SharedValue,
} from "react-native-reanimated";

// Standardized animation presets for consistency across the app
export const ANIMATION_PRESETS = {
  timing: {
    fast: { duration: 150, easing: Easing.out(Easing.ease) },
    normal: { duration: 300, easing: Easing.inOut(Easing.ease) },
    slow: { duration: 600, easing: Easing.inOut(Easing.ease) },
  },
  spring: {
    bouncy: { damping: 8, stiffness: 100, mass: 0.5 },
    gentle: { damping: 15, stiffness: 100, mass: 1 },
    snappy: { damping: 12, stiffness: 150, mass: 0.8 },
  },
  stagger: {
    fast: 50,
    normal: 100,
    slow: 150,
  },
} as const;

/**
 * Hook to detect if reduced motion is enabled on the device.
 * Respects user accessibility preferences.
 */
export function useReducedMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let isMounted = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (isMounted) {
          setReduceMotion(enabled);
        }
      })
      .catch(() => {
        // Ignore errors - just default to false
      });

    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (enabled) => {
        if (isMounted) {
          setReduceMotion(enabled);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, []);

  return reduceMotion;
}

/**
 * Hook to check if animations should run.
 * Returns false if reduced motion is enabled.
 */
export function useAnimationEnabled(): boolean {
  const reduceMotion = useReducedMotion();
  return !reduceMotion;
}

/**
 * Animation wrapper that respects reduced motion settings.
 * Returns a shared value and an animate function that handles accessibility.
 */
export function useAnimationValue(initialValue: number): {
  value: SharedValue<number>;
  animate: (
    toValue: number,
    config?: { timing?: keyof typeof ANIMATION_PRESETS.timing }
  ) => void;
  reduceMotion: boolean;
} {
  const reduceMotion = useReducedMotion();
  const value = useSharedValue(initialValue);

  const animate = useCallback(
    (
      toValue: number,
      config?: { timing?: keyof typeof ANIMATION_PRESETS.timing }
    ) => {
      if (reduceMotion) {
        value.value = toValue;
      } else {
        const preset = ANIMATION_PRESETS.timing[config?.timing ?? "normal"];
        value.value = withTiming(toValue, preset);
      }
    },
    [reduceMotion, value]
  );

  return { value, animate, reduceMotion };
}
