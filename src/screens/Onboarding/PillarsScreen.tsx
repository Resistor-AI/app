import { useRouter } from "expo-router";
import { View, useWindowDimensions } from "react-native";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import Animated, { FadeInUp, ZoomIn } from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { PILLARS } from "@/src/constants/data";
import { cssInterop } from "react-native-css-interop";
import { OnboardingStepper } from "./components/OnboardingStepper";
import { OnboardingHeader } from "./components/OnboardingHeader";
import { OnboardingButton } from "./components/OnboardingButton";

cssInterop(BlurView, { className: "style" });

export default function PillarsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardSize = (width - 56 - 12) / 2;

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(app)/(public)/(auth)");
  };

  return (
    <View className="flex-1 bg-background pt-14">
      <StatusBar style="light" />
      <View className="px-7"><OnboardingStepper totalSteps={6} currentStep={2} /></View>
      <View className="flex-1 px-7 pb-10 justify-between mt-6">
        <OnboardingHeader title="What If 🤔" subtitle={"Your Device Fought For You?"} accentColor="successGreen" />
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {PILLARS.map((pillar, index) => (
            <Animated.View
              key={index}
              entering={ZoomIn.delay(500 + index * 100).duration(400).springify()}
              style={{ width: cardSize, height: cardSize }}
            >
              <BlurView intensity={60} tint="dark" className="flex-1 rounded-3xl overflow-hidden p-4 border border-white/25">
                <View className="flex-1 items-center justify-center">
                  <View className="size-14 rounded-full items-center justify-center" style={{ backgroundColor: pillar.color }}>
                    <AppText className="text-3xl mt-1.5">{pillar.icon}</AppText>
                  </View>
                  <AppText variant="h5" center className="mt-3">{pillar.title}</AppText>
                  <AppText variant="label" color="secondary" center className="mt-1">{pillar.desc}</AppText>
                </View>
              </BlurView>
            </Animated.View>
          ))}
        </View>
        <Animated.View entering={FadeInUp.delay(1000).duration(600).springify()} className="gap-5">
          <OnboardingButton label="I Want This" variant="green" onPress={handlePress} />
        </Animated.View>
      </View>
    </View>
  );
}
