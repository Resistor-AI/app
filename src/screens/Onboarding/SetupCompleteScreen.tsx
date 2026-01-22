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
  textPrimary: "#ffffff",
  textSecondary: "#a1a1aa",
  textMuted: "#71717a",
};

export default function SetupCompleteScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();

  // Celebration animations
  const sparkleScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.15);

  useEffect(() => {
    sparkleScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
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
            top: "15%",
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
            bottom: "30%",
            right: "-30%",
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
          paddingTop: height * 0.12,
          paddingBottom: 40,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Celebration Icon */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Background Ring */}
          <Animated.View
            entering={ZoomIn.delay(200).duration(600)}
            style={[
              sparkleStyle,
              {
                width: 180,
                height: 180,
                borderRadius: 90,
                backgroundColor: COLORS.gray,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
                boxShadow: `0 20px 60px ${COLORS.green}40`,
              },
            ]}
          >
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: COLORS.green,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppText style={{ fontSize: 60 }}>✓</AppText>
            </View>
          </Animated.View>

          {/* Floating Celebratory Icons */}
          {[
            { emoji: "🎉", top: 60, left: 50 },
            { emoji: "⭐", top: 80, right: 50 },
            { emoji: "🚀", bottom: 100, left: 60 },
          ].map((item, i) => (
            <Animated.View
              key={i}
              entering={FadeIn.delay(600 + i * 150)
                .duration(500)
                .springify()}
              style={{
                position: "absolute",
                ...item,
              }}
            >
              <AppText style={{ fontSize: 28 }}>{item.emoji}</AppText>
            </Animated.View>
          ))}
        </View>

        {/* Text Section */}
        <Animated.View
          entering={FadeInUp.delay(800).duration(600)}
          style={{ alignItems: "center", gap: 12, marginBottom: 40 }}
        >
          <AppText
            style={{
              fontSize: 40,
              fontWeight: "700",
              lineHeight: 48,
              color: COLORS.textPrimary,
              textAlign: "center",
              letterSpacing: -0.5,
            }}
          >
            You're All{" "}
            <AppText style={{ color: COLORS.greenLight }}>Set!</AppText>
          </AppText>
          <AppText
            style={{
              fontSize: 17,
              color: COLORS.textSecondary,
              textAlign: "center",
              lineHeight: 26,
              paddingHorizontal: 20,
            }}
          >
            That focused version of you that finishes what they start? Let's go
            meet them.
          </AppText>
        </Animated.View>

        {/* Bottom Section */}
        <Animated.View
          entering={FadeInUp.delay(1000).duration(600).springify()}
          style={{ width: "100%", gap: 20 }}
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
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <AnimatedPressable
              onPress={handleStart}
              style={{
                flex: 1,
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
                Enter Resistor
              </AppText>
              <AppText style={{ fontSize: 18, color: COLORS.black }}>
                ›››
              </AppText>
            </AnimatedPressable>

            {/* Icon */}
            <View
              style={{
                width: 58,
                height: 58,
                borderRadius: 29,
                backgroundColor: COLORS.gray,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <AppText style={{ fontSize: 26 }}>🍅</AppText>
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
