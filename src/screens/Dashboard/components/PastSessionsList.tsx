import React from "react";
import { View, TouchableOpacity } from "react-native";
import { CheckCircle2, Shield } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";

import { PastSessionsListProps } from "@/src/types/DashboardScreen";

export function PastSessionsList({ sessions }: PastSessionsListProps) {
  return (
    <View className="px-6">
      <View className="flex-row justify-between items-end mb-4 pl-1">
        <AppText className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
          Past Sessions
        </AppText>
        <TouchableOpacity>
          <AppText className="text-blue-500 text-xs font-medium">
            View All
          </AppText>
        </TouchableOpacity>
      </View>

      {sessions.map((session) => (
        <View
          key={session.id}
          className="w-full bg-zinc-900 border border-zinc-800/50 p-4 rounded-2xl mb-3 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-4">
            <View className="h-10 w-10 rounded-full bg-zinc-800 items-center justify-center border border-zinc-700/50">
              <CheckCircle2 size={16} color="#71717a" />
            </View>

            <View>
              <AppText className="text-zinc-200 font-semibold text-sm tracking-tight">
                {session.title}
              </AppText>
              <View className="flex-row items-center gap-3 mt-0.5">
                <AppText className="text-zinc-500 text-[10px] font-medium">
                  {session.date}
                </AppText>
                <View className="flex-row items-center gap-1">
                  <Shield size={10} color="#10b981" />
                  <AppText className="text-emerald-500 text-[10px] font-bold">
                    +{session.saved}
                  </AppText>
                </View>
              </View>
            </View>
          </View>

          <View className="bg-zinc-800/50 px-3 py-1.5 rounded-md">
            <AppText className="text-zinc-400 text-xs font-mono">
              {session.focus}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );
}
