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

const PERMISSIONS = [
  {
    icon: "🔔",
    title: "Notifications",
    desc: "Get reminders to stay focused",
    color: COLORS.blue,
  },
  {
    icon: "📱",
    title: "Usage Access",
    desc: "Track and block distracting apps",
    color: COLORS.purple,
  },
];

export default function PermissionsScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();

  const glowOpacity = useSharedValue(0.1);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.15, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
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
    router.push("./complete");
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
            top: "40%",
            left: "-20%",
            width: 350,
            height: 350,
            borderRadius: 175,
            backgroundColor: COLORS.blue,
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
              color: COLORS.blueLight,
            }}
          >
            PERMISSIONS
          </AppText>
          <AppText
            style={{
              fontSize: 34,
              fontWeight: "600",
              lineHeight: 42,
              color: COLORS.textPrimary,
              letterSpacing: -0.5,
            }}
          >
            Stay Motivated{"\n"}& On{" "}
            <AppText style={{ color: COLORS.blueLight }}>Track</AppText>
          </AppText>
          <AppText
            style={{
              fontSize: 16,
              color: COLORS.textSecondary,
              lineHeight: 24,
            }}
          >
            Enable permissions to let Resistor guard your focus automatically.
          </AppText>
        </Animated.View>

        {/* Permission Cards */}
        <View style={{ gap: 16 }}>
          {PERMISSIONS.map((perm, index) => (
            <Animated.View
              key={index}
              entering={FadeInUp.delay(500 + index * 150).duration(600)}
              style={{
                backgroundColor: COLORS.gray,
                borderRadius: 24,
                padding: 24,
                flexDirection: "row",
                alignItems: "center",
                gap: 18,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  backgroundColor: perm.color,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppText style={{ fontSize: 28 }}>{perm.icon}</AppText>
              </View>
              <View style={{ flex: 1 }}>
                <AppText
                  style={{
                    fontSize: 17,
                    fontWeight: "600",
                    color: COLORS.textPrimary,
                    marginBottom: 4,
                  }}
                >
                  {perm.title}
                </AppText>
                <AppText
                  style={{
                    fontSize: 14,
                    color: COLORS.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  {perm.desc}
                </AppText>
              </View>
            </Animated.View>
          ))}

          {/* Trust Badge */}
          <Animated.View
            entering={FadeIn.delay(900).duration(500)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingTop: 16,
            }}
          >
            <AppText style={{ fontSize: 18 }}>🔐</AppText>
            <AppText
              style={{
                fontSize: 13,
                color: COLORS.textMuted,
              }}
            >
              Your data stays private and secure
            </AppText>
          </Animated.View>
        </View>

        {/* Bottom Section */}
        <Animated.View
          entering={FadeInUp.delay(1000).duration(600).springify()}
          style={{ gap: 16 }}
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
                  width: i === 3 ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === 3 ? COLORS.blue : COLORS.lightGray,
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
              Allow Permissions
            </AppText>
          </AnimatedPressable>

          {/* Skip Link */}
          <Pressable
            onPress={handleSkip}
            style={{ alignItems: "center", paddingVertical: 8 }}
          >
            <AppText
              style={{
                fontSize: 15,
                color: COLORS.textMuted,
                fontWeight: "500",
              }}
            >
              Maybe later
            </AppText>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
