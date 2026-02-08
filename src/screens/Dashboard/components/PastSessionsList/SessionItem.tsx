import { memo } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { CheckCircle2, Shield } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import { useListItemAnimation } from "@/src/hooks/animations/useListItemAnimation";
import { Session } from "@/src/types/Dashboard";

export const LIST_ID = "past-sessions-list";

export const SessionItem = memo(function SessionItem({ item }: { item: Session }) {
  const { animatedStyle } = useListItemAnimation({
    listId: LIST_ID, itemId: item.id, type: "fadeSlide", duration: 250,
  });

  return (
    <Animated.View style={animatedStyle} className="px-6 mb-3">
      <View className="w-full bg-zinc-900 border border-zinc-800/50 p-4 rounded-2xl flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          <View className="h-10 w-10 rounded-full bg-zinc-800 items-center justify-center border border-zinc-700/50">
            <CheckCircle2 size={16} color="#71717a" />
          </View>
          <View>
            <AppText className="text-zinc-200 font-semibold text-sm tracking-tight">
              {item.title}
            </AppText>
            <View className="flex-row items-center gap-3 mt-0.5">
              <AppText className="text-zinc-500 text-[10px] font-medium">{item.date}</AppText>
              <View className="flex-row items-center gap-1">
                <Shield size={10} color="#10b981" />
                <AppText className="text-emerald-500 text-[10px] font-bold">+{item.saved}</AppText>
              </View>
            </View>
          </View>
        </View>
        <View className="bg-zinc-800/50 px-3 py-1.5 rounded-md">
          <AppText className="text-zinc-400 text-xs font-mono">{item.focus}</AppText>
        </View>
      </View>
    </Animated.View>
  );
});
