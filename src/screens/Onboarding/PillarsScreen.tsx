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
  greenLight: "#34d399",
  amber: "#f59e0b",
  purple: "#8b5cf6",
  purpleLight: "#a78bfa",
  textPrimary: "#ffffff",
  textSecondary: "#a1a1aa",
  textMuted: "#71717a",
};

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
            top: "20%",
            left: "-30%",
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
            bottom: "10%",
            right: "-20%",
            width: 300,
            height: 300,
            borderRadius: 150,
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
          paddingTop: height * 0.12,
          paddingBottom: 40,
          justifyContent: "space-between",
        }}
      >
        {/* Header */}
        <View>
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
              What If Your
            </AppText>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(800)}>
            <AppText
              style={{
                fontSize: 44,
                fontWeight: "700",
                lineHeight: 52,
                color: COLORS.greenLight,
                letterSpacing: -1.5,
              }}
            >
              Device Fought{"\n"}For You?
            </AppText>
          </Animated.View>
        </View>

        {/* Pillars */}
        <View style={{ gap: 12 }}>
          {[
            {
              icon: "🧠",
              title: "The Brain",
              desc: "AI schedules your focus",
              color: COLORS.blue,
            },
            {
              icon: "🛡️",
              title: "The Shield",
              desc: "Blocks distractions",
              color: COLORS.amber,
            },
            {
              icon: "❤️",
              title: "The Heart",
              desc: "Protects your energy",
              color: COLORS.green,
            },
            {
              icon: "👥",
              title: "The Squad",
              desc: "Keeps you accountable",
              color: COLORS.purple,
            },
          ].map((pillar, index) => (
            <Animated.View
              key={index}
              entering={FadeInUp.delay(600 + index * 100).duration(500)}
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
                  backgroundColor: pillar.color,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppText style={{ fontSize: 22 }}>{pillar.icon}</AppText>
              </View>
              <View style={{ flex: 1 }}>
                <AppText
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: COLORS.textPrimary,
                  }}
                >
                  {pillar.title}
                </AppText>
                <AppText
                  style={{
                    fontSize: 14,
                    color: COLORS.textSecondary,
                  }}
                >
                  {pillar.desc}
                </AppText>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Bottom Section */}
        <Animated.View
          entering={FadeInUp.delay(1100).duration(600).springify()}
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
                  backgroundColor: i === 2 ? COLORS.green : COLORS.lightGray,
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
              backgroundColor: COLORS.green,
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
              I Want This
            </AppText>
            <AppText style={{ fontSize: 18, color: COLORS.black }}>›››</AppText>
          </AnimatedPressable>
        </Animated.View>
      </View>
    </View>
  );
}
