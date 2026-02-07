import { memo } from "react";
import { View } from "react-native";
import { Plus } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { FloatingActionButtonProps } from "@/src/types/Dashboard";

export const FloatingActionButton = memo(function FloatingActionButton({
  onPress,
  hapticFeedback = true,
}: FloatingActionButtonProps) {
  const scale = useSharedValue(1);

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.93, { damping: 15, stiffness: 400 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    })
    .onEnd(() => {
      if (hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPress();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="absolute bottom-10 right-6">
      <GestureDetector gesture={tapGesture}>
        <Animated.View
          style={animatedStyle}
          className="size-14 rounded-full bg-white/5 border border-white/[0.08] items-center justify-center"
        >
          <Plus size={24} color="#ffffff" strokeWidth={2.5} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
});
