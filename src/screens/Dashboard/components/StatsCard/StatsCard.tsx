import { View } from "react-native";
import { memo } from "react";
import Animated from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { Shield, Flame } from "lucide-react-native";
import { useStaggeredEntry } from "@/src/hooks/animations/useStaggeredEntry";
import { ExtendedStatsProps } from "@/src/types/Dashboard/StatsCard";
import { StatsBottomRow } from "./StatsBottomRow";

export const StatsCard = memo(function StatsCard({
  user, realBlockedCount, blockedApps, distractionsBlocked = 0,
}: ExtendedStatsProps) {
  const [focusHours, focusMinutes] = user.focusSaved.split(" ");
  const displayApps = blockedApps.slice(0, 3);

  const { animatedStyle: cardStyle } = useStaggeredEntry({
    index: 0, duration: 600, translateY: 20, initialScale: 0.98, useSpring: true, springPreset: "gentle",
  });
  const { animatedStyle: topSectionStyle } = useStaggeredEntry({
    index: 1, staggerDelay: 150, duration: 400, translateY: 10,
  });
  const { animatedStyle: bottomSectionStyle } = useStaggeredEntry({
    index: 2, staggerDelay: 150, duration: 400, translateY: 10,
  });

  return (
    <Animated.View style={cardStyle} className="px-5 mb-6">
      <View className="bg-zinc-900/60 border border-white/10 rounded-[32px] p-5 backdrop-blur-xl shadow-2xl overflow-hidden relative">
        <View className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        <Animated.View style={topSectionStyle} className="mb-4 border-b border-white/5 pb-3">
          <View className="flex-row justify-between items-center mb-1">
            <View className="flex-row items-center gap-2">
              <View className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/10">
                <Shield size={12} color="#34d399" />
              </View>
              <AppText className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                Focus Saved
              </AppText>
            </View>
            {user.streak > 0 && (
              <View className="flex-row items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full">
                <Flame size={10} color="#34d399" />
                <AppText className="text-emerald-400 text-[10px] font-bold">
                  {user.streak}d streak
                </AppText>
              </View>
            )}
          </View>
          <View className="mt-2">
            <AppText className="text-5xl text-white font-sans font-semibold tracking-tighter">
              {focusHours.replace("h", "")}
              <AppText className="text-3xl text-zinc-500">h </AppText>
              {focusMinutes.replace("m", "")}
              <AppText className="text-3xl text-zinc-500">m</AppText>
            </AppText>
          </View>
        </Animated.View>
        <StatsBottomRow
          realBlockedCount={realBlockedCount} displayApps={displayApps}
          distractionsBlocked={distractionsBlocked} streak={user.streak}
          animatedStyle={bottomSectionStyle}
        />
      </View>
    </Animated.View>
  );
});
