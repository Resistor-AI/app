import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "./storage";
import { findCurrentBlock, findUpcomingBlocks } from "@/src/lib/focus/blockFinder";
import { FocusSessionState } from "@/src/types/store";

export const useFocusSessionStore = create<FocusSessionState>()(
  persist(
    (set, get) => ({
      activeSchedule: null,
      traceId: null,
      distractionAttempts: {},
      frictionLogs: [],
      setActiveSchedule: (schedule) => set({ activeSchedule: schedule }),
      setTraceId: (id) => set({ traceId: id }),
      clearActiveSchedule: () => set({ activeSchedule: null, traceId: null, distractionAttempts: {} }),

      getCurrentBlock: () => {
        const { activeSchedule } = get();
        if (!activeSchedule?.schedule.length) return null;
        return findCurrentBlock(activeSchedule.schedule);
      },

      getUpcomingBlocks: () => {
        const { activeSchedule, getCurrentBlock } = get();
        if (!activeSchedule?.schedule.length) return [];
        const currentBlockId = getCurrentBlock()?.block.id;
        return findUpcomingBlocks(activeSchedule.schedule, currentBlockId);
      },

      incrementDistractionAttempt: (appId) =>
        set((state) => ({
          distractionAttempts: {
            ...state.distractionAttempts,
            [appId]: (state.distractionAttempts[appId] ?? 0) + 1,
          },
        })),

      logDistractionChoice: (_appId, _opened) => {
        // Analytics hook — extend when tracking is added
      },

      logFrictionComplete: (log) =>
        set((state) => ({
          frictionLogs: [...state.frictionLogs, log],
        })),
    }),
    {
      name: "focus-session-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
