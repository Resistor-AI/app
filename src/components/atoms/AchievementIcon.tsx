import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { AppText } from "./text";
import { IconVariant, AchievementIconProps } from "@/src/types/components/atoms";

const GRADIENT_COLORS: Record<IconVariant, [string, string]> = {
  red: ["#FF6B6B", "#EE5A52"],
  blue: ["#4DA8FF", "#2E8DF7"],
  purple: ["#A855F7", "#8B5CF6"],
  green: ["#34D399", "#10B981"],
  orange: ["#FB923C", "#F97316"],
  pink: ["#F472B6", "#EC4899"],
};

const SIZES = {
  sm: { container: 48, icon: 20 },
  md: { container: 64, icon: 28 },
  lg: { container: 80, icon: 36 },
};

export function AchievementIcon({
  icon,
  variant = "purple",
  size = "md",
  delay = 0,
}: AchievementIconProps) {
  const dimensions = SIZES[size];
  const colors = GRADIENT_COLORS[variant];

  return (
    <Animated.View
      entering={ZoomIn.delay(delay).duration(400).springify()}
      style={{
        width: dimensions.container,
        height: dimensions.container,
        borderRadius: dimensions.container / 2,
        boxShadow: `0 4px 16px ${colors[0]}40`,
      }}
    >
      <LinearGradient
        colors={colors}
        style={{
          flex: 1,
          borderRadius: dimensions.container / 2,
          alignItems: "center",
          justifyContent: "center",
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <AppText style={{ fontSize: dimensions.icon }}>{icon}</AppText>
      </LinearGradient>
    </Animated.View>
  );
}
