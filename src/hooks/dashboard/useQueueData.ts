import { useMemo } from "react";
import { useFocusSessionStore } from "@/src/store/focusSessionStore";
import { FocusSettings } from "@/modules/installed-apps";
import { QueueItem, PriorityQueueData } from "@/src/types/Dashboard/PriorityQueue";

export function useQueueData(
  settings: FocusSettings | undefined,
  data: PriorityQueueData[] | undefined,
  timeLeft: string
) {
  const activeSchedule = useFocusSessionStore((s) => s.activeSchedule);

  // Check if session is scheduled (either active now or starting in future)
  const hasScheduledSession = useMemo(() => {
    if (settings) {
      const now = Date.now();
      const { scheduleStart, scheduleEnd } = settings;
      if (scheduleStart > 0 && scheduleEnd > now) return true;
    }
    // Fallback: check Zustand store (updates instantly on session creation)
    if (activeSchedule?.schedule.length) {
      const lastBlock = activeSchedule.schedule[activeSchedule.schedule.length - 1];
      return new Date(lastBlock.endTime).getTime() > Date.now();
    }
    return false;
  }, [settings, activeSchedule]);

  const getCurrentBlock = useFocusSessionStore((state) => state.getCurrentBlock);
  const getUpcomingBlocks = useFocusSessionStore((state) => state.getUpcomingBlocks);

  // Get current block info from schedule
  const currentBlockInfo = useMemo(() => {
    if (!hasScheduledSession) return null;
    return getCurrentBlock();
  }, [hasScheduledSession, getCurrentBlock]);

  // Get upcoming blocks (re-fetch when timeLeft changes to keep startsIn fresh)
  const upcomingBlocks = useMemo(() => {
    if (!hasScheduledSession) return [];
    return getUpcomingBlocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasScheduledSession, getUpcomingBlocks, timeLeft]);

  // Build queue data with active + upcoming blocks
  const queueData = useMemo(() => {
    const items: QueueItem[] = [];

    // Add active/current session card
    if (hasScheduledSession) {
      items.push({ status: "active", id: "current-active-session" });
    }

    // Add upcoming blocks as pending cards
    upcomingBlocks.forEach((block) => {
      items.push({
        status: "pending",
        id: `pending-${block.block.id}`,
        block: block.block,
        isBreak: block.isBreak,
        priority: block.priority,
        startsIn: block.startsIn,
        durationMinutes: block.block.durationMinutes,
        breakCount: block.breakCount,
      });
    });

    // Add any other data items
    if (data) {
      items.push(
        ...data
          .filter((item) => item.status !== "active")
          .map((item) => ({
            ...item,
            status: item.status || "unknown",
            id: item.id || `data-${Math.random()}`,
          }))
      );
    }

    return items;
  }, [hasScheduledSession, upcomingBlocks, data]);

  return {
    hasScheduledSession,
    currentBlockInfo,
    queueData,
    getCurrentBlock,
  };
}
