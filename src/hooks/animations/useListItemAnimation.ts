import { useEffect, useMemo } from "react";
import {
  useSharedValue, useAnimatedStyle, withTiming, withSpring,
  cancelAnimation, Easing,
} from "react-native-reanimated";
import { useReducedMotion } from "./useAnimationConfig";
import { ListItemAnimationOptions } from "@/src/types/animations";
import { getRegistry } from "./listAnimationRegistry";

export { clearListAnimationRegistry, useListAnimationRegistry } from "./listAnimationRegistry";

export function useListItemAnimation(options: ListItemAnimationOptions) {
  const {
    listId, itemId, isVisible = true, type = "fadeSlide", duration = 250,
  } = options;

  const reduceMotion = useReducedMotion();
  const registry = useMemo(() => getRegistry(listId), [listId]);
  const hasAnimated = registry.has(itemId);

  const opacity = useSharedValue(hasAnimated || reduceMotion ? 1 : 0);
  const translateY = useSharedValue(hasAnimated || reduceMotion ? 0 : 12);
  const scale = useSharedValue(hasAnimated || reduceMotion ? 1 : 0.97);

  useEffect(() => {
    if (!isVisible || hasAnimated || reduceMotion) {
      opacity.value = 1; translateY.value = 0; scale.value = 1;
      return;
    }
    registry.add(itemId);
    const timingConfig = { duration, easing: Easing.out(Easing.ease) };
    if (type === "fade" || type === "fadeSlide") opacity.value = withTiming(1, timingConfig);
    if (type === "slide" || type === "fadeSlide") translateY.value = withTiming(0, timingConfig);
    if (type === "scale") scale.value = withSpring(1, { damping: 12, stiffness: 100 });
    return () => {
      cancelAnimation(opacity); cancelAnimation(translateY); cancelAnimation(scale);
    };
  }, [isVisible, itemId, hasAnimated, reduceMotion, type, duration, registry, opacity, translateY, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    if (type === "fadeSlide") return { opacity: opacity.value, transform: [{ translateY: translateY.value }] };
    if (type === "slide") return { opacity: 1, transform: [{ translateY: translateY.value }] };
    if (type === "scale") return { opacity: 1, transform: [{ scale: scale.value }] };
    return { opacity: opacity.value };
  });

  return { animatedStyle };
}
