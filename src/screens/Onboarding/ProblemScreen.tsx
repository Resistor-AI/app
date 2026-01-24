import { useRouter } from "expo-router";
import { View, useWindowDimensions } from "react-native";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInUp } from "react-native-reanimated";
import {
  OnboardingHeader,
  OnboardingSubtext,
  OnboardingButton,
  OnboardingStepper,
} from "./components";

export default function ProblemScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("./pillars");
  };

  return (
    <View className="flex-1 bg-background pt-14">
      <StatusBar style="light" />

      {/* Top Section */}
      <View className="px-7">
        <OnboardingStepper totalSteps={4} currentStep={1} />
      </View>

      {/* Main Content */}
      <View className="flex-1 px-7 pb-10 justify-between mt-10">
        {/* Header & Subtext */}
        <View className="flex-1 justify-center gap-y-5">
          <OnboardingHeader
            title={"You're Not\nBroken."}
            accentColor="amberLight"
            subtitle={"Your Focus is under Attack 😭"}
          />

          <OnboardingSubtext
            animationDelay={900}
            emphasis="You need a system that fights back."
          >
            Willpower alone can't fight a billion-dollar attention economy.
          </OnboardingSubtext>
        </View>

        {/* Bottom Section */}
        <Animated.View
          entering={FadeInUp.delay(1300).duration(400).springify()}
          className="gap-5"
        >
          <OnboardingButton
            label="Show Me How"
            variant="amber"
            onPress={handlePress}
          />
        </Animated.View>
      </View>
    </View>
  );
}
