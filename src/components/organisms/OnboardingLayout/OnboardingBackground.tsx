import { View, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn } from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { OnboardingBackgroundProps } from "@/src/types/Onboarding/OnboardingLayout";

export function OnboardingBackground({
  gradientColors, floatingStyle, showSkip, statusBarStyle, onSkip,
}: OnboardingBackgroundProps) {
  return (
    <>
      <StatusBar style={statusBarStyle} />
      <LinearGradient
        colors={gradientColors}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Animated.View style={[floatingStyle, {
        position: "absolute", top: "15%" as any, right: "-20%" as any,
        width: 300, height: 300, borderRadius: 150,
        backgroundColor: "rgba(255,255,255,0.15)",
      }]} />
      {showSkip && (
        <Animated.View
          entering={FadeIn.delay(300).duration(500)}
          style={{ position: "absolute", top: 60, right: 24, zIndex: 10 }}
        >
          <Pressable
            onPress={onSkip}
            style={{
              backgroundColor: "rgba(0,0,0,0.08)",
              paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
            }}
          >
            <AppText style={{ fontSize: 14, fontWeight: "600", color: "#333" }}>
              Skip
            </AppText>
          </Pressable>
        </Animated.View>
      )}
    </>
  );
}
