import { useRouter } from "expo-router";
import { View, useWindowDimensions } from "react-native";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import Animated, {
  FadeIn,
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import { AppText } from "@/src/components/atoms/text";
import { COLORS } from "@/src/constants";
import {
  OnboardingHeader,
  OnboardingButton,
  OnboardingStepper,
} from "./components";

export default function SetupCompleteScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();

  const sparkleScale = useSharedValue(1);

  useEffect(() => {
    sparkleScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sparkleScale.value }],
  }));

  const handleStart = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/(app)/(protected)");
  };

  return (
    <View className="flex-1 bg-background pt-14">
      <StatusBar style="light" />

      {/* Top Section */}
      <View className="px-7">
        <OnboardingStepper totalSteps={4} currentStep={4} />
      </View>

      {/* Main Content */}
      <View className="flex-1 px-7 pb-10 justify-between mt-6">
        {/* Hero Section */}
        <View className="flex-1 justify-center items-center">
          {/* Success Icon */}
          <Animated.View
            entering={ZoomIn.delay(200).duration(600)}
            style={[
              sparkleStyle,
              {
                width: 140,
                height: 140,
                borderRadius: 70,
                backgroundColor: COLORS.successGreen,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 40,
              },
            ]}
          >
            <AppText className="text-6xl text-textPrimary">✓</AppText>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(500).duration(800)}>
            <OnboardingHeader
              title="That Version"
              subtitle="Of You Exists."
              accentColor="successGreen"
              className="text-center"
            />
          </Animated.View>

          <Animated.View entering={FadeIn.delay(1000).duration(600)}>
            <AppText variant="h5" className="text-center mt-6">
              Resistor helps you find them.
            </AppText>
          </Animated.View>
        </View>

        {/* Bottom Section */}
        <Animated.View
          entering={FadeInUp.delay(1200).duration(600).springify()}
          className="gap-5"
        >
          <OnboardingButton
            label="Let's Begin"
            variant="green"
            onPress={handleStart}
          />
        </Animated.View>
      </View>
    </View>
  );
}
