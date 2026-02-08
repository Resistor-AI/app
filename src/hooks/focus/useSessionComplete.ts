import { useCallback } from "react";
import { getDistractionCount, resetDistractionCount } from "@/modules/installed-apps";
import { useSessionHistoryStore } from "@/src/store/sessionHistoryStore";
import { TaskPriority } from "@/src/types/Focus";

export function useSessionComplete() {
  const addSession = useSessionHistoryStore((s) => s.addSession);

  const saveSession = useCallback(
    (params: {
      taskName: string;
      priority: TaskPriority;
      startTimeMs: number;
      endTimeMs: number;
      currentBlock: number;
      totalBlocks: number;
      wasManualEnd: boolean;
    }) => {
      const distractions = getDistractionCount();
      const actualEndMs = params.wasManualEnd ? Date.now() : params.endTimeMs;
      const durationMinutes = Math.round(
        (actualEndMs - params.startTimeMs) / 60000,
      );

      addSession({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        taskName: params.taskName,
        priority: params.priority,
        startTimeMs: params.startTimeMs,
        endTimeMs: actualEndMs,
        durationMinutes: Math.max(durationMinutes, 1),
        distractionsBlocked: distractions,
        completedBlocks: params.currentBlock,
        totalBlocks: params.totalBlocks,
        wasManualEnd: params.wasManualEnd,
        date: new Date().toISOString(),
      });

      resetDistractionCount();
    },
    [addSession],
  );

  return { saveSession };
}
