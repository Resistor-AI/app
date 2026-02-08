import { TaskPriority } from "@/src/types/Focus";

export interface CompletedSession {
  id: string;
  taskName: string;
  priority: TaskPriority;
  startTimeMs: number;
  endTimeMs: number;
  durationMinutes: number;
  distractionsBlocked: number;
  completedBlocks: number;
  totalBlocks: number;
  wasManualEnd: boolean;
  date: string;
}

export interface DashboardStats {
  focusSavedToday: string;
  distractionsToday: number;
  streak: number;
  sessionsToday: number;
}

export interface SessionHistoryState {
  sessions: CompletedSession[];
  addSession: (session: CompletedSession) => void;
  getStats: () => DashboardStats;
  clearHistory: () => void;
}
