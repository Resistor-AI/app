import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { AppText } from "@/src/components/atoms";
import { StatusBar } from "expo-status-bar";
import { Pressable, View, useWindowDimensions } from "react-native";
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
import { LinearGradient } from "expo-linear-gradient";

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

export default function WelcomeScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();

  // Floating animation for cards
  const floatY1 = useSharedValue(0);
  const floatY2 = useSharedValue(0);
  const rotate1 = useSharedValue(-12);
  const rotate2 = useSharedValue(8);
  const glowOpacity = useSharedValue(0.15);

  useEffect(() => {
    floatY1.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    floatY2.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    rotate1.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-12, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    rotate2.value = withRepeat(
      withSequence(
        withTiming(12, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
        withTiming(8, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.25, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.15, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  const card1Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatY1.value },
      { rotate: `${rotate1.value}deg` },
    ],
  }));

  const card2Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatY2.value },
      { rotate: `${rotate2.value}deg` },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

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

      {/* Mesh Background Glow */}
      <Animated.View
        style={[
          glowStyle,
          {
            position: "absolute",
            top: "-20%",
            left: "-30%",
            width: 500,
            height: 500,
            borderRadius: 250,
            backgroundColor: COLORS.blue,
          },
        ]}
      />
      <Animated.View
        style={[
          glowStyle,
          {
            position: "absolute",
            bottom: "-10%",
            right: "-20%",
            width: 400,
            height: 400,
            borderRadius: 200,
            backgroundColor: COLORS.purple,
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
          paddingTop: height * 0.1,
          paddingBottom: 40,
          justifyContent: "space-between",
        }}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <AppText
            style={{
              fontSize: 14,
              fontWeight: "600",
              letterSpacing: 4,
              color: COLORS.blue,
              marginBottom: 8,
            }}
          >
            RESISTOR
          </AppText>
          <AppText
            style={{
              fontSize: 42,
              fontWeight: "300",
              lineHeight: 50,
              color: COLORS.textPrimary,
              letterSpacing: -1,
            }}
          >
            Reclaim Your{"\n"}
            <AppText style={{ fontWeight: "700", color: COLORS.blueLight }}>
              Focus
            </AppText>
            .
          </AppText>
        </Animated.View>

        {/* Floating Cards Section */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          {/* Focus Card */}
          <Animated.View
            entering={FadeIn.delay(400).duration(800)}
            style={[
              card1Style,
              {
                position: "absolute",
                left: 20,
                top: "10%",
              },
            ]}
          >
            <View
              style={{
                backgroundColor: COLORS.gray,
                borderRadius: 24,
                padding: 20,
                width: 140,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.08)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: COLORS.blue,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <AppText style={{ fontSize: 20, color: "#fff" }}>⚡</AppText>
              </View>
              <AppText
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: COLORS.textPrimary,
                  marginBottom: 4,
                }}
              >
                Focus
              </AppText>
              <AppText
                style={{
                  fontSize: 12,
                  color: COLORS.textSecondary,
                  textAlign: "center",
                  lineHeight: 16,
                }}
              >
                Deep work with blocking
              </AppText>
            </View>
          </Animated.View>

          {/* Break Card */}
          <Animated.View
            entering={FadeIn.delay(600).duration(800)}
            style={[
              card2Style,
              {
                position: "absolute",
                right: 20,
                bottom: "15%",
              },
            ]}
          >
            <View
              style={{
                backgroundColor: COLORS.gray,
                borderRadius: 24,
                padding: 20,
                width: 140,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.08)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: COLORS.green,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <AppText style={{ fontSize: 20, color: "#fff" }}>⏰</AppText>
              </View>
              <AppText
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: COLORS.textPrimary,
                  marginBottom: 4,
                }}
              >
                Break
              </AppText>
              <AppText
                style={{
                  fontSize: 12,
                  color: COLORS.textSecondary,
                  textAlign: "center",
                  lineHeight: 16,
                }}
              >
                Smart energy recovery
              </AppText>
            </View>
          </Animated.View>

          {/* User Card */}
          <Animated.View
            entering={FadeInUp.delay(800).duration(600)}
            style={{
              position: "absolute",
              bottom: 0,
              left: 20,
              right: 20,
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.gray,
                borderRadius: 28,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: COLORS.purple,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppText style={{ fontSize: 18 }}>👤</AppText>
              </View>
              <View style={{ flex: 1 }}>
                <AppText
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: COLORS.textPrimary,
                  }}
                >
                  Your Focus Journey
                </AppText>
                <AppText style={{ fontSize: 13, color: COLORS.textSecondary }}>
                  AI-powered productivity
                </AppText>
              </View>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: COLORS.amber,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppText style={{ fontSize: 16 }}>🍅</AppText>
              </View>
            </View>
          </Animated.View>
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
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: COLORS.blue,
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
              Get Started
            </AppText>
            <AppText style={{ fontSize: 18, color: "#fff" }}>›››</AppText>
          </AnimatedPressable>
        </Animated.View>
      </View>
    </View>
  );
}
