import { View, Pressable } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { OnboardingFooterProps } from "@/src/types/Onboarding/OnboardingLayout";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function OnboardingFooter({
  currentStep, totalSteps, ctaText, onCta,
}: OnboardingFooterProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(600).duration(600).springify()}
      style={{ gap: 20 }}
    >
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 8 }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            style={{
              width: i === currentStep ? 24 : 8, height: 8, borderRadius: 4,
              backgroundColor: i === currentStep ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.15)",
            }}
          />
        ))}
      </View>
      <AnimatedPressable
        onPress={onCta}
        style={{
          flexDirection: "row", alignItems: "center", justifyContent: "center",
          backgroundColor: "#1a1a1a", paddingVertical: 18, paddingHorizontal: 32,
          borderRadius: 30, gap: 12,
        }}
      >
        <AppText style={{ fontSize: 17, fontWeight: "600", color: "#fff", letterSpacing: 0.3 }}>
          {ctaText}
        </AppText>
        <AppText style={{ fontSize: 20, color: "#fff" }}>›››</AppText>
      </AnimatedPressable>
    </Animated.View>
  );
}
