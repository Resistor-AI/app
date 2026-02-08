import React, { memo } from "react";
import { View, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { useStaggeredEntry } from "@/src/hooks/animations/useStaggeredEntry";

export const ListHeader = memo(function ListHeader({ children }: { children?: React.ReactNode }) {
  const { animatedStyle } = useStaggeredEntry({ index: 3, staggerDelay: 100, duration: 400, translateY: 10 });

  return (
    <View>
      {children}
      <Animated.View style={animatedStyle} className="px-6 flex-row justify-between items-end mb-4">
        <AppText content="Past Sessions" variant="overline" />
        <Pressable>
          <AppText content="View All" variant="overline" color="blue" />
        </Pressable>
      </Animated.View>
    </View>
  );
});
