import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, {
  FadeInDown, FadeOutUp, useAnimatedStyle, useSharedValue, withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { AppText } from "@/src/components/atoms/text";
import { MILESTONES } from "@/src/lib/focus/milestones";
import { MilestoneData } from "@/src/types/Focus";

export function MilestoneCard({ progress }: { progress: number }) {
  const [activeMilestone, setActiveMilestone] = useState<MilestoneData | null>(null);
  const [shownMilestones, setShownMilestones] = useState<Set<number>>(new Set());
  const scale = useSharedValue(1);

  useEffect(() => {
    for (const milestone of MILESTONES) {
      if (progress >= milestone.threshold && !shownMilestones.has(milestone.threshold)) {
        setShownMilestones((prev) => new Set([...prev, milestone.threshold]));
        setActiveMilestone(milestone);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        scale.value = withSpring(1.05, { damping: 10, stiffness: 150 });
        setTimeout(() => { scale.value = withSpring(1, { damping: 10, stiffness: 150 }); }, 200);
        setTimeout(() => { setActiveMilestone(null); }, 4000);
        break;
      }
    }
  }, [progress, shownMilestones]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  if (!activeMilestone) return null;

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(15).stiffness(150)}
      exiting={FadeOutUp.duration(300)} style={animatedStyle} className="mx-6"
    >
      <View
        className="rounded-2xl px-5 py-4 flex-row items-center gap-4"
        style={{ backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}
      >
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <AppText className="text-2xl">{activeMilestone.emoji}</AppText>
        </View>
        <View className="flex-1">
          <AppText variant="h5" className="mb-0.5">{activeMilestone.title}</AppText>
          <AppText variant="body-sm" color="secondary">{activeMilestone.message}</AppText>
        </View>
      </View>
    </Animated.View>
  );
}
