import { useCallback } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { FocusSettings } from "@/modules/installed-apps";
import { CurrentBlockInfo } from "@/src/types/Dashboard/PriorityQueue";

export function useQueueNavigation(
  settings: FocusSettings | undefined,
  hasScheduledSession: boolean,
  getCurrentBlock: () => CurrentBlockInfo | null
) {
  const router = useRouter();

  const handleActiveCardPress = useCallback(() => {
    if (!hasScheduledSession || !settings) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const blockInfo = getCurrentBlock();
    router.push({
      pathname: "/(app)/(protected)/focus",
      params: {
        startTime: blockInfo?.block.startTime
          ? new Date(blockInfo.block.startTime).getTime().toString()
          : settings.scheduleStart.toString(),
        endTime: blockInfo?.block.endTime
          ? new Date(blockInfo.block.endTime).getTime().toString()
          : settings.scheduleEnd.toString(),
        taskName: blockInfo?.block.title || "Deep Focus Block",
        priority: blockInfo?.priority || "normal",
        currentBlock: blockInfo?.blockIndex?.toString() || "1",
        totalBlocks: blockInfo?.totalFocusBlocks?.toString() || "1",
        isBreak: blockInfo?.isBreak ? "true" : "false",
      },
    });
  }, [hasScheduledSession, settings, router, getCurrentBlock]);

  return { handleActiveCardPress };
}
