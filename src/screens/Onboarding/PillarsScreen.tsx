import { useRouter } from "expo-router";
import { View, useWindowDimensions } from "react-native";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import Animated, { FadeInUp, ZoomIn } from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { COLORS, PILLARS } from "@/src/constants";
import {
  OnboardingHeader,
  OnboardingButton,
  OnboardingStepper,
} from "./components";
import { cssInterop } from "react-native-css-interop";

// Ensure BlurView supports className
cssInterop(BlurView, {
  className: "style",
});

export default function PillarsScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("./permissions");
  };

  const cardSize = (width - 56 - 12) / 2; // padding + gap

  return (
    <View className="flex-1 bg-background pt-14">
      <StatusBar style="light" />

      {/* Top Section */}
      <View className="px-7">
        <OnboardingStepper totalSteps={4} currentStep={2} />
      </View>

      {/* Main Content */}
      <View className="flex-1 px-7 pb-10 justify-between mt-6">
        {/* Header */}
        <OnboardingHeader
          title="What If Your"
          subtitle={"Device Fought\nFor You?"}
          accentColor="successGreen"
        />

        {/* Pillars Grid - 2x2 */}
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {PILLARS.map((pillar, index) => (
            <Animated.View
              key={index}
              entering={ZoomIn.delay(500 + index * 100)
                .duration(400)
                .springify()}
              style={{ width: cardSize, height: cardSize }}
            >
              <BlurView
                intensity={60}
                tint="dark"
                className="flex-1 rounded-3xl overflow-hidden p-4 border border-white/25"
              >
                {/* Card Content - Centered Vertically */}
                <View className="flex-1 items-center justify-center">
                  {/* Icon Container */}
                  <View
                    className="size-14 rounded-full items-center justify-center"
                    style={{ backgroundColor: pillar.color }}
                  >
                    <AppText className="text-3xl mt-1.5">{pillar.icon}</AppText>
                  </View>

                  {/* Title */}
                  <AppText variant="h5" center className="mt-3">
                    {pillar.title}
                  </AppText>

                  {/* Description */}
                  <AppText
                    variant="label"
                    color="secondary"
                    center
                    className="mt-1"
                  >
                    {pillar.desc}
                  </AppText>
                </View>
              </BlurView>
            </Animated.View>
          ))}
        </View>

        {/* Bottom Section */}
        <Animated.View
          entering={FadeInUp.delay(1000).duration(600).springify()}
          className="gap-5"
        >
          <OnboardingButton
            label="I Want This"
            variant="green"
            onPress={handlePress}
          />
        </Animated.View>
      </View>
    </View>
  );
}
