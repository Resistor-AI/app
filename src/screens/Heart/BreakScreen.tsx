import { View, Pressable } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";

export default function BreakScreen() {
  const { top } = useSafeAreaInsets();
  const router = useRouter();

  const handleFinishBreak = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/(app)/(protected)"); // Back to Dashboard
  };

  return (
    <View className="flex-1 bg-background px-6 items-center justify-center">
      <StatusBar style="light" />

      <Animated.View entering={FadeIn.duration(1000)} className="items-center">
        <AppText className="text-6xl mb-6">🌿</AppText>
        <AppText variant="h2" className="text-center mb-2">
          Regenerative Break
        </AppText>
        <AppText color="secondary" className="text-center mb-10 px-8">
          Your logical brain is tired. Step away from the screen for 10 minutes.
        </AppText>

        {/* Timer Placeholder */}
        <AppText className="text-8xl font-outfit-bold text-successGreen mb-12">
          10:00
        </AppText>

        <Pressable
          onPress={handleFinishBreak}
          className="bg-white/10 px-8 py-4 rounded-full active:bg-white/20"
        >
          <AppText className="font-bold">I'm ready to focus</AppText>
        </Pressable>
      </Animated.View>
    </View>
  );
}
