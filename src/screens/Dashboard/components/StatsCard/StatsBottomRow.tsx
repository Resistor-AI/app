import { View } from "react-native";
import { memo } from "react";
import Animated from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { Lock, XCircle, Flame } from "lucide-react-native";
import { StatsBottomRowProps } from "@/src/types/Dashboard/StatsCard";
import { BlockedAppIcon } from "./BlockedAppIcon";

export const StatsBottomRow = memo(function StatsBottomRow({
  realBlockedCount, displayApps, distractionsBlocked, streak, animatedStyle,
}: StatsBottomRowProps) {
  return (
    <Animated.View style={animatedStyle} className="flex-row items-center">
      <View className="flex-1 items-start">
        <View className="flex-row items-center gap-1.5 mb-1">
          <Lock size={12} color="#60a5fa" />
          <AppText className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider">
            Protected
          </AppText>
        </View>
        <View className="flex-row items-center h-8">
          <AppText className="text-2xl text-white font-semibold tracking-tight mr-2">
            {realBlockedCount}
          </AppText>
          <View className="flex-row items-center">
            {displayApps.map((pkg, index) => (
              <BlockedAppIcon key={pkg} packageName={pkg} index={index} />
            ))}
          </View>
        </View>
      </View>

      <View className="w-[1px] h-full bg-white/10 mx-3" />

      <View className="flex-1 items-start">
        <View className="flex-row items-center gap-1.5 mb-1">
          <XCircle size={12} color="#f59e0b" />
          <AppText className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider">
            Blocked
          </AppText>
        </View>
        <View className="flex-row items-baseline h-8">
          <AppText className="text-2xl text-white font-semibold tracking-tight">
            {distractionsBlocked}
          </AppText>
          <AppText className="text-zinc-500 text-sm font-medium ml-0.5">x</AppText>
        </View>
      </View>

      <View className="w-[1px] h-full bg-white/10 mx-3" />

      <View className="flex-1 items-start">
        <View className="flex-row items-center gap-1.5 mb-1">
          <Flame size={12} color="#fbbf24" fill="#fbbf24" />
          <AppText className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider">
            Streak
          </AppText>
        </View>
        <View className="flex-row items-baseline h-8">
          <AppText className="text-2xl text-white font-semibold tracking-tight">
            {streak}
          </AppText>
          <AppText className="text-zinc-500 text-sm font-medium ml-1">Days</AppText>
        </View>
      </View>
    </Animated.View>
  );
});
