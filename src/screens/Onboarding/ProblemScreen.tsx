import { useRouter } from "expo-router";
import { View, Pressable, useWindowDimensions } from "react-native";
import { AppText } from "@/src/components/atoms";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Brand Colors
const COLORS = {
  black: "#080808",
  gray: "#1a1a1a",
  lightGray: "#2a2a2a",
  blue: "#2a6df5",
  blueLight: "#60a5fa",
  green: "#10b981",
  amber: "#f59e0b",
  amberLight: "#fbbf24",
  purple: "#8b5cf6",
  textPrimary: "#ffffff",
  textSecondary: "#a1a1aa",
  textMuted: "#71717a",
};

export default function ProblemScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();

  const glowOpacity = useSharedValue(0.12);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.12, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("./pillars");
  };

  const handleSkip = () => router.push("./complete");

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.black }}>
      <StatusBar style="light" />

      {/* Background Glow */}
      <Animated.View
        style={[
          glowStyle,
          {
            position: "absolute",
            top: "30%",
            right: "-30%",
            width: 450,
            height: 450,
            borderRadius: 225,
            backgroundColor: COLORS.amber,
          },
        ]}
      />

      {/* Main Content */}
      <View
        className="flex-1 px-4 pb-6 justify-between"
        style={{
          paddingTop: height * 0.15,
          paddingBottom: 40,
        }}
      >
        {/* Emotional Text */}
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Animated.View entering={FadeInDown.delay(200).duration(800)}>
            <AppText
              style={{
                fontSize: 44,
                fontWeight: "700",
                lineHeight: 52,
                color: COLORS.textPrimary,
                letterSpacing: -1.5,
              }}
            >
              You're Not{"\n"}Broken.
            </AppText>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500).duration(800)}>
            <AppText
              style={{
                fontSize: 44,
                fontWeight: "700",
                lineHeight: 52,
                color: COLORS.amberLight,
                letterSpacing: -1.5,
                marginTop: 8,
              }}
            >
              You're Just{"\n"}Fighting Alone.
            </AppText>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(900).duration(600)}>
            <AppText
              style={{
                fontSize: 18,
                color: COLORS.textSecondary,
                lineHeight: 28,
                marginTop: 32,
              }}
            >
              Willpower alone can't fight a{"\n"}billion-dollar attention
              economy.
            </AppText>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(1100).duration(600)}>
            <AppText
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: COLORS.textPrimary,
                lineHeight: 28,
                marginTop: 16,
              }}
            >
              You need a system that fights back.
            </AppText>
          </Animated.View>
        </View>

        {/* Bottom Section */}
        <Animated.View
          entering={FadeInUp.delay(1300).duration(600).springify()}
          style={{ gap: 20 }}
        >
          {/* Page Dots */}
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
                  width: i === 1 ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === 1 ? COLORS.amber : COLORS.lightGray,
                }}
              />
            ))}
          </View>

          {/* CTA Button */}
          <AnimatedPressable
            onPress={handlePress}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: COLORS.amber,
              paddingVertical: 20,
              paddingHorizontal: 32,
              borderRadius: 32,
              gap: 12,
            }}
          >
            <AppText
              style={{
                fontSize: 17,
                fontWeight: "600",
                color: COLORS.black,
                letterSpacing: 0.3,
              }}
            >
              Show Me How
            </AppText>
            <AppText style={{ fontSize: 18, color: COLORS.black }}>›››</AppText>
          </AnimatedPressable>
        </Animated.View>
      </View>
    </View>
  );
}
