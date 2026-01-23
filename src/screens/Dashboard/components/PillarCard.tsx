import React from "react";
import { Pressable, View } from "react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { AppText } from "@/src/components/atoms/text";
import { COLORS } from "@/src/constants";
import Animated, { FadeInUp } from "react-native-reanimated";

interface PillarCardProps {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  delay?: number;
  onPress?: () => void;
}

export const PillarCard = ({
  icon,
  title,
  subtitle,
  color,
  delay = 0,
  onPress,
}: PillarCardProps) => {
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(600).springify()}
      className="w-[48%] mb-4"
    >
      <Pressable onPress={handlePress}>
        <BlurView
          intensity={40}
          tint="dark"
          className="rounded-3xl overflow-hidden border border-white/10 p-5"
          style={{ height: 160, justifyContent: "space-between" }}
        >
          <View
            className="size-12 rounded-2xl items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <AppText className="text-2xl">{icon}</AppText>
          </View>

          <View>
            <AppText variant="h5" className="mb-1">
              {title}
            </AppText>
            <AppText variant="caption" color="secondary">
              {subtitle}
            </AppText>
          </View>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
};
