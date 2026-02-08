import { View } from "react-native";
import { BlurView } from "expo-blur";
import { AppText } from "@/src/components/atoms/text";
import { ProgressPillProps } from "@/src/types/Focus/TimerRing";

export function ProgressPill({ progress, theme }: ProgressPillProps) {
  return (
    <View className="items-center mt-6">
      <View
        className="overflow-hidden rounded-full border border-white/10"
      >
        <BlurView intensity={30} tint="dark">
          <View className="px-4 py-2 bg-white/5">
            <AppText
              variant="body"
              className="font-bold tracking-wide"
              style={{ color: theme.primary }}
            >
              {Math.round(progress * 100)}% complete
            </AppText>
          </View>
        </BlurView>
      </View>
    </View>
  );
}
