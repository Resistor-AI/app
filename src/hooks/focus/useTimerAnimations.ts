import { useEffect } from "react";
import {
  useAnimatedStyle,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { CIRCUMFERENCE, RING_SIZE, RADIUS } from "@/src/lib/constants/timerRing";

export function useTimerAnimations(progress: number, isIdle: boolean) {
  const colonOpacity = useSharedValue(1);
  const ringProgress = useSharedValue(0);
  const breatheScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);
  const contentOpacity = useSharedValue(1);

  useEffect(() => {
    if (!isIdle) {
      colonOpacity.value = withRepeat(
        withSequence(
          withTiming(0.2, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) })
        ),
        -1, false
      );
    } else {
      colonOpacity.value = withTiming(0.3, { duration: 300 });
    }
  }, [isIdle]);

  useEffect(() => {
    ringProgress.value = withTiming(progress, { duration: 1000, easing: Easing.linear });
  }, [progress]);

  useEffect(() => {
    if (!isIdle) {
      breatheScale.value = withRepeat(
        withSequence(
          withTiming(1.015, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) })
        ),
        -1, true
      );
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 2500, easing: Easing.inOut(Easing.ease) })
        ),
        -1, true
      );
    } else {
      breatheScale.value = withTiming(1, { duration: 300 });
      glowOpacity.value = withTiming(0.15, { duration: 300 });
    }
  }, [isIdle]);

  useEffect(() => {
    contentOpacity.value = withTiming(isIdle ? 0.5 : 1, { duration: 300 });
  }, [isIdle]);

  const colonStyle = useAnimatedStyle(() => ({ opacity: colonOpacity.value }));
  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value }));
  const ringContainerStyle = useAnimatedStyle(() => ({ transform: [{ scale: breatheScale.value }] }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));

  const progressStrokeStyle = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(ringProgress.value, [0, 1], [CIRCUMFERENCE, 0]),
  }));

  const indicatorStyle = useAnimatedStyle(() => {
    const angle = -Math.PI / 2 + ringProgress.value * 2 * Math.PI;
    const x = RING_SIZE / 2 + RADIUS * Math.cos(angle);
    const y = RING_SIZE / 2 + RADIUS * Math.sin(angle);
    return {
      transform: [{ translateX: x - 8 }, { translateY: y - 8 }],
      opacity: ringProgress.value > 0.01 ? 1 : 0,
    };
  });

  return {
    colonOpacity, ringProgress, breatheScale, glowOpacity, contentOpacity,
    colonStyle, contentStyle, ringContainerStyle, glowStyle, progressStrokeStyle, indicatorStyle,
  };
}
