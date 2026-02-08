import { useEffect, useState, useMemo, useCallback } from "react";
import { View, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn } from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { useFocusSessionStore } from "@/src/store/focusSessionStore";
import { useSessionComplete } from "@/src/hooks/focus/useSessionComplete";
import { getDistractionCount } from "@/modules/installed-apps";

export default function BreakScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ startTime: string; endTime: string }>();
  const getCurrentBlock = useFocusSessionStore((s) => s.getCurrentBlock);
  const clearActiveSchedule = useFocusSessionStore((s) => s.clearActiveSchedule);
  const { saveSession } = useSessionComplete();

  const sessionStartMs = Number(params.startTime) || Date.now();
  const sessionEndMs = Number(params.endTime) || Date.now() + 5 * 60 * 1000;

  const [tick, setTick] = useState(0);
  const blockInfo = useMemo(() => getCurrentBlock(), [getCurrentBlock, tick]);

  const breakTitle = blockInfo?.block.title || "Take a Break";
  const isRegenerative = blockInfo?.block.type === "regenerative_break";
  const blockEndMs = blockInfo ? new Date(blockInfo.block.endTime).getTime() : Date.now();
  const blockStartMs = blockInfo ? new Date(blockInfo.block.startTime).getTime() : Date.now();
  const blockDurationMs = Math.max(blockEndMs - blockStartMs, 1);
  const blockId = blockInfo?.block.id ?? null;
  const blockIsBreak = blockInfo?.isBreak ?? true;

  const [remainingMs, setRemainingMs] = useState(() => Math.max(blockEndMs - Date.now(), 0));

  // Navigate to focus when block transitions to a task
  useEffect(() => {
    if (!blockId) return;
    if (!blockIsBreak) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace({
        pathname: "/(app)/(protected)/focus",
        params: { startTime: String(sessionStartMs), endTime: String(sessionEndMs) },
      });
    }
  }, [blockId, blockIsBreak, router, sessionStartMs, sessionEndMs]);

  // Handle session end (ref to avoid stale closure)
  const handleSessionEndRef = useCallback(() => {
    const distractions = getDistractionCount();
    const durationMinutes = Math.max(Math.round((sessionEndMs - sessionStartMs) / 60000), 1);
    saveSession({
      taskName: "Focus Session", priority: "normal",
      startTimeMs: sessionStartMs, endTimeMs: sessionEndMs,
      currentBlock: blockInfo?.blockIndex || 1,
      totalBlocks: blockInfo?.totalFocusBlocks || 1,
      wasManualEnd: false,
    });
    clearActiveSchedule();
    router.replace({
      pathname: "/(app)/(protected)/session-complete",
      params: {
        taskName: "Focus Session", durationMinutes: String(durationMinutes),
        distractionsBlocked: String(distractions),
      },
    });
  }, [saveSession, clearActiveSchedule, router, sessionStartMs, sessionEndMs, blockInfo]);

  // Timer interval
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      if (now >= sessionEndMs) {
        clearInterval(interval);
        handleSessionEndRef();
        return;
      }

      setTick((t) => t + 1);
      setRemainingMs(Math.max(blockEndMs - now, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [blockEndMs, sessionEndMs, handleSessionEndRef]);

  const handleSkipBreak = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace({
      pathname: "/(app)/(protected)/focus",
      params: {
        startTime: String(sessionStartMs),
        endTime: String(sessionEndMs),
        skipBreakId: blockId || "",
      },
    });
  }, [router, sessionStartMs, sessionEndMs, blockId]);

  const minutes = Math.floor(remainingMs / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);
  const progress = Math.min(1 - remainingMs / blockDurationMs, 1);

  return (
    <View className="flex-1 bg-black items-center justify-center">
      <StatusBar style="light" />
      <Animated.View entering={FadeIn.duration(800)} className="items-center px-6">
        <AppText className="text-6xl mb-6">{isRegenerative ? "🌿" : "☕"}</AppText>
        <AppText variant="h2" className="text-center mb-2">{breakTitle}</AppText>
        <AppText color="secondary" className="text-center mb-10 px-8">
          {isRegenerative
            ? "Step away from the screen. Move, stretch, breathe."
            : "Quick pause. Rest your eyes, take a sip of water."}
        </AppText>

        <AppText
          className="text-8xl font-outfit-bold text-emerald-400 mb-8"
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </AppText>

        {/* Progress bar */}
        <View className="w-48 h-1 bg-white/10 rounded-full mb-12 overflow-hidden">
          <View
            style={{ width: `${Math.max(progress * 100, 0)}%` }}
            className="h-full bg-emerald-500 rounded-full"
          />
        </View>

        <Pressable
          onPress={handleSkipBreak}
          className="bg-white/10 px-8 py-4 rounded-full active:bg-white/20"
        >
          <AppText className="font-bold">I'm ready to focus</AppText>
        </Pressable>
      </Animated.View>
    </View>
  );
}
