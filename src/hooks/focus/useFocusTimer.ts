import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useFocusSessionStore } from "@/src/store/focusSessionStore";
import { useSessionComplete } from "@/src/hooks/focus/useSessionComplete";
import { getDistractionCount } from "@/modules/installed-apps";
import { TaskPriority } from "@/src/types/Focus";

export function useFocusTimer() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const clearActiveSchedule = useFocusSessionStore((s) => s.clearActiveSchedule);
  const traceId = useFocusSessionStore((s) => s.traceId);
  const { saveSession } = useSessionComplete();
  const getCurrentBlock = useFocusSessionStore((s) => s.getCurrentBlock);
  const getUpcomingBlocks = useFocusSessionStore((s) => s.getUpcomingBlocks);

  const sessionStartMs = params.startTime ? Number(params.startTime) : Date.now();
  const sessionEndMs = params.endTime ? Number(params.endTime) : Date.now() + 25 * 60 * 1000;
  const skipBreakId = (params.skipBreakId as string) || null;

  const [tick, setTick] = useState(0);
  const [showFriction, setShowFriction] = useState(false);
  const [isWaitingToStart, setIsWaitingToStart] = useState(() => Date.now() < sessionStartMs);
  const prevBlockIdRef = useRef<string | null>(null);

  const blockInfo = useMemo(() => getCurrentBlock(), [getCurrentBlock, tick]);
  const upcomingBlocks = useMemo(() => getUpcomingBlocks(), [getUpcomingBlocks, tick]);
  const nextBlockName = useMemo(
    () => (upcomingBlocks.length > 0 ? upcomingBlocks[0].block.title : undefined),
    [upcomingBlocks],
  );

  const taskName = blockInfo?.block.title || "Deep Work Session";
  const priority = (blockInfo?.priority || "normal") as TaskPriority;
  const isBreak = blockInfo?.isBreak ?? false;
  const currentBlock = blockInfo?.blockIndex || 1;
  const totalBlocks = blockInfo?.totalFocusBlocks || 1;

  const blockStartMs = blockInfo ? new Date(blockInfo.block.startTime).getTime() : sessionStartMs;
  const blockEndMs = blockInfo ? new Date(blockInfo.block.endTime).getTime() : sessionEndMs;
  const blockDurationMs = blockEndMs - blockStartMs;

  const blockId = blockInfo?.block.id ?? null;
  const blockIsBreak = blockInfo?.isBreak ?? false;

  const [remainingMs, setRemainingMs] = useState(() => {
    const now = Date.now();
    if (now < sessionStartMs) return sessionStartMs - now;
    return Math.max(blockEndMs - now, 0);
  });

  // Navigate to break screen when current block is a break
  useEffect(() => {
    if (!blockId || isWaitingToStart) return;

    // Haptic on any block transition
    if (prevBlockIdRef.current && blockId !== prevBlockIdRef.current) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    prevBlockIdRef.current = blockId;

    // Redirect to break screen (skip if user manually skipped this break)
    if (blockIsBreak && blockId !== skipBreakId) {
      router.replace({
        pathname: "/(app)/(protected)/break",
        params: {
          startTime: String(sessionStartMs),
          endTime: String(sessionEndMs),
        },
      });
    }
  }, [blockId, blockIsBreak, isWaitingToStart, skipBreakId, router, sessionStartMs, sessionEndMs]);

  const handleSessionCompleteRef = useRef<() => void>(() => {});

  const handleSessionComplete = useCallback(() => {
    const distractions = getDistractionCount();
    const durationMinutes = Math.max(Math.round((sessionEndMs - sessionStartMs) / 60000), 1);
    saveSession({
      taskName, priority, startTimeMs: sessionStartMs, endTimeMs: sessionEndMs,
      currentBlock, totalBlocks, wasManualEnd: false,
    });
    clearActiveSchedule();
    router.replace({
      pathname: "/(app)/(protected)/session-complete",
      params: {
        taskName, durationMinutes: String(durationMinutes),
        currentBlock: String(currentBlock), totalBlocks: String(totalBlocks),
        distractionsBlocked: String(distractions),
        ...(traceId ? { traceId } : {}),
      },
    });
  }, [router, clearActiveSchedule, saveSession, taskName, priority, sessionStartMs, sessionEndMs, currentBlock, totalBlocks, traceId]);

  handleSessionCompleteRef.current = handleSessionComplete;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      if (now < sessionStartMs) {
        setIsWaitingToStart(true);
        setRemainingMs(sessionStartMs - now);
        setTick((t) => t + 1);
        return;
      }

      if (isWaitingToStart) {
        setIsWaitingToStart(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Session over: past end time OR all blocks exhausted
      if (now >= sessionEndMs || (!getCurrentBlock() && now >= sessionStartMs)) {
        clearInterval(interval);
        handleSessionCompleteRef.current();
        return;
      }

      setTick((t) => t + 1);

      const blockRemain = blockEndMs - now;
      setRemainingMs(Math.max(blockRemain, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartMs, sessionEndMs, blockEndMs, isWaitingToStart, getCurrentBlock]);

  const minutes = Math.floor(remainingMs / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);
  const progress = isWaitingToStart ? 0 : Math.min(1 - remainingMs / blockDurationMs, 1);

  const handleEndSession = useCallback(() => {
    const distractions = getDistractionCount();
    const actualEndMs = Date.now();
    const durationMinutes = Math.max(Math.round((actualEndMs - sessionStartMs) / 60000), 1);
    saveSession({
      taskName, priority, startTimeMs: sessionStartMs, endTimeMs: sessionEndMs,
      currentBlock, totalBlocks, wasManualEnd: true,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    clearActiveSchedule();
    router.replace({
      pathname: "/(app)/(protected)/session-complete",
      params: {
        taskName, durationMinutes: String(durationMinutes),
        currentBlock: String(currentBlock), totalBlocks: String(totalBlocks),
        distractionsBlocked: String(distractions),
        ...(traceId ? { traceId } : {}),
      },
    });
  }, [router, clearActiveSchedule, saveSession, taskName, priority, sessionStartMs, sessionEndMs, currentBlock, totalBlocks, traceId]);

  const triggerFriction = useCallback(() => {
    setShowFriction(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }, []);

  return {
    minutes, seconds, progress, isBreak, isWaitingToStart, showFriction,
    taskName, priority, currentBlock, totalBlocks, endTimeMs: sessionEndMs, nextBlockName,
    setShowFriction, triggerFriction, handleEndSession,
  };
}
