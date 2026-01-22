import { useRouter } from "expo-router";
import { View, Pressable, useWindowDimensions } from "react-native";
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
import { AppText } from "@/src/components/atoms/text";

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
  purple: "#8b5cf6",
  purpleLight: "#a78bfa",
  textPrimary: "#ffffff",
  textSecondary: "#a1a1aa",
  textMuted: "#71717a",
};

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
            top: "35%",
            left: "-25%",
            width: 400,
            height: 400,
            borderRadius: 200,
            backgroundColor: COLORS.purpleLight,
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
          paddingTop: height * 0.15,
          paddingBottom: 40,
          justifyContent: "space-between",
        }}
      >
        {/* Header */}
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
              Imagine
            </AppText>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(800)}>
            <AppText
              style={{
                fontSize: 44,
                fontWeight: "700",
                lineHeight: 52,
                color: COLORS.purpleLight,
                letterSpacing: -1.5,
              }}
            >
              Finishing What{"\n"}You Started.
            </AppText>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(800).duration(600)}>
            <AppText
              style={{
                fontSize: 18,
                color: COLORS.textSecondary,
                lineHeight: 28,
                marginTop: 32,
              }}
            >
              Imagine ending the day proud,{"\n"}not exhausted.
            </AppText>
          </Animated.View>

          {/* Permission Cards */}
          <Animated.View
            entering={FadeInUp.delay(1000).duration(600)}
            style={{ marginTop: 32, gap: 12 }}
          >
            {[
              {
                icon: "🔔",
                title: "Notifications",
                desc: "Gentle focus reminders",
              },
              { icon: "📱", title: "Usage Access", desc: "Smart app blocking" },
            ].map((perm, i) => (
              <View
                key={i}
                style={{
                  backgroundColor: COLORS.gray,
                  borderRadius: 20,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: COLORS.purple,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AppText style={{ fontSize: 22 }}>{perm.icon}</AppText>
                </View>
                <View style={{ flex: 1 }}>
                  <AppText
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: COLORS.textPrimary,
                    }}
                  >
                    {perm.title}
                  </AppText>
                  <AppText
                    style={{
                      fontSize: 14,
                      color: COLORS.textSecondary,
                    }}
                  >
                    {perm.desc}
                  </AppText>
                </View>
              </View>
            ))}
          </Animated.View>
        </View>

        {/* Bottom Section */}
        <Animated.View
          entering={FadeInUp.delay(1200).duration(600).springify()}
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
                  backgroundColor: i === 3 ? COLORS.purple : COLORS.lightGray,
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
              Not now
            </AppText>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
