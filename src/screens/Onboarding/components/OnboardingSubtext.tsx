import { AppText } from "@/src/components/atoms/text";
import Animated, { FadeIn } from "react-native-reanimated";

export interface OnboardingSubtextProps {
  /** Main description text */
  children: string;
  /** Optional emphasized follow-up line */
  emphasis?: string;
  /** Animation delay offset in ms */
  animationDelay?: number;
}

/**
 * OnboardingSubtext - Secondary text with optional emphasis for onboarding screens
 */
export function OnboardingSubtext({
  children,
  emphasis,
  animationDelay = 600,
}: OnboardingSubtextProps) {
  return (
    <>
      <Animated.View entering={FadeIn.delay(animationDelay).duration(600)}>
        <AppText
          variant="body-lg"
          color="secondary"
          className="leading-relaxed"
        >
          {children}
        </AppText>
      </Animated.View>

      {emphasis && (
        <Animated.View
          entering={FadeIn.delay(animationDelay + 200).duration(600)}
        >
          <AppText variant="h5" className="mt-4 leading-relaxed">
            {emphasis}
          </AppText>
        </Animated.View>
      )}
    </>
  );
}
