import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { AppText } from "@/src/components/atoms/text";
import { COLORS, PILLARS } from "@/src/constants";
import { FocusScoreCard, PillarCard, QuickStatsRow } from "./components";

export default function DashboardScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();

  // Mock data
  const user = { name: "Alex" };
  const currentScore = 84;

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: top + 20,
          paddingBottom: bottom + 100,
          paddingHorizontal: 24,
        }}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(800)}>
          <View className="flex-row justify-between items-end mb-8">
            <View>
              <AppText variant="h6" color="secondary" className="mb-1">
                {todayStr}
              </AppText>
              <AppText variant="h2">Hey {user.name} 👋</AppText>
            </View>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className="size-12 rounded-2xl bg-surface items-center justify-center border border-white/10"
            >
              <AppText className="text-xl">⚙️</AppText>
            </Pressable>
          </View>
        </Animated.View>

        {/* Hero Score Section */}
        <View className="items-center mb-12">
          <FocusScoreCard score={currentScore} />
        </View>

        {/* Pillar Quick Actions */}
        <View className="flex-row flex-wrap justify-between mt-4">
          {PILLARS.map((pillar, index) => (
            <PillarCard
              key={pillar.title}
              icon={pillar.icon}
              title={pillar.title.replace("The ", "")}
              subtitle={pillar.desc}
              color={pillar.color}
              delay={400 + index * 100}
              onPress={() => {
                // Future navigation
              }}
            />
          ))}
        </View>

        {/* Daily Stats */}
        <QuickStatsRow />
      </ScrollView>
    </View>
  );
}
