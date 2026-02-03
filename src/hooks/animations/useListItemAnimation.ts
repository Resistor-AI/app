import { useEffect, useCallback, useMemo, useRef } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  cancelAnimation,
  Easing,
} from "react-native-reanimated";
import { useReducedMotion } from "./useAnimationConfig";
import { ListItemAnimationOptions } from "@/src/types/animations";

// Global registry to track animated items across recycling
const animatedItemsRegistry = new Map<string, Set<string | number>>();

function getRegistry(listId: string): Set<string | number> {
  if (!animatedItemsRegistry.has(listId)) {
    animatedItemsRegistry.set(listId, new Set());
  }
  return animatedItemsRegistry.get(listId)!;
}

/**
 * Clear animation registry for a specific list.
 * Call when list data is fully reset or list unmounts.
 */
export function clearListAnimationRegistry(listId: string): void {
  animatedItemsRegistry.delete(listId);
}

/**
 * Hook for FlashList-safe item animations.
 * Tracks animated items by ID to prevent re-animation on view recycling.
 */
export function useListItemAnimation(options: ListItemAnimationOptions) {
  const {
    listId,
    itemId,
    isVisible = true,
    type = "fadeSlide",
    duration = 250,
  } = options;

  const reduceMotion = useReducedMotion();
  const registry = useMemo(() => getRegistry(listId), [listId]);
  const hasAnimated = registry.has(itemId);

  const opacity = useSharedValue(hasAnimated || reduceMotion ? 1 : 0);
  const translateY = useSharedValue(hasAnimated || reduceMotion ? 0 : 12);
  const scale = useSharedValue(hasAnimated || reduceMotion ? 1 : 0.97);

  useEffect(() => {
    if (!isVisible || hasAnimated || reduceMotion) {
      // Ensure values are at final state
      opacity.value = 1;
      translateY.value = 0;
      scale.value = 1;
      return;
    }

    // Mark as animated before starting
    registry.add(itemId);

    // Run animations
    const timingConfig = { duration, easing: Easing.out(Easing.ease) };

    if (type === "fade" || type === "fadeSlide") {
      opacity.value = withTiming(1, timingConfig);
    }
    if (type === "slide" || type === "fadeSlide") {
      translateY.value = withTiming(0, timingConfig);
    }
    if (type === "scale") {
      scale.value = withSpring(1, { damping: 12, stiffness: 100 });
    }

    return () => {
      cancelAnimation(opacity);
      cancelAnimation(translateY);
      cancelAnimation(scale);
    };
  }, [
    isVisible,
    itemId,
    hasAnimated,
    reduceMotion,
    type,
    duration,
    registry,
    opacity,
    translateY,
    scale,
  ]);

  const animatedStyle = useAnimatedStyle(() => {
    if (type === "fadeSlide") {
      return {
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
      };
    } else if (type === "slide") {
      return {
        opacity: 1,
        transform: [{ translateY: translateY.value }],
      };
    } else if (type === "scale") {
      return {
        opacity: 1,
        transform: [{ scale: scale.value }],
      };
    }
    // type === "fade"
    return {
      opacity: opacity.value,
    };
  });

  return { animatedStyle };
}

/**
 * Hook for list container to manage registry lifecycle.
 * Automatically clears registry when list unmounts.
 */
export function useListAnimationRegistry(listId: string) {
  const listIdRef = useRef(listId);

  useEffect(() => {
    listIdRef.current = listId;
    return () => {
      clearListAnimationRegistry(listIdRef.current);
    };
  }, [listId]);

  const clear = useCallback(() => {
    clearListAnimationRegistry(listId);
  }, [listId]);

  return { clear };
}
