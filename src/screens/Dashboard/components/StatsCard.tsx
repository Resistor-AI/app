import { View, Image } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import {
  Shield,
  ArrowUpRight,
  Lock,
  Flame,
  XCircle,
} from "lucide-react-native";
import { useAppIcon } from "@/src/hooks/useInstalledApps";

import { StatsCardProps } from "@/src/types/Dashboard";

interface ExtendedStatsProps extends StatsCardProps {
  realBlockedCount: number;
  blockedApps: string[];
  distractionsBlocked?: number;
}

const BlockedAppIcon = ({
  packageName,
  index,
}: {
  packageName: string;
  index: number;
}) => {
  const { data: icon } = useAppIcon(packageName);

  if (!icon) return null;

  return (
    <View
      className={`size-5 rounded-full border border-[#18181b] overflow-hidden bg-zinc-800 items-center justify-center ${index > 0 ? "-ml-2" : ""}`}
      style={{ zIndex: 5 - index }}
    >
      <Image
        source={{ uri: `data:image/png;base64,${icon}` }}
        className="w-full h-full"
        resizeMode="contain"
      />
    </View>
  );
};

export function StatsCard({
  user,
  realBlockedCount,
  blockedApps,
  distractionsBlocked = 14,
}: ExtendedStatsProps) {
  const [focusHours, focusMinutes] = user.focusSaved.split(" ");
  // Reduce to 3 icons max
  const displayApps = blockedApps.slice(0, 3);

  return (
    <View className="px-5 mb-6">
      <View className="bg-zinc-900/60 border border-white/10 rounded-[32px] p-5 backdrop-blur-xl shadow-2xl overflow-hidden relative">
        <View className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        {/* --- TOP: FOCUS SAVED --- */}
        <View className="mb-4 border-b border-white/5 pb-3">
          <View className="flex-row justify-between items-center mb-1">
            <View className="flex-row items-center gap-2">
              <View className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/10">
                <Shield size={12} color="#34d399" />
              </View>
              <AppText className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                Focus Saved
              </AppText>
            </View>
            <View className="flex-row items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full">
              <ArrowUpRight size={10} color="#34d399" />
              <AppText className="text-emerald-400 text-[10px] font-bold">
                Top 5%
              </AppText>
            </View>
          </View>

          <View className="mt-2">
            <AppText className="text-5xl text-white font-sans font-semibold tracking-tighter">
              {focusHours.replace("h", "")}
              <AppText className="text-3xl text-zinc-500">h </AppText>
              {focusMinutes.replace("m", "")}
              <AppText className="text-3xl text-zinc-500">m</AppText>
            </AppText>
          </View>
        </View>

        {/* --- BOTTOM: REFINED 3-COLUMN LAYOUT --- */}
        <View className="flex-row items-center">
          {/* 1. LEFT: PROTECTED */}
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
              {/* Icons Row */}
              <View className="flex-row items-center">
                {displayApps.map((pkg, index) => (
                  <BlockedAppIcon key={pkg} packageName={pkg} index={index} />
                ))}
              </View>
            </View>
          </View>

          {/* DIVIDER 1 */}
          <View className="w-[1px] h-full bg-white/10 mx-3" />

          {/* 2. CENTER: BLOCKED */}
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
              <AppText className="text-zinc-500 text-sm font-medium ml-0.5">
                x
              </AppText>
            </View>
          </View>

          {/* DIVIDER 2 */}
          <View className="w-[1px] h-full bg-white/10 mx-3" />

          {/* 3. RIGHT: STREAK */}
          <View className="flex-1 items-start">
            <View className="flex-row items-center gap-1.5 mb-1">
              <Flame size={12} color="#fbbf24" fill="#fbbf24" />
              <AppText className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider">
                Streak
              </AppText>
            </View>
            <View className="flex-row items-baseline h-8">
              <AppText className="text-2xl text-white font-semibold tracking-tight">
                {user.streak}
              </AppText>
              <AppText className="text-zinc-500 text-sm font-medium ml-1">
                Days
              </AppText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
