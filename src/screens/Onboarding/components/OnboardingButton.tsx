import { Pressable, PressableProps, View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { twMerge } from "tailwind-merge";
import * as Haptics from "expo-haptics";
import { AppText } from "@/src/components/atoms/text";

type ButtonVariant = "blue" | "amber" | "green" | "purple";

const VARIANT_COLORS: Record<ButtonVariant, { bg: string; text: string }> = {
  blue: { bg: "#0A84FF", text: "text-textPrimary" }, // electricBlue
  amber: { bg: "#F59E0B", text: "text-background" }, // amber
  green: { bg: "#30D158", text: "text-background" }, // successGreen
  purple: { bg: "#5E5CE6", text: "text-textPrimary" }, // deepPurple
};

export interface OnboardingButtonProps extends PressableProps {
  /** Button text */
  label: string;
  /** Color variant */
  variant?: ButtonVariant;
  /** Show arrow indicator */
  showArrow?: boolean;
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
  const { bg, text } = VARIANT_COLORS[variant];
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePress = async (e: any) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.(e);
  };

  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: 100 });
    opacity.value = withTiming(0.8, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 200 });
    opacity.value = withTiming(1, { duration: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...rest}
    >
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: bg, marginTop: 32 },
          animatedStyle,
          // Allow overriding via style prop (e.g. for removing margin)
          rest.style as any,
        ]}
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
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 9999, // full
    gap: 12, // gap-3 (3 * 4 = 12px)
  },
});
