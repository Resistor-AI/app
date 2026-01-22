import { View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { twMerge } from "tailwind-merge";

type AccentColor =
  | "textPrimary"
  | "electricBlue"
  | "amber-400"
  | "successGreen"
  | "deepPurple"
  | "neonRed";

export interface OnboardingHeaderProps {
  /** First line of header (primary color) */
  title: string;
  /** Second line of header (accent color) */
  subtitle?: string;
  /** Color for subtitle - uses Tailwind config colors */
  accentColor?: AccentColor;
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
  const accentColorClass = `text-${accentColor}`;

  return (
    <View className="gap-4">
      <Animated.View
        entering={FadeInDown.delay(animationDelay).duration(800).springify()}
      >
        <AppText
          variant="display"
          className={twMerge("leading-tight tracking-widest", className)}
        >
          {title}
        </AppText>
      </Animated.View>

      {subtitle && (
        <Animated.View
          entering={FadeInDown.delay(animationDelay + 200)
            .duration(800)
            .springify()}
        >
          <AppText
            variant="display"
            className={`leading-tight tracking-tighter mt-2 ${accentColorClass}`}
          >
            {subtitle}
          </AppText>
        </Animated.View>
      )}
    </View>
  );
}
