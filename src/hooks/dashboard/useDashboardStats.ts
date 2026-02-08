import { useMemo } from "react";
import { useSessionHistoryStore } from "@/src/store/sessionHistoryStore";
import { Session } from "@/src/types/Dashboard";
import { formatDuration } from "@/src/lib/focus/formatters";
import { formatTimeDisplay } from "@/src/lib/focus/formatters";

export function useDashboardStats() {
  const sessions = useSessionHistoryStore((s) => s.sessions);
  const getStats = useSessionHistoryStore((s) => s.getStats);

  const stats = useMemo(() => getStats(), [sessions, getStats]);

  const pastSessions: Session[] = useMemo(() => {
    const today = new Date();
    return sessions
      .filter((s) => {
        const d = new Date(s.date);
        return (
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate()
        );
      })
      .map((s, i) => ({
        id: i + 1,
        title: s.taskName,
        focus: formatDuration(s.durationMinutes),
        saved: `${s.distractionsBlocked} blocked`,
        date: formatTimeDisplay(new Date(s.startTimeMs)),
      }));
  }, [sessions]);

  return { stats, pastSessions };
}
