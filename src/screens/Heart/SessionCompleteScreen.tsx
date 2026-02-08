import { useEffect } from "react";
import { View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeIn, FadeInUp, ZoomIn, useAnimatedStyle,
  useSharedValue, withRepeat, withSequence, withTiming, Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/atoms/text";
import { OnboardingButton } from "@/src/screens/Onboarding/components/OnboardingButton";
import { CelebrationStatCard } from "./components/CelebrationStatCard";
import { ScheduleFeedbackCard } from "./components/ScheduleFeedbackCard";
import { useSessionHistoryStore } from "@/src/store/sessionHistoryStore";
import { SessionCompleteParams } from "@/src/types/Focus/SessionComplete";

export default function SessionCompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams() as Partial<SessionCompleteParams>;
  const stats = useSessionHistoryStore((s) => s.getStats)();
  const breathe = useSharedValue(1);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    breathe.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ), -1, true,
    );
  }, []);

  const breatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathe.value }],
  }));

  const duration = params.durationMinutes || "0";
  const blocked = params.distractionsBlocked || "0";

  return (
    <View className="flex-1 bg-background pt-14">
      <StatusBar style="light" />
      <View className="flex-1 px-7 pb-10 justify-between mt-6">
        <View className="flex-1 justify-center items-center">
          <Animated.View entering={ZoomIn.delay(200).duration(600)} style={{ marginBottom: 32 }}>
            <Animated.View
              style={[breatheStyle, {
                width: 120, height: 120, borderRadius: 60,
                backgroundColor: "#ffffff",
                alignItems: "center", justifyContent: "center",
              }]}
            >
              <Ionicons name="checkmark-sharp" size={52} color="#000" />
            </Animated.View>
          </Animated.View>

          <HeaderText duration={duration} taskName={params.taskName} />
          <StatsGrid duration={duration} stats={stats} blocked={blocked} />
          <ScheduleFeedbackCard traceId={params.traceId || null} />
        </View>
        <Animated.View entering={FadeInUp.delay(1700).duration(600).springify()}>
          <OnboardingButton label="Done" variant="white" onPress={() => router.replace("/(app)/(protected)")} />
        </Animated.View>
      </View>
    </View>
  );
}

function HeaderText({ duration, taskName }: { duration: string; taskName?: string }) {
  return (
    <>
      <Animated.View entering={FadeIn.delay(500).duration(800)}>
        <AppText variant="display" center className="text-white">You Did It.</AppText>
      </Animated.View>
      <Animated.View entering={FadeIn.delay(700).duration(800)}>
        <AppText variant="display" center className="text-white/60">{duration}m Locked In.</AppText>
      </Animated.View>
      <Animated.View entering={FadeIn.delay(1000).duration(600)}>
        <AppText variant="h5" color="secondary" center className="mt-4">
          {taskName || "Deep Work Session"}
        </AppText>
      </Animated.View>
    </>
  );
}

function StatsGrid({ duration, stats, blocked }: {
  duration: string;
  stats: { streak: number; sessionsToday: number };
  blocked: string;
}) {
  return (
    <Animated.View entering={FadeIn.delay(1200).duration(500)} className="w-full mt-10 gap-3">
      <View className="flex-row gap-3">
        <CelebrationStatCard emoji="⏱️" value={`${duration}m`} label="Duration" delay={1300} />
        <CelebrationStatCard emoji="🔥" value={`${stats.streak}d`} label="Streak" delay={1400} />
      </View>
      <View className="flex-row gap-3">
        <CelebrationStatCard emoji="🎯" value={String(stats.sessionsToday)} label="Sessions Today" delay={1500} />
        <CelebrationStatCard emoji="🛡️" value={blocked} label="Blocked" delay={1600} />
      </View>
    </Animated.View>
  );
}
