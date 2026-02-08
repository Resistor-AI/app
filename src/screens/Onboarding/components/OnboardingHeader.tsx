import { View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { twMerge } from "tailwind-merge";
import { OnboardingHeaderProps, ACCENT_COLORS } from "@/src/types/Onboarding/components";

/**
 * OnboardingHeader - Two-line header with accent color for onboarding screens
 */
export function OnboardingHeader({
  title,
  subtitle,
  accentColor = "electricBlue",
  animationDelay = 200,
  className,
  subTitleClassName,
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
          <AppText variant="display" className={twMerge(accentColorClass, subTitleClassName)}>
            {subtitle}
          </AppText>
        </Animated.View>
      )}
    </View>
  );
}
