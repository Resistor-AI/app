import { useRouter } from "expo-router";
import { View, Pressable, useWindowDimensions } from "react-native";
import { AppText, AchievementIcon } from "@/src/components/atoms";
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

// Brand Colors from Landing Page
const COLORS = {
  black: "#080808",
  offBlack: "#0d0d0d",
  dark: "#121212",
  gray: "#1a1a1a",
  lightGray: "#2a2a2a",
  blue: "#2a6df5",
  blueLight: "#60a5fa",
  green: "#10b981",
  greenLight: "#34d399",
  amber: "#f59e0b",
  amberLight: "#fbbf24",
  purple: "#8b5cf6",
  purpleLight: "#a78bfa",
  red: "#ef4444",
  textPrimary: "#ffffff",
  textSecondary: "#a1a1aa",
  textMuted: "#71717a",
};

const PILLARS = [
  { icon: "🧠", color: COLORS.blue, label: "The Brain" },
  { icon: "🛡️", color: COLORS.amber, label: "The Shield" },
  { icon: "❤️", color: COLORS.green, label: "The Heart" },
  { icon: "👥", color: COLORS.purple, label: "The Squad" },
];

export default function PillarsScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();

  const glowOpacity = useSharedValue(0.1);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.18, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
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
    router.push("./permissions");
  };

  const handleSkip = () => router.push("./complete");

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.black }}>
      <StatusBar style="light" />

      {/* Background Glows */}
      <Animated.View
        style={[
          glowStyle,
          {
            position: "absolute",
            top: "30%",
            left: "-30%",
            width: 400,
            height: 400,
            borderRadius: 200,
            backgroundColor: COLORS.purple,
          },
        ]}
      />
      <Animated.View
        style={[
          glowStyle,
          {
            position: "absolute",
            bottom: "20%",
            right: "-20%",
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: COLORS.green,
          },
        ]}
      />

      {/* Skip Button */}
      <Animated.View
        entering={FadeIn.delay(300).duration(500)}
        style={{
          position: "absolute",
          top: 60,
          right: 24,
          zIndex: 10,
        }}
      >
        <Pressable
          onPress={handleSkip}
          style={{
            backgroundColor: COLORS.lightGray,
            paddingHorizontal: 18,
            paddingVertical: 10,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.1)",
          }}
        >
          <AppText
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: COLORS.textPrimary,
            }}
          >
            Skip
          </AppText>
        </Pressable>
      </Animated.View>

      {/* Main Content */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: 28,
          paddingTop: height * 0.12,
          paddingBottom: 40,
          justifyContent: "space-between",
        }}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(600)}
          style={{ gap: 12 }}
        >
          <AppText
            style={{
              fontSize: 14,
              fontWeight: "600",
              letterSpacing: 4,
              color: COLORS.purpleLight,
            }}
          >
            THE SYSTEM
          </AppText>
          <AppText
            style={{
              fontSize: 38,
              fontWeight: "600",
              lineHeight: 46,
              color: COLORS.textPrimary,
              letterSpacing: -0.5,
            }}
          >
            Four Pillars.{"\n"}
            <AppText style={{ color: COLORS.purpleLight }}>One System.</AppText>
          </AppText>
        </Animated.View>

        {/* Pillars Grid */}
        <View style={{ gap: 16 }}>
          {PILLARS.map((pillar, index) => (
            <Animated.View
              key={index}
              entering={FadeInUp.delay(500 + index * 100).duration(500)}
              style={{
                backgroundColor: COLORS.gray,
                borderRadius: 24,
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  backgroundColor: pillar.color,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppText style={{ fontSize: 26 }}>{pillar.icon}</AppText>
              </View>
              <View style={{ flex: 1 }}>
                <AppText
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    color: COLORS.textPrimary,
                    marginBottom: 4,
                  }}
                >
                  {pillar.label}
                </AppText>
                <AppText
                  style={{
                    fontSize: 14,
                    color: COLORS.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  {pillar.label === "The Brain" &&
                    "AI-driven scheduling based on your energy"}
                  {pillar.label === "The Shield" &&
                    "Unbreakable barriers for deep work"}
                  {pillar.label === "The Heart" &&
                    "Energy tracking and burnout prevention"}
                  {pillar.label === "The Squad" &&
                    "Accountability with your team"}
                </AppText>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Bottom Section */}
        <Animated.View
          entering={FadeInUp.delay(1000).duration(600).springify()}
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
                  width: i === 2 ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === 2 ? COLORS.purple : COLORS.lightGray,
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
              backgroundColor: COLORS.purple,
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
                color: "#fff",
                letterSpacing: 0.3,
              }}
            >
              Continue
            </AppText>
            <AppText style={{ fontSize: 18, color: "#fff" }}>›››</AppText>
          </AnimatedPressable>
        </Animated.View>
      </View>
    </View>
  );
}
