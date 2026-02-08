import { View, Pressable } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { useHoldButton } from "@/src/hooks/block/useHoldButton";
import { HoldButtonStepProps } from "@/src/types/Block/components";
import { HoldRing } from "./HoldRing";

const RING_SIZE = 180;
const STROKE_WIDTH = 6;

export function HoldButtonStep({ onComplete }: HoldButtonStepProps) {
  const { isHolding, progress, secondsLeft, onPressIn, onPressOut } =
    useHoldButton(onComplete);

  return (
    <View className="flex-1 pt-6 items-center">
      <AppText variant="h3" className="text-white mb-2">
        Final commitment
      </AppText>
      <AppText variant="body" color="secondary" className="mb-8">
        Press and hold the button below for 45 seconds to unlock.
      </AppText>

      <Animated.View entering={FadeIn.duration(400)} className="items-center">
        <View
          className="items-center justify-center"
          style={{ width: RING_SIZE, height: RING_SIZE }}
        >
          <HoldRing
            progress={progress}
            size={RING_SIZE}
            strokeWidth={STROKE_WIDTH}
          />
          <View className="absolute items-center">
            <AppText
              variant="display"
              className="text-white"
              style={{ fontVariant: ["tabular-nums"], fontSize: 48 }}
            >
              {secondsLeft}
            </AppText>
            <AppText variant="body-sm" color="tertiary">
              seconds
            </AppText>
          </View>
        </View>
      </Animated.View>

      <AppText
        variant="h4"
        className="text-white mt-6 mb-2"
      >
        {isHolding ? "Don't let go..." : "Ready when you are"}
      </AppText>
      <AppText variant="body-sm" color="tertiary" className="mb-6">
        {isHolding
          ? `Keep holding — ${secondsLeft}s remaining`
          : "Hold the button without releasing"}
      </AppText>

      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        className="rounded-full py-5 px-16 items-center"
        style={{
          backgroundColor: isHolding ? "#FFFFFF" : "rgba(255,255,255,0.1)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.2)",
        }}
      >
        <AppText
          variant="body-lg"
          className="font-semibold"
          style={{ color: isHolding ? "#050505" : "#FFFFFF" }}
        >
          {isHolding ? "Holding..." : "Hold to Unlock"}
        </AppText>
      </Pressable>
    </View>
  );
}
