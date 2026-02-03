import { View } from "react-native";
import { memo } from "react";
import Animated from "react-native-reanimated";
import { Coffee } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import {
  useStaggeredEntry,
  useFloatingAnimation,
} from "@/src/hooks/animations";

export const EmptyState = memo(function EmptyState() {
  // Floating animation for icon
  const { animatedStyle: floatingStyle } = useFloatingAnimation({
    distance: 8,
    duration: 3000,
    isActive: true,
  });

  // Container entry animation
  const { animatedStyle: containerStyle } = useStaggeredEntry({
    index: 0,
    duration: 600,
    translateY: 20,
  });

  // Staggered text animations
  const { animatedStyle: titleStyle } = useStaggeredEntry({
    index: 1,
    staggerDelay: 100,
    duration: 400,
    translateY: 10,
  });

  const { animatedStyle: subtitleStyle } = useStaggeredEntry({
    index: 2,
    staggerDelay: 100,
    duration: 400,
    translateY: 10,
  });

  return (
    <Animated.View style={containerStyle} className="mb-10 w-full px-6">
      <View className="flex-row items-center justify-between mb-4 pl-1">
        <AppText content="Priority Queue" variant="overline" />
      </View>
      <View className="w-full h-52 items-center justify-center">
        <Animated.View
          style={floatingStyle}
          className="size-16 bg-zinc-900 rounded-full items-center justify-center mb-4 border border-zinc-800"
        >
          <Coffee size={24} color="#71717a" />
        </Animated.View>
        <Animated.View style={titleStyle}>
          <AppText variant="body" color="primary" content="All Caught Up" />
        </Animated.View>
        <Animated.View style={subtitleStyle}>
          <AppText
            variant="body-sm"
            color="secondary"
            className="text-center mt-1"
            content={`No active sessions queued.\nEnjoy your free time!`}
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
});
