import { memo } from "react";
import { View } from "react-native";
import { BlurView } from "expo-blur";
import { ChevronRight } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import { DurationDisplayProps } from "@/src/types/Focus";

export const DurationDisplay = memo(function DurationDisplay({
  durationText,
  startTimeDisplay,
  endTimeDisplay,
}: DurationDisplayProps) {
  return (
    <View className="overflow-hidden rounded-3xl border border-white/10">
      <BlurView
        intensity={30}
        tint="dark"
        style={{ padding: 24, alignItems: "center" }}
      >
        <AppText
          variant="label"
          color="secondary"
          content="Focus Duration"
          center
          className="uppercase tracking-widest mb-3"
        />

        <View className="bg-gradient-to-b from-white/10 to-transparent rounded-2xl px-8 py-4 mb-5">
          <AppText variant="display" content={durationText} />
        </View>

        <View className="flex-row items-center">
          <View className="bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
            <AppText variant="h5" content={startTimeDisplay} />
          </View>

          <View className="mx-3 flex-row items-center">
            <View className="w-6 h-px bg-zinc-700" />
            <View className="bg-electricBlue/20 rounded-full p-1.5 mx-1">
              <ChevronRight size={14} color="#3b82f6" />
            </View>
            <View className="w-6 h-px bg-zinc-700" />
          </View>

          <View className="bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
            <AppText variant="h5" content={endTimeDisplay} />
          </View>
        </View>
      </BlurView>
    </View>
  );
});
