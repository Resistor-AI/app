import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "./storage";
import { SessionHistoryState } from "@/src/types/store";
function formatStatsDuration(mins: number): string {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  return `${hours}h ${minutes}m`;
}

function isSameDay(dateStr: string, ref: Date): boolean {
  const d = new Date(dateStr);
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  );
}

function calculateStreak(sessions: { date: string }[]): number {
  if (sessions.length === 0) return 0;

  const uniqueDays = new Set<string>();
  for (const s of sessions) {
    const d = new Date(s.date);
    uniqueDays.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  }

  const sorted = Array.from(uniqueDays).sort().reverse();
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  if (sorted[0] !== todayKey) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;
    if (sorted[0] !== yKey) return 0;
  }

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = parseDayKey(sorted[i - 1]);
    const curr = parseDayKey(sorted[i]);
    prev.setDate(prev.getDate() - 1);
    const expectedKey = `${prev.getFullYear()}-${prev.getMonth()}-${prev.getDate()}`;
    if (sorted[i] !== expectedKey) break;
    streak++;
  }
  return streak;
}

function parseDayKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m, d);
}

export const useSessionHistoryStore = create<SessionHistoryState>()(
  persist(
    (set, get) => ({
      sessions: [],

      addSession: (session) =>
        set((state) => ({
          sessions: [session, ...state.sessions],
        })),

      getStats: () => {
        const { sessions } = get();
        const today = new Date();

        const todaySessions = sessions.filter((s) =>
          isSameDay(s.date, today),
        );
        const totalMinutes = todaySessions.reduce(
          (sum, s) => sum + s.durationMinutes,
          0,
        );
        const totalDistractions = todaySessions.reduce(
          (sum, s) => sum + s.distractionsBlocked,
          0,
        );

        return {
          focusSavedToday: formatStatsDuration(totalMinutes),
          distractionsToday: totalDistractions,
          streak: calculateStreak(sessions),
          sessionsToday: todaySessions.length,
        };
      },

      clearHistory: () => set({ sessions: [] }),
    }),
    {
      name: "session-history-storage",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
