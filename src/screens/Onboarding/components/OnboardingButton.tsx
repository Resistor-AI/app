import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { twMerge } from "tailwind-merge";
import * as Haptics from "expo-haptics";
import { AppText } from "@/src/components/atoms/text";
import { OnboardingButtonProps, VARIANT_COLORS } from "@/src/types/Onboarding/components";

/**
 * OnboardingButton - Primary CTA button for onboarding screens
 */
export function OnboardingButton({
  label,
  variant = "white",
  showArrow = true,
  leftIcon,
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
        {leftIcon}
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
