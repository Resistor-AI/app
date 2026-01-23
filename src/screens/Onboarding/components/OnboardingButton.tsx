import { Pressable, PressableProps } from "react-native";
import Animated from "react-native-reanimated";
import { twMerge } from "tailwind-merge";
import * as Haptics from "expo-haptics";
import { AppText } from "@/src/components/atoms/text";
import { cssInterop } from "react-native-css-interop";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

cssInterop(AnimatedPressable, {
  className: "style",
});

type ButtonVariant = "blue" | "amber" | "green" | "purple";

const variantClasses: Record<ButtonVariant, { bg: string; text: string }> = {
  blue: { bg: "bg-electricBlue", text: "text-textPrimary" },
  amber: { bg: "bg-amber", text: "text-background" },
  green: { bg: "bg-successGreen", text: "text-background" },
  purple: { bg: "bg-deepPurple", text: "text-textPrimary" },
};

export interface OnboardingButtonProps extends Omit<PressableProps, "style"> {
  /** Button text */
  label: string;
  /** Color variant */
  variant?: ButtonVariant;
  /** Show arrow indicator */
  showArrow?: boolean;
  /** Optional className overrides */
  className?: string;
}

/**
 * OnboardingButton - Primary CTA button for onboarding screens
 */
export function OnboardingButton({
  label,
  variant = "blue",
  showArrow = true,
  className,
  onPress,
  ...rest
}: OnboardingButtonProps) {
  const { bg, text } = variantClasses[variant];

  const handlePress = async (e: any) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.(e);
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      className={twMerge(
        "flex-row items-center justify-center py-5 px-8 rounded-full gap-3 mt-8",
        bg,
        className,
      )}
      {...rest}
    >
      <AppText
        variant="body-lg"
        className={twMerge("font-outfit-semibold", text)}
      >
        {label}
      </AppText>
      {showArrow && (
        <AppText variant="body-lg" className={text}>
          ›››
        </AppText>
      )}
    </AnimatedPressable>
  );
}
