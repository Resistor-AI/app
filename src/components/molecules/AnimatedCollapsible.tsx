import { memo, useState, useCallback } from "react";
import { Pressable, View, LayoutChangeEvent } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { ChevronRight } from "lucide-react-native";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as Haptics from "expo-haptics";
import { AppText } from "@/src/components/atoms/text";
import { useReducedMotion } from "@/src/hooks/animations";
import { AnimatedCollapsibleProps } from "@/src/types/Focus";

const ANIMATION_DURATION = 300;

export const AnimatedCollapsible = memo(function AnimatedCollapsible({
  title,
  children,
  defaultOpen = false,
  onToggle,
  className,
  headerClassName,
}: AnimatedCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [contentHeight, setContentHeight] = useState(0);
  const reduceMotion = useReducedMotion();

  const animationProgress = useSharedValue(defaultOpen ? 1 : 0);

  const handleToggle = useCallback(() => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
    Haptics.selectionAsync();

    if (reduceMotion) {
      animationProgress.value = newState ? 1 : 0;
    } else {
      animationProgress.value = withTiming(newState ? 1 : 0, {
        duration: ANIMATION_DURATION,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [isOpen, onToggle, reduceMotion, animationProgress]);

  const handleContentLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0) {
      setContentHeight(height);
    }
  }, []);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(animationProgress.value, [0, 1], [0, 90])}deg` },
    ],
  }));

  const contentContainerStyle = useAnimatedStyle(() => ({
    height: contentHeight > 0
      ? interpolate(animationProgress.value, [0, 1], [0, contentHeight])
      : undefined,
    opacity: animationProgress.value,
    overflow: "hidden" as const,
  }));

  const containerClassName = twMerge(
    clsx("rounded-2xl overflow-hidden", className)
  );

  const headerContainerClassName = twMerge(
    clsx(
      "flex-row items-center justify-between",
      "bg-zinc-900/60 border border-white/10",
      "px-4 py-3 rounded-2xl",
      headerClassName
    )
  );

  return (
    <View className={containerClassName}>
      <Pressable onPress={handleToggle} className={headerContainerClassName}>
        <AppText className="text-zinc-300 font-medium">{title}</AppText>
        <Animated.View style={chevronStyle}>
          <ChevronRight size={20} color="#71717a" />
        </Animated.View>
      </Pressable>

      <Animated.View style={contentContainerStyle}>
        <View onLayout={handleContentLayout} className="pt-3">
          {children}
        </View>
      </Animated.View>
    </View>
  );
});
