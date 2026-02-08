import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

import { AppText } from "@/src/components/atoms/text";
import { RollingTextProps } from "@/src/types/Auth/components";
import { ROLLING_WORDS } from "@/src/constants/data";

const CYCLE_DURATION = 2000; // ms per word

export function RollingText({
  words = ROLLING_WORDS as unknown as string[],
  prefix = "Reclaim Your",
  accentColor = "#0A84FF",
}: RollingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const nextWord = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Animate out
      translateY.value = withTiming(-30, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
      opacity.value = withTiming(0, { duration: 300 }, (finished) => {
        if (finished) {
          runOnJS(nextWord)();
        }
      });
    }, CYCLE_DURATION);

    return () => clearInterval(interval);
  }, []);

  // Animate in when word changes
  useEffect(() => {
    // Reset immediately
    translateY.value = 30;
    opacity.value = 0;

    // Animate to visible
    translateY.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
    opacity.value = withTiming(1, { duration: 300 });
  }, [currentIndex]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <View>
      <AppText variant="display" className="text-textPrimary -mb-4">
        {prefix}
      </AppText>

      <Animated.View style={animatedStyle}>
        <AppText variant="display" style={{ color: accentColor }}>
          {words[currentIndex]}.
        </AppText>
      </Animated.View>
    </View>
  );
}
