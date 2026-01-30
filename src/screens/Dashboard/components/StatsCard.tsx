import React from "react";
import { View } from "react-native";
import { Shield, ArrowUpRight, Smartphone, Flame } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";

import { StatsCardProps } from "@/src/types/Dashboard";

export function StatsCard({ user }: StatsCardProps) {
  const [focusHours, focusMinutes] = user.focusSaved.split(" ");

  return (
    <View className="px-6 mb-10">
      <View className="bg-zinc-900/60 border border-white/10 rounded-[32px] p-5 backdrop-blur-xl shadow-2xl overflow-hidden relative">
        <View className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        {/* --- TOP: FOCUS SAVED --- */}
        <View className="mb-5 border-b border-white/5 pb-5">
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
            <AppText className="text-5xl text-white font-bold tracking-tighter">
              {focusHours.replace("h", "")}
              <AppText className="text-3xl text-zinc-500">h </AppText>
              {focusMinutes.replace("m", "")}
              <AppText className="text-3xl text-zinc-500">m</AppText>
            </AppText>
          </View>
        </View>

        {/* --- BOTTOM: SPLIT METRICS --- */}
        <View className="flex-row justify-between items-center">
          {/* Left: Screen Time */}
          <View className="flex-1 border-r border-white/5 pr-4">
            <View className="flex-row items-center gap-2 mb-1">
              <Smartphone size={12} color="#60a5fa" />
              <AppText className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                Screen Time
              </AppText>
            </View>
            <AppText className="text-2xl text-white font-bold tracking-tight">
              {user.screenTime}
            </AppText>
          </View>

          {/* Right: Streak (Obvious & Glowing) */}
          <View className="flex-1 pl-5 flex-row items-center gap-3">
            <View className="h-10 w-10 bg-orange-500/20 rounded-full items-center justify-center border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              <Flame size={20} color="#fbbf24" fill="#fbbf24" />
            </View>
            <View>
              <AppText className="text-2xl text-white font-bold">
                {user.streak}
              </AppText>
              <AppText className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider">
                Days
              </AppText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
