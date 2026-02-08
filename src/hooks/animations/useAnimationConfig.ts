import { useEffect, useState, useCallback } from "react";
import { AccessibilityInfo } from "react-native";
import { useSharedValue, withTiming, SharedValue } from "react-native-reanimated";
import { ANIMATION_PRESETS } from "@/src/lib/constants/animationPresets";

export { ANIMATION_PRESETS } from "@/src/lib/constants/animationPresets";

export function useReducedMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let isMounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => { if (isMounted) setReduceMotion(enabled); })
      .catch(() => {});
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (enabled) => { if (isMounted) setReduceMotion(enabled); },
    );
    return () => { isMounted = false; subscription?.remove(); };
  }, []);

  return reduceMotion;
}

export function useAnimationEnabled(): boolean {
  return !useReducedMotion();
}

export function useAnimationValue(initialValue: number): {
  value: SharedValue<number>;
  animate: (toValue: number, config?: { timing?: keyof typeof ANIMATION_PRESETS.timing }) => void;
  reduceMotion: boolean;
} {
  const reduceMotion = useReducedMotion();
  const value = useSharedValue(initialValue);
  const animate = useCallback(
    (toValue: number, config?: { timing?: keyof typeof ANIMATION_PRESETS.timing }) => {
      if (reduceMotion) { value.value = toValue; }
      else { value.value = withTiming(toValue, ANIMATION_PRESETS.timing[config?.timing ?? "normal"]); }
    },
    [reduceMotion, value],
  );
  return { value, animate, reduceMotion };
}
