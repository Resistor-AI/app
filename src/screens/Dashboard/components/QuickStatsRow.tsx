import React from "react";
import { View } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import { COLORS } from "@/src/constants";
import Animated, { FadeInUp } from "react-native-reanimated";

interface StatItemProps {
  label: string;
  value: string;
  delay?: number;
}

const StatItem = ({ label, value, delay = 0 }: StatItemProps) => (
  <Animated.View
    entering={FadeInUp.delay(delay).duration(600).springify()}
    className="items-center"
  >
    <AppText variant="h4" className="font-outfit-bold">
      {value}
    </AppText>
    <AppText variant="caption" color="secondary" className="mt-1 lowercase">
      {label}
    </AppText>
  </Animated.View>
);

export const QuickStatsRow = () => {
  return (
    <View className="flex-row justify-around items-center py-6 border-t border-white/5 mt-4">
      <StatItem label="Focus Time" value="4.2h" delay={1000} />
      <StatItem label="Tasks" value="12" delay={1100} />
      <StatItem label="Streak" value="8d" delay={1200} />
    </View>
  );
};
