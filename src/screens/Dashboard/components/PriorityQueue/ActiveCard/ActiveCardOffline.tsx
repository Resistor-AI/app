import { View } from "react-native";
import { memo } from "react";
import Animated from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { Target } from "lucide-react-native";
import { ActiveCardOfflineProps } from "@/src/types/Dashboard/ActiveCard";

export const ActiveCardOffline = memo(function ActiveCardOffline({
  entryStyle,
}: ActiveCardOfflineProps) {
  return (
    <Animated.View
      style={[entryStyle]}
      className="mr-4 w-[200px] bg-zinc-900/90 rounded-3xl p-5 h-48 border border-zinc-800 justify-center items-center"
    >
      <View className="w-12 h-12 rounded-full bg-zinc-800 items-center justify-center mb-3">
        <Target size={20} color="#52525b" />
      </View>
      <AppText className="text-zinc-500 text-sm font-semibold mb-1">
        No Active Session
      </AppText>
      <AppText className="text-zinc-600 text-xs text-center">
        Tap + to start focusing
      </AppText>
    </Animated.View>
  );
});
