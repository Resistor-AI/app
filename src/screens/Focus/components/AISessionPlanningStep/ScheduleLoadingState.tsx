import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  SharedValue,
} from "react-native-reanimated";
import { Sparkles } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";

const THINKING_STEPS = [
  "Reading your brain dump...",
  "Extracting tasks...",
  "Assigning priorities...",
  "Optimizing schedule...",
  "Adding strategic breaks...",
];

export function ScheduleLoadingState() {
  const pulse = useSharedValue(0);
  const stepIndex = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withSequence(withTiming(1, { duration: 1200 }), withTiming(0, { duration: 1200 })), -1);
    stepIndex.value = withRepeat(withSequence(
      ...THINKING_STEPS.map((_, i) => withDelay(i === 0 ? 0 : 200, withTiming(i, { duration: 2000 })))
    ), -1);
  }, []);

  return (
    <Animated.View entering={FadeIn.duration(300)} className="flex-1 justify-center">
      <View className="items-center mb-8">
        <PulsingOrb pulse={pulse} />
      </View>
      <View className="items-center mb-6">
        <AppText variant="h3" content="AI is thinking..." center className="mb-2" />
        <AppText variant="body-sm" color="tertiary" content="Crafting your perfect focus session" center />
      </View>
      <View className="gap-2 px-4">
        {THINKING_STEPS.map((step, i) => (
          <ThinkingStep key={step} label={step} index={i} stepIndex={stepIndex} />
        ))}
      </View>
    </Animated.View>
  );
}

function PulsingOrb({ pulse }: { pulse: SharedValue<number> }) {
  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.15]) }],
    opacity: interpolate(pulse.value, [0, 1], [0.7, 1]),
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.6]) }],
    opacity: interpolate(pulse.value, [0, 1], [0.3, 0]),
  }));

  return (
    <View className="items-center justify-center" style={{ width: 80, height: 80 }}>
      <Animated.View
        style={[glowStyle, { position: "absolute", width: 80, height: 80, borderRadius: 40, backgroundColor: "#ffffff" }]}
      />
      <Animated.View
        style={[orbStyle, { width: 56, height: 56, borderRadius: 28, backgroundColor: "#ffffff", alignItems: "center", justifyContent: "center" }]}
      >
        <Sparkles size={24} color="#000000" fill="#000000" />
      </Animated.View>
    </View>
  );
}

function ThinkingStep({ label, index, stepIndex }: {
  label: string;
  index: number;
  stepIndex: SharedValue<number>;
}) {
  const animStyle = useAnimatedStyle(() => {
    const isActive = stepIndex.value >= index;
    return {
      opacity: withTiming(isActive ? 1 : 0.3, { duration: 400 }),
    };
  });

  return (
    <Animated.View style={animStyle} className="flex-row items-center gap-3 py-1.5">
      <View className="w-1.5 h-1.5 rounded-full bg-white" />
      <AppText variant="body-sm" color="secondary" content={label} />
    </Animated.View>
  );
}
