import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { View, useWindowDimensions } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import {
  OnboardingButton,
  OnboardingHeader,
  OnboardingSubtext,
  OnboardingStepper,
} from "./components";

export default function WelcomeScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push("./problem");
  };

  return (
    <View className="flex-1 bg-background px-7 pt-14">
      <StatusBar style="light" />

      {/* Top Section */}
      <OnboardingStepper totalSteps={6} currentStep={0} />

      {/* Content */}
      <View className="flex-1 justify-center gap-y-5">
        {/* Hero Text */}
        <OnboardingHeader
          title={'"Just 5 More\n Minutes."'}
          subtitle="3 Hours Later..."
        />

        {/* Subtext */}
        <OnboardingSubtext>
          The scroll took your morning. Your energy. Your plans. Again. 😔
        </OnboardingSubtext>
      </View>

      {/* Bottom */}
      <Animated.View
        entering={FadeInUp.delay(800).duration(600).springify()}
        className="gap-5"
        style={{ paddingBottom: height * 0.05 }}
      >
        <OnboardingButton onPress={handlePress} label="Yeah, That's Me" />
      </Animated.View>
    </View>
  );
}
