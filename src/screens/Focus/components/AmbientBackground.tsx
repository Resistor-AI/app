import { View } from "react-native";
import Animated from "react-native-reanimated";
import { useFloatingAnimation } from "@/src/hooks/animations/useFloatingAnimation";
import { AmbientBackgroundProps } from "@/src/types/Focus/components";

export function AmbientBackground({ isBreak = false }: AmbientBackgroundProps) {
  const glowOrb = useFloatingAnimation({
    distance: 15,
    duration: 5000,
    isActive: true,
  });

  const primaryColor = isBreak ? "#30D158" : "#0A84FF";

  return (
    <View className="absolute inset-0 overflow-hidden" pointerEvents="none">
      {/* Main glow - centered behind timer */}
      <Animated.View
        style={[
          glowOrb.animatedStyle,
          {
            position: "absolute",
            top: "35%",
            left: "50%",
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: primaryColor,
            opacity: 0.1,
            transform: [{ translateX: -150 }, { translateY: -150 }],
          },
        ]}
      />
    </View>
  );
}
