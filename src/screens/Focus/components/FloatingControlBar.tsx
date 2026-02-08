import { View, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Square } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import { useScalePress } from "@/src/hooks/animations/useScalePress";
import { FloatingControlBarProps } from "@/src/types/Focus/components";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FloatingControlBar({ onEnd }: FloatingControlBarProps) {
  const endPress = useScalePress({ minScale: 0.95 });

  return (
    <AnimatedPressable
      onPress={onEnd}
      onPressIn={endPress.onPressIn}
      onPressOut={endPress.onPressOut}
      style={[
        endPress.animatedStyle,
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
        },
      ]}
      className="overflow-hidden rounded-full self-center"
    >
      <BlurView
        intensity={30}
        tint="dark"
        className="flex-row items-center gap-3 px-7 py-4"
        style={{
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.06)",
          borderRadius: 9999,
        }}
      >
        <View className="size-7 rounded items-center justify-center bg-red-500/15">
          <Square size={14} color="#f87171" fill="#f87171" />
        </View>
        <AppText variant="body" className="text-zinc-400 font-bold tracking-wide">
          End Session
        </AppText>
      </BlurView>
    </AnimatedPressable>
  );
}
