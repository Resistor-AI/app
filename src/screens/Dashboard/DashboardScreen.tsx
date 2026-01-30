import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { USER, PAST_SESSIONS } from "@/src/data/DashboardScreen";
import {
  DashboardHeader,
  StatsCard,
  PriorityQueue,
  PastSessionsList,
} from "./components";

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-black">
      {/* Background: Subtle Ambient Glow */}
      <View className="absolute top-[5%] left-[10%] right-[10%] h-[400px] bg-blue-900/10 rounded-full blur-[100px]" />

      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 20, 100) }}
          showsVerticalScrollIndicator={false}
        >
          {/* ==================================================================================== */}
          {/* 1. HEADER: Professional Greeting                                                     */}
          {/* ==================================================================================== */}
          <DashboardHeader />

          {/* ================================================================================== */}
          {/* 2. THE UNIFIED STATS CARD (Streak is Obvious)                                      */}
          {/* ================================================================================== */}
          <StatsCard user={USER} />

          {/* ==================================================================================== */}
          {/* 3. PRIORITY QUEUE (Refined Active Card)                                              */}
          {/* ==================================================================================== */}
          <PriorityQueue />

          {/* ==================================================================================== */}
          {/* 4. PAST RECORDS (History List)                                                       */}
          {/* ==================================================================================== */}
          <PastSessionsList sessions={PAST_SESSIONS} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
