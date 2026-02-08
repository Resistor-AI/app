import { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming, Easing,
} from "react-native-reanimated";
import { OnboardingLayoutProps } from "@/src/types/Onboarding/OnboardingLayout";
import { OnboardingBackground } from "./OnboardingBackground";
import { OnboardingFooter } from "./OnboardingFooter";

export function OnboardingLayout({
  children, gradientColors, currentStep, totalSteps = 5,
  nextRoute, ctaText = "Continue", onCtaPress, showSkip = true, statusBarStyle = "dark",
}: OnboardingLayoutProps) {
  const router = useRouter();
  const floatY = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ), -1, true,
    );
  }, []);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const handleCta = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onCtaPress) onCtaPress();
    else if (nextRoute) router.push(nextRoute as any);
  };

  return (
    <View style={{ flex: 1 }}>
      <OnboardingBackground
        gradientColors={gradientColors} floatingStyle={floatingStyle}
        showSkip={showSkip} statusBarStyle={statusBarStyle}
        onSkip={() => router.push("./complete" as any)}
      />
      <View style={{
        flex: 1, paddingHorizontal: 28, paddingTop: 120,
        paddingBottom: 40, justifyContent: "space-between",
      }}>
        {children}
        <OnboardingFooter
          currentStep={currentStep} totalSteps={totalSteps}
          ctaText={ctaText} onCta={handleCta}
        />
      </View>
    </View>
  );
}
