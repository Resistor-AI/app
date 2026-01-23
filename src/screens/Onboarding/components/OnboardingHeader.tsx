import { View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { twMerge } from "tailwind-merge";

// Explicit class mappings for Tailwind to detect at build time
const ACCENT_COLORS = {
  textPrimary: "text-textPrimary",
  electricBlue: "text-electricBlue",
  amberLight: "text-amberLight",
  successGreen: "text-successGreen",
  deepPurple: "text-deepPurple",
  neonRed: "text-neonRed",
} as const;

export interface OnboardingHeaderProps {
  /** First line of header (primary color) */
  title: string;
  /** Second line of header (accent color) */
  subtitle?: string;
  /** Color for subtitle - uses Tailwind config colors */
  accentColor?: keyof typeof ACCENT_COLORS;
  /** Animation delay offset in ms */
  animationDelay?: number;

  className?: string;
}

/**
 * OnboardingHeader - Two-line header with accent color for onboarding screens
 */
export function OnboardingHeader({
  title,
  subtitle,
  accentColor = "electricBlue",
  animationDelay = 200,
  className,
}: OnboardingHeaderProps) {
  const accentColorClass = ACCENT_COLORS[accentColor];

  return (
    <View className="flex-col items-start gap-y-6">
      <Animated.View
        className="w-full"
        entering={FadeInDown.delay(animationDelay).duration(800).springify()}
      >
        <AppText variant="display" className={className}>
          {title}
        </AppText>
      </Animated.View>

      {subtitle && (
        <Animated.View
          className="w-full"
          entering={FadeInDown.delay(animationDelay + 200)
            .duration(800)
            .springify()}
        >
          <AppText variant="display" className={twMerge(accentColorClass)}>
            {subtitle}
          </AppText>
        </Animated.View>
      )}
    </View>
  );
}
