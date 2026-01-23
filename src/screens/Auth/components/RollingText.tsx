import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

import {} from "react-native-worklets";
import { AppText } from "@/src/components/atoms/text";

const WORDS = ["Focus", "Energy", "Life", "Brain", "Work"];
const CYCLE_DURATION = 2000; // ms per word

interface RollingTextProps {
  prefix?: string;
  words?: string[];
  accentColor?: string;
}

export function RollingText({
  words = WORDS,
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
      opacity.value = withTiming(0, { duration: 300 });

      // Switch word and animate in
      setTimeout(() => {
        runOnJS(nextWord)();
        translateY.value = 30;
        opacity.value = 0;

        setTimeout(() => {
          translateY.value = withTiming(0, {
            duration: 300,
            easing: Easing.out(Easing.ease),
          });
          opacity.value = withTiming(1, { duration: 300 });
        }, 50);
      }, 300);
    }, CYCLE_DURATION);

    return () => clearInterval(interval);
  }, []);

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
