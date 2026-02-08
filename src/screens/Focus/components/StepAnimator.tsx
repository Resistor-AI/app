import React from "react";
import Animated, {
  SlideInRight, SlideInLeft, SlideOutLeft, SlideOutRight,
} from "react-native-reanimated";
import { StepAnimatorProps } from "@/src/types/Focus/SessionSetup";

export function StepAnimator({
  stepKey, stepDirection, variant, children, paddingBottom = 200,
}: StepAnimatorProps) {
  const entering = stepDirection === "forward"
    ? SlideInRight.duration(250) : SlideInLeft.duration(250);
  const exiting = stepDirection === "forward"
    ? SlideOutLeft.duration(150) : SlideOutRight.duration(150);

  if (variant === "scroll") {
    return (
      <Animated.ScrollView
        key={stepKey}
        entering={entering}
        exiting={exiting}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        className="flex-1"
      >
        {children}
      </Animated.ScrollView>
    );
  }

  return (
    <Animated.View
      key={stepKey}
      entering={entering}
      exiting={exiting}
      className="flex-1 px-6"
      style={{ paddingBottom }}
    >
      {children}
    </Animated.View>
  );
}
