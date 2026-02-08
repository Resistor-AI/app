import { memo } from "react";
import Animated from "react-native-reanimated";
import { Shield } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import { useStaggeredEntry } from "@/src/hooks/animations/useStaggeredEntry";
import { useFloatingAnimation } from "@/src/hooks/animations/useFloatingAnimation";

export const EmptyState = memo(function EmptyState() {
  const { animatedStyle: containerStyle } = useStaggeredEntry({ index: 0, duration: 600, translateY: 20 });
  const { animatedStyle: floatingStyle } = useFloatingAnimation({ distance: 8, duration: 3000, isActive: true });
  const { animatedStyle: titleStyle } = useStaggeredEntry({ index: 1, staggerDelay: 100, duration: 400, translateY: 10 });
  const { animatedStyle: subtitleStyle } = useStaggeredEntry({ index: 2, staggerDelay: 100, duration: 400, translateY: 10 });

  return (
    <Animated.View style={containerStyle} className="px-6 py-10 items-center justify-center opacity-50">
      <Animated.View
        style={floatingStyle}
        className="size-16 bg-zinc-900 rounded-full items-center justify-center mb-4 border border-zinc-800"
      >
        <Shield size={24} color="#71717a" />
      </Animated.View>
      <Animated.View style={titleStyle}>
        <AppText variant="body" color="primary" content="No sessions yet" />
      </Animated.View>
      <Animated.View style={subtitleStyle}>
        <AppText
          variant="body-sm" color="secondary" className="text-center mt-1"
          content={`Complete your first focus session\nto start building your streak.`}
        />
      </Animated.View>
    </Animated.View>
  );
});
