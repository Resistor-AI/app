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
            top: "10%",
            right: "-20%",
            width: 400,
            height: 400,
            borderRadius: 200,
            backgroundColor: COLORS.amber,
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
        {/* Feature Card */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(700)}
          style={{
            backgroundColor: COLORS.gray,
            borderRadius: 28,
            padding: 24,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
          }}
        >
          {/* Card Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.lightGray,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 16,
              }}
            >
              <AppText
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: COLORS.textPrimary,
                }}
              >
                Smart Blocking
              </AppText>
            </View>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: COLORS.lightGray,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppText style={{ fontSize: 16, color: COLORS.textSecondary }}>
                ↗
              </AppText>
            </View>
          </View>

          {/* Card Title */}
          <AppText
            style={{
              fontSize: 26,
              fontWeight: "600",
              color: COLORS.textPrimary,
              lineHeight: 34,
              marginBottom: 10,
            }}
          >
            Distraction-Free{"\n"}Focus Session
          </AppText>

          {/* Meta Info */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginTop: 16,
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.lightGray,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
              }}
            >
              <AppText style={{ fontSize: 13, color: COLORS.textSecondary }}>
                25 min
              </AppText>
            </View>
            <View
              style={{
                backgroundColor: COLORS.lightGray,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
              }}
            >
              <AppText style={{ fontSize: 13, color: COLORS.textSecondary }}>
                Today
              </AppText>
            </View>

            {/* Avatar Stack */}
            <View style={{ flexDirection: "row", marginLeft: "auto" }}>
              {["🧠", "⚡", "🎯"].map((emoji, i) => (
                <View
                  key={i}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor:
                      i === 0
                        ? COLORS.blue
                        : i === 1
                          ? COLORS.amber
                          : COLORS.purple,
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: i > 0 ? -10 : 0,
                    borderWidth: 2,
                    borderColor: COLORS.gray,
                  }}
                >
                  <AppText style={{ fontSize: 14 }}>{emoji}</AppText>
                </View>
              ))}
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: COLORS.lightGray,
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: -10,
                  borderWidth: 2,
                  borderColor: COLORS.gray,
                }}
              >
                <AppText style={{ fontSize: 10, color: COLORS.textPrimary }}>
                  2+
                </AppText>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Text Section */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(600)}
          style={{ gap: 12 }}
        >
          <AppText
            style={{
              fontSize: 14,
              fontWeight: "600",
              letterSpacing: 4,
              color: COLORS.amber,
            }}
          >
            THE SHIELD
          </AppText>
          <AppText
            style={{
              fontSize: 36,
              fontWeight: "600",
              lineHeight: 44,
              color: COLORS.textPrimary,
              letterSpacing: -0.5,
            }}
          >
            Block Distractions,{"\n"}Find Your{" "}
            <AppText style={{ color: COLORS.amberLight }}>Flow</AppText>
          </AppText>
          <AppText
            style={{
              fontSize: 16,
              color: COLORS.textSecondary,
              lineHeight: 24,
            }}
          >
            AI-powered app blocking learns your patterns and protects your focus
            automatically.
          </AppText>
        </Animated.View>

        {/* Bottom Section */}
        <Animated.View
          entering={FadeInUp.delay(800).duration(600).springify()}
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
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <AnimatedPressable
              onPress={handlePress}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.amber,
                paddingVertical: 20,
                paddingHorizontal: 28,
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
                Continue
              </AppText>
              <AppText style={{ fontSize: 18, color: COLORS.black }}>
                ›››
              </AppText>
            </AnimatedPressable>

            {/* Tomato Icon */}
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: COLORS.gray,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <AppText style={{ fontSize: 24 }}>🍅</AppText>
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
