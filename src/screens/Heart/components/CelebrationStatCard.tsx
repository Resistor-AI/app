import { View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { CelebrationStatCardProps } from "@/src/types/Focus/SessionComplete";

export function CelebrationStatCard({
  emoji,
  value,
  label,
  delay,
}: CelebrationStatCardProps) {
  return (
    <Animated.View
      entering={FadeIn.delay(delay).duration(400)}
      className="flex-1 items-center rounded-2xl bg-zinc-900/80 border border-white/[0.06] py-5 px-3"
    >
      <View className="size-14 rounded-2xl items-center justify-center mb-3 bg-white/[0.06]">
        <AppText className="text-3xl">{emoji}</AppText>
      </View>
      <AppText variant="h4" className="text-white font-bold">
        {value}
      </AppText>
      <AppText variant="caption" color="tertiary" className="mt-1">
        {label}
      </AppText>
    </Animated.View>
  );
}
