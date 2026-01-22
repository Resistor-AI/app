import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { Pressable, View, useWindowDimensions, Text } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { AppText } from "@/src/components/atoms";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Brand Colors
const COLORS = {
  black: "#000000",
  gray: "#1a1a1a",
  lightGray: "#2a2a2a",
  blue: "#0A84FF",
  textPrimary: "#ffffff",
  textSecondary: "#86868B",
};

export default function WelcomeScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push("./problem");
  };

  const handleSkip = () => {
    router.push("./complete");
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.black }}>
      <StatusBar style="light" />

      {/* Content */}
      <View className="flex-1 justify-center px-4 gap-y-4">
        {/* Hero Text */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(800).springify()}
        >
          <AppText variant="h1" className="text-6xl leading-tight">
            You Promised Yourself
          </AppText>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).duration(800).springify()}
        >
          <AppText
            variant="h1"
            className="text-5xl leading-tight text-blue-500 font-outfit-semibold my-4"
          >
            Just 5 minutes.
          </AppText>
        </Animated.View>

        {/* Subtext */}
        <Animated.View entering={FadeIn.delay(600).duration(600)}>
          <AppText variant="body-lg" className="leading-relaxed tracking-wide">
            3 hours later, you hate yourself. The guilt. The wasted potential.
          </AppText>
        </Animated.View>
      </View>

      {/* Bottom */}
      <Animated.View
        entering={FadeInUp.delay(800).duration(600).springify()}
        style={{
          paddingHorizontal: 24,
          paddingBottom: height * 0.05,
          gap: 20,
        }}
      >
        {/* Progress */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={{
                width: i === 0 ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === 0 ? COLORS.blue : COLORS.lightGray,
              }}
            />
          ))}
        </View>

        {/* CTA Button */}
        <AnimatedPressable
          onPress={handlePress}
          className="flex-row items-center justify-center py-5 bg-blue-500 rounded-full gap-4"
        >
          <AppText variant="body-lg" className="font-outfit-semibold">
            That's Me
          </AppText>
          <AppText>›››</AppText>
        </AnimatedPressable>
      </Animated.View>
    </View>
  );
}
