import { useRouter } from "expo-router";
import { View, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInUp, ZoomIn } from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { COLORS } from "@/src/constants";
import { RollingText } from "./components";

export default function AuthScreen() {
  const router = useRouter();
  const { bottom, top } = useSafeAreaInsets();

  const handleGoogleSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Implement Google Sign In
    router.push("/(app)/(public)/(onboarding)/user-details");
  };

  const handleAppleSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Implement Apple Sign In
    router.push("/(app)/(public)/(onboarding)/user-details");
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" />

      {/* Main Content */}
      <View
        className="flex-1 px-7"
        style={{ paddingTop: top + 20, paddingBottom: bottom + 16 }}
      >
        {/* Hero Section - Centered */}
        <View className="flex-1 justify-center">
          {/* Logo + Text Row */}
          <Animated.View
            entering={FadeIn.delay(100).duration(600)}
            className="flex-row items-center gap-4 mb-6"
          >
            <View
              className="size-14 rounded-xl items-center justify-center"
              style={{ backgroundColor: COLORS.electricBlue }}
            >
              <AppText className="text-2xl font-bold text-white">R</AppText>
            </View>
            <AppText variant="h4" className="text-textSecondary">
              Resistor
            </AppText>
          </Animated.View>

          {/* Rolling Text Header */}
          <Animated.View entering={FadeInUp.delay(200).duration(600)}>
            <RollingText
              prefix="Reclaim Your"
              words={["Focus", "Life", "Brain", "Work"]}
              accentColor={COLORS.electricBlue}
            />
          </Animated.View>

          {/* Subtext */}
          <Animated.View entering={FadeInUp.delay(400).duration(500)}>
            <AppText variant="body-lg" color="secondary" className="mt-3">
              Your journey starts with one tap.
            </AppText>
          </Animated.View>

          {/* Auth Buttons - Right below rolling text */}
          <View className="gap-3 mt-10">
            {/* Google Sign In */}
            <Animated.View
              entering={ZoomIn.delay(600).duration(400).springify()}
            >
              <BlurView
                intensity={60}
                tint="dark"
                className="rounded-2xl overflow-hidden border border-white/20"
              >
                <Pressable
                  onPress={handleGoogleSignIn}
                  className="flex-row items-center justify-center py-4 gap-3"
                >
                  <View className="size-8 rounded-full bg-white items-center justify-center">
                    <AppText className="text-lg font-bold text-background">
                      G
                    </AppText>
                  </View>
                  <AppText variant="h6">Continue with Google</AppText>
                </Pressable>
              </BlurView>
            </Animated.View>

            {/* Apple Sign In */}
            <Animated.View
              entering={ZoomIn.delay(700).duration(400).springify()}
            >
              <BlurView
                intensity={60}
                tint="dark"
                className="rounded-2xl overflow-hidden border border-white/20"
              >
                <Pressable
                  onPress={handleAppleSignIn}
                  className="flex-row items-center justify-center py-4 gap-3"
                >
                  <View className="size-8 rounded-full bg-white items-center justify-center">
                    <AppText className="text-lg text-background"></AppText>
                  </View>
                  <AppText variant="h6">Continue with Apple</AppText>
                </Pressable>
              </BlurView>
            </Animated.View>
          </View>
        </View>

        {/* Terms - Fixed at bottom */}
        <Animated.View
          entering={FadeInUp.delay(900).duration(500)}
          className="items-center"
        >
          <AppText
            variant="caption"
            color="tertiary"
            className="text-center leading-relaxed"
          >
            By continuing, you agree to our{" "}
            <AppText variant="caption" className="text-electricBlue">
              Terms
            </AppText>{" "}
            &{" "}
            <AppText variant="caption" className="text-electricBlue">
              Privacy Policy
            </AppText>
          </AppText>
        </Animated.View>
      </View>
    </View>
  );
}
