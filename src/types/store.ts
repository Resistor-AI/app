import type { Session, User } from "@supabase/supabase-js";

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  logout: () => Promise<void>;
}

export interface OnboardingState {
  name: string;
  description: string;
  hasCompletedOnboarding: boolean;

  setName: (name: string) => void;
  setDescription: (description: string) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export type { SessionHistoryState } from "./Dashboard/SessionHistory";

export interface FocusSessionState {
  activeSchedule: import("@/src/types/Focus").GeneratedSchedule | null;
  setActiveSchedule: (schedule: import("@/src/types/Focus").GeneratedSchedule | null) => void;
  clearActiveSchedule: () => void;
  getCurrentBlock: () => import("@/src/types/Focus").CurrentBlockInfo | null;
  getUpcomingBlocks: () => import("@/src/types/Focus").UpcomingBlockInfo[];
  traceId: string | null;
  setTraceId: (id: string | null) => void;
  distractionAttempts: Record<string, number>;
  incrementDistractionAttempt: (appId: string) => void;
  logDistractionChoice: (appId: string, opened: boolean) => void;
  frictionLogs: import("@/src/types/Block/index").FrictionLog[];
  logFrictionComplete: (log: import("@/src/types/Block/index").FrictionLog) => void;
}
