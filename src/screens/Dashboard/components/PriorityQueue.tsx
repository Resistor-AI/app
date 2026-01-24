import React from "react";
import { View } from "react-native";
import { Hourglass } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";

export function PriorityQueue() {
  return (
    <View className="px-6 mb-8">
      <View className="flex-row items-center justify-between mb-4 pl-1">
        <AppText className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
          Priority Queue
        </AppText>
        <View className="flex-row items-center gap-2">
          <View className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          <AppText className="text-green-500 text-[10px] font-bold uppercase">
            Live
          </AppText>
        </View>
      </View>

      <View className="flex-row gap-4">
        {/* --- CARD 1: ACTIVE SESSION (Redesigned) --- */}
        <View className="flex-1 bg-zinc-900 rounded-[28px] p-6 justify-between h-52 border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.05)] relative overflow-hidden">
          {/* Background Glow */}
          <View className="absolute bottom-[-50%] right-[-50%] w-[150px] h-[150px] bg-yellow-500/10 rounded-full blur-[50px]" />

          {/* Top: Tag + Pulse */}
          <View className="flex-row justify-between items-center">
            <View className="bg-yellow-500/10 px-2.5 py-1.5 rounded-lg border border-yellow-500/10">
              <AppText className="text-yellow-500 text-[9px] font-black uppercase tracking-wider">
                Deep Work
              </AppText>
            </View>
            <View className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
          </View>

          {/* Middle: Content (Title Top-Left) */}
          <View>
            <AppText className="text-white text-2xl font-bold leading-7 tracking-tight mb-1">
              Research{"\n"}& Flow
            </AppText>
            <AppText className="text-zinc-500 text-xs font-medium">
              UX Analysis
            </AppText>
          </View>

          {/* Bottom: Timer (Aligned Bottom-Right for balance) */}
          <View className="flex-row justify-between items-end">
            <AppText className="text-zinc-600 text-[10px] font-bold uppercase mb-1.5">
              Time Left
            </AppText>
            <AppText
              className="text-3xl text-white font-bold tracking-tighter"
              style={{ fontVariant: ["tabular-nums"] }}
            >
              24:15
            </AppText>
          </View>

          {/* Bottom Progress Line */}
          <View className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800">
            <View className="w-[45%] h-full bg-yellow-500" />
          </View>
        </View>

        {/* --- CARD 2: NEXT UP (Blue) --- */}
        <View className="flex-1 bg-zinc-900 rounded-[28px] p-6 justify-between h-52 border border-zinc-800/80 opacity-60">
          {/* Top: Tag + Count */}
          <View className="flex-row justify-between items-center">
            <View className="bg-blue-500/10 px-2.5 py-1.5 rounded-lg border border-blue-500/10">
              <AppText className="text-blue-500 text-[9px] font-black uppercase tracking-wider">
                Design
              </AppText>
            </View>
            <AppText className="text-zinc-500 text-[10px] font-bold">
              2/4
            </AppText>
          </View>

          {/* Middle: Content */}
          <View>
            <AppText className="text-white text-xl font-bold leading-7 tracking-tight mb-1">
              Website{"\n"}& Branding
            </AppText>
            <AppText className="text-zinc-500 text-xs font-medium">
              Zeda Project
            </AppText>
          </View>

          {/* Bottom: Duration */}
          <View className="flex-row items-center gap-2">
            <Hourglass size={14} color="#71717a" />
            <AppText className="text-zinc-400 text-sm font-bold">
              45 min
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
}
