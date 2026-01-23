import { useRouter } from "expo-router";
import { View, Pressable } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect, type ReactNode } from "react";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface OnboardingLayoutProps {
  children: ReactNode;
  gradientColors: [string, string, ...string[]];
  currentStep: number;
  totalSteps?: number;
  nextRoute?: string;
  ctaText?: string;
  onCtaPress?: () => void;
  showSkip?: boolean;
  statusBarStyle?: "light" | "dark";
}

export function OnboardingLayout({
  children,
  gradientColors,
  currentStep,
  totalSteps = 5,
  nextRoute,
  ctaText = "Continue",
  onCtaPress,
  showSkip = true,
  statusBarStyle = "dark",
}: OnboardingLayoutProps) {
  const router = useRouter();

  // Subtle floating animation for ambience
  const floatY = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const handleCta = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onCtaPress) {
      onCtaPress();
    } else if (nextRoute) {
      router.push(nextRoute as any);
    }
  };

  const handleSkip = () => {
    router.push("./complete" as any);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={statusBarStyle} />

      {/* Background Gradient */}
      <LinearGradient
        colors={gradientColors}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Ambient Glow Orb */}
      <Animated.View
        style={[
          floatingStyle,
          {
            position: "absolute",
            top: "15%",
            right: "-20%",
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: "rgba(255,255,255,0.15)",
          },
        ]}
      />

      {/* Skip Button */}
      {showSkip && (
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
              backgroundColor: "rgba(0,0,0,0.08)",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <AppText style={{ fontSize: 14, fontWeight: "600", color: "#333" }}>
              Skip
            </AppText>
          </Pressable>
        </Animated.View>
      )}

      {/* Main Content */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: 28,
          paddingTop: 120,
          paddingBottom: 40,
          justifyContent: "space-between",
        }}
      >
        {children}

        {/* Bottom Section */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(600).springify()}
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
            {Array.from({ length: totalSteps }).map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === currentStep ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor:
                    i === currentStep ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.15)",
                }}
              />
            ))}
          </View>

          {/* CTA Button */}
          <AnimatedPressable
            onPress={handleCta}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#1a1a1a",
              paddingVertical: 18,
              paddingHorizontal: 32,
              borderRadius: 30,
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
              {ctaText}
            </AppText>
            <AppText style={{ fontSize: 20, color: "#fff" }}>›››</AppText>
          </AnimatedPressable>
        </Animated.View>
      </View>
    </View>
  );
}
