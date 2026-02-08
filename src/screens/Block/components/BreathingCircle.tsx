import { useEffect, useState, useRef } from "react";
import { View } from "react-native";
import Animated, { FadeOut, FadeIn } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { AppText } from "@/src/components/atoms/text";
import { COLORS } from "@/src/constants/colors";
import { BreathingCircleProps } from "@/src/types/Block/friction";

const RING_SIZE = 130;
const STROKE = 5;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const PROMPTS = [
  "Is this worth breaking your flow?",
  "You chose to focus for a reason.",
  "What would future you decide?",
  "Your focus is your superpower.",
  "One distraction leads to many.",
];

export function BreathingCircle({ durationSeconds, onComplete }: BreathingCircleProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [promptIndex, setPromptIndex] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setPromptIndex((i) => (i + 1) % PROMPTS.length), 3500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1 && !completedRef.current) {
          completedRef.current = true;
          setTimeout(onComplete, 0);
        }
        return Math.max(s - 1, 0);
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [durationSeconds, onComplete]);

  const progress = 1 - secondsLeft / durationSeconds;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <Animated.View exiting={FadeOut.duration(300)} className="items-center">
      <View style={{ width: RING_SIZE, height: RING_SIZE }} className="items-center justify-center mb-6">
        <Svg width={RING_SIZE} height={RING_SIZE} className="absolute" style={{ transform: [{ rotate: "-90deg" }] }}>
          <Circle
            cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS}
            stroke="rgba(255,255,255,0.06)" strokeWidth={STROKE} fill="transparent"
          />
          <Circle
            cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS}
            stroke={COLORS.deepPurple} strokeWidth={STROKE} fill="transparent"
            strokeDasharray={CIRCUMFERENCE} strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </Svg>
        <AppText variant="display" className="text-white" style={{ fontVariant: ["tabular-nums"] }}>
          {secondsLeft}
        </AppText>
      </View>

      <Animated.View key={promptIndex} entering={FadeIn.duration(400)} className="h-12 justify-center">
        <AppText variant="h5" color="secondary" className="text-center px-4">
          {PROMPTS[promptIndex]}
        </AppText>
      </Animated.View>
      <AppText variant="body-sm" color="tertiary" className="mt-1">
        Take a moment to reflect
      </AppText>
    </Animated.View>
  );
}
