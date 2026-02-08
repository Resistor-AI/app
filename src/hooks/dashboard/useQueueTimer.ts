import { useEffect, useState } from "react";
import { FocusSettings } from "@/modules/installed-apps";
import { useFocusSessionStore } from "@/src/store/focusSessionStore";
import { TimerState } from "@/src/types/Dashboard/PriorityQueue";

function formatTime(ms: number): string {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function useQueueTimer(
  settings: FocusSettings | undefined,
  hasScheduledSession: boolean
): TimerState {
  const [timeLeft, setTimeLeft] = useState("00:00");
  const [progress, setProgress] = useState(0);
  const [isWaitingToStart, setIsWaitingToStart] = useState(false);
  const getCurrentBlock = useFocusSessionStore((s) => s.getCurrentBlock);

  useEffect(() => {
    if (!hasScheduledSession || !settings) {
      setTimeLeft("OFFLINE");
      setProgress(0);
      setIsWaitingToStart(false);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const sessionStart = settings.scheduleStart;

      if (now < sessionStart) {
        setIsWaitingToStart(true);
        setTimeLeft(formatTime(sessionStart - now));
        setProgress(0);
        return;
      }

      setIsWaitingToStart(false);
      const blockInfo = getCurrentBlock();

      if (blockInfo) {
        const blockEnd = new Date(blockInfo.block.endTime).getTime();
        const blockStart = new Date(blockInfo.block.startTime).getTime();
        const remaining = blockEnd - now;
        const blockDuration = blockEnd - blockStart;

        if (remaining <= 0) {
          setTimeLeft("00:00");
          setProgress(100);
        } else {
          setTimeLeft(formatTime(remaining));
          setProgress(((now - blockStart) / blockDuration) * 100);
        }
        return;
      }

      // Fallback: use total session time
      const sessionEnd = settings.scheduleEnd;
      const remaining = sessionEnd - now;
      if (remaining <= 0) {
        setTimeLeft("FINISHED");
        setProgress(100);
        clearInterval(interval);
      } else {
        setTimeLeft(formatTime(remaining));
        setProgress(((now - sessionStart) / (sessionEnd - sessionStart)) * 100);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settings, hasScheduledSession, getCurrentBlock]);

  return { timeLeft, progress, isWaitingToStart };
}
