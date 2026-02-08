import { useEffect } from "react";
import { View } from "react-native";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { COLORS } from "@/src/constants/colors";
import { RollingText } from "./components/RollingText";
import { AuthButtons } from "./components/AuthButtons";
import { useOAuthSignIn } from "@/src/hooks/auth/useOAuthSignIn";
import { useAuthStore } from "@/src/store/authStore";
import { useOnboardingStore } from "@/src/store/onboardingStore";

export default function AuthScreen() {
  const { bottom, top } = useSafeAreaInsets();
  const { signIn, isLoading, error } = useOAuthSignIn();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasCompletedOnboarding = useOnboardingStore((s) => s.hasCompletedOnboarding);

  useEffect(() => {
    if (isAuthenticated && !hasCompletedOnboarding) {
      router.replace("/(app)/(public)/(onboarding)/user-details");
    }
  }, [isAuthenticated, hasCompletedOnboarding, router]);

  const handleGoogleSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signIn("google");
  };

  const handleAppleSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signIn("apple");
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" />
      <View className="flex-1 px-7" style={{ paddingTop: top + 20, paddingBottom: bottom + 16 }}>
        <View className="flex-1 justify-center">
          <Animated.View entering={FadeIn.delay(100).duration(600)} className="flex-row items-center gap-4 mb-6">
            <View className="size-14 rounded-xl items-center justify-center" style={{ backgroundColor: COLORS.electricBlue }}>
              <AppText className="text-2xl font-bold text-white">R</AppText>
            </View>
            <AppText variant="h4" className="text-textSecondary">Resistor</AppText>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(200).duration(600)}>
            <RollingText prefix="Reclaim Your" words={["Focus", "Life", "Brain", "Work"]} accentColor={COLORS.electricBlue} />
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(400).duration(500)}>
            <AppText variant="body-lg" color="secondary" className="mt-3">Your journey starts with one tap.</AppText>
          </Animated.View>
          <AuthButtons onGoogleSignIn={handleGoogleSignIn} onAppleSignIn={handleAppleSignIn} isLoading={isLoading} error={error} />
        </View>
        <Animated.View entering={FadeInUp.delay(900).duration(500)} className="items-center">
          <AppText variant="caption" color="tertiary" className="text-center leading-relaxed">
            By continuing, you agree to our{" "}
            <AppText variant="caption" className="text-electricBlue">Terms</AppText>{" "}&{" "}
            <AppText variant="caption" className="text-electricBlue">Privacy Policy</AppText>
          </AppText>
        </Animated.View>
      </View>
    </View>
  );
}
