import { useRouter } from "expo-router";
import { View, Pressable, useWindowDimensions } from "react-native";
import { AppText } from "@/src/components/atoms";
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Brand Colors
const COLORS = {
  black: "#080808",
  gray: "#1a1a1a",
  lightGray: "#2a2a2a",
  blue: "#2a6df5",
  blueLight: "#60a5fa",
  green: "#10b981",
  greenLight: "#34d399",
  amber: "#f59e0b",
  purple: "#8b5cf6",
  textPrimary: "#ffffff",
  textSecondary: "#a1a1aa",
  textMuted: "#71717a",
};

export default function SetupCompleteScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();

  const sparkleScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.15);

  useEffect(() => {
    sparkleScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.25, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.15, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sparkleScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handleStart = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/(app)/(protected)");
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.black }}>
      <StatusBar style="light" />

      {/* Background Glows */}
      <Animated.View
        style={[
          glowStyle,
          {
            position: "absolute",
            top: "20%",
            left: "-20%",
            width: 400,
            height: 400,
            borderRadius: 200,
            backgroundColor: COLORS.green,
          },
        ]}
      />
      <Animated.View
        style={[
          glowStyle,
          {
            position: "absolute",
            bottom: "25%",
            right: "-25%",
            width: 350,
            height: 350,
            borderRadius: 175,
            backgroundColor: COLORS.blue,
          },
        ]}
      />

      {/* Main Content */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: 28,
          paddingTop: height * 0.15,
          paddingBottom: 40,
          justifyContent: "space-between",
        }}
      >
        {/* Hero Section */}
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {/* Success Icon */}
          <Animated.View
            entering={ZoomIn.delay(200).duration(600)}
            style={[
              sparkleStyle,
              {
                width: 140,
                height: 140,
                borderRadius: 70,
                backgroundColor: COLORS.green,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 40,
              },
            ]}
          >
            <AppText style={{ fontSize: 60, color: "#fff" }}>✓</AppText>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(500).duration(800)}>
            <AppText
              style={{
                fontSize: 44,
                fontWeight: "700",
                lineHeight: 52,
                color: COLORS.textPrimary,
                textAlign: "center",
                letterSpacing: -1.5,
              }}
            >
              That Version
            </AppText>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(700).duration(800)}>
            <AppText
              style={{
                fontSize: 44,
                fontWeight: "700",
                lineHeight: 52,
                color: COLORS.greenLight,
                textAlign: "center",
                letterSpacing: -1.5,
              }}
            >
              Of You Exists.
            </AppText>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(1000).duration(600)}>
            <AppText
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: COLORS.textPrimary,
                textAlign: "center",
                lineHeight: 28,
                marginTop: 24,
              }}
            >
              Resistor helps you find them.
            </AppText>
          </Animated.View>
        </View>

        {/* Bottom Section */}
        <Animated.View
          entering={FadeInUp.delay(1200).duration(600).springify()}
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
                  width: i === 4 ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === 4 ? COLORS.green : COLORS.lightGray,
                }}
              />
            ))}
          </View>

          {/* CTA Button */}
          <AnimatedPressable
            onPress={handleStart}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: COLORS.green,
              paddingVertical: 22,
              paddingHorizontal: 32,
              borderRadius: 32,
              gap: 12,
            }}
          >
            <AppText
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: COLORS.black,
                letterSpacing: 0.5,
              }}
            >
              Let's Begin
            </AppText>
            <AppText style={{ fontSize: 18, color: COLORS.black }}>›››</AppText>
          </AnimatedPressable>
        </Animated.View>
      </View>
    </View>
  );
}
