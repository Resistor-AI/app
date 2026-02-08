import { useCallback, useRef, useState } from "react";
import * as Haptics from "expo-haptics";
import {
  useSharedValue,
  withTiming,
  withSpring,
  cancelAnimation,
  runOnJS,
} from "react-native-reanimated";

const HOLD_DURATION_MS = 45_000;
const TICK_INTERVAL_MS = 100;

export function useHoldButton(onComplete: () => void) {
  const progress = useSharedValue(0);
  const [isHolding, setIsHolding] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(45);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);
  const completedRef = useRef(false);

  const clearTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const onPressIn = useCallback(() => {
    completedRef.current = false;
    setIsHolding(true);
    startRef.current = Date.now();

    progress.value = withTiming(1, { duration: HOLD_DURATION_MS });

    tickRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const remaining = Math.max(0, Math.ceil((HOLD_DURATION_MS - elapsed) / 1000));
      setSecondsLeft(remaining);

      if (elapsed >= HOLD_DURATION_MS && !completedRef.current) {
        completedRef.current = true;
        clearTick();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onComplete();
      }
    }, TICK_INTERVAL_MS);
  }, [onComplete, clearTick, progress]);

  const onPressOut = useCallback(() => {
    if (completedRef.current) return;
    setIsHolding(false);
    clearTick();
    cancelAnimation(progress);
    progress.value = withSpring(0, { damping: 15, stiffness: 120 });
    setSecondsLeft(45);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [clearTick, progress]);

  return { isHolding, progress, secondsLeft, onPressIn, onPressOut };
}
