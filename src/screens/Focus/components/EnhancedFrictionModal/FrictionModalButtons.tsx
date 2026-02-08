import { View, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { useScalePress } from "@/src/hooks/animations/useScalePress";
import { OnboardingButton } from "@/src/screens/Onboarding/components/OnboardingButton";
import { FrictionModalButtonsProps } from "@/src/types/Focus/EnhancedFrictionModal";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FrictionModalButtons({
  isAnswerCorrect, onBackToFocus, onExit,
}: FrictionModalButtonsProps) {
  const exitPress = useScalePress({ minScale: 0.97 });

  return (
    <View className="gap-3">
      <OnboardingButton
        label="Stay Locked In"
        variant="white"
        showArrow={false}
        onPress={onBackToFocus}
        style={{ marginTop: 0 }}
      />

      <AnimatedPressable
        onPress={onExit}
        disabled={!isAnswerCorrect}
        onPressIn={isAnswerCorrect ? exitPress.onPressIn : undefined}
        onPressOut={isAnswerCorrect ? exitPress.onPressOut : undefined}
        style={isAnswerCorrect ? exitPress.animatedStyle : { opacity: 0.3 }}
        className="items-center rounded-full border border-white/[0.06] bg-white/[0.04] py-5"
      >
        <AppText
          variant="body"
          className="font-medium"
          style={{ color: isAnswerCorrect ? "#f87171" : "rgba(255,255,255,0.3)" }}
        >
          End Session
        </AppText>
      </AnimatedPressable>
    </View>
  );
}
