export const FRICTION_TOTAL_STEPS = 5;

export type FrictionStep = 1 | 2 | 3 | 4 | 5;

export type ChallengeType = "word_recall" | "color_sequence" | "grid_pattern";

export type FrictionMode = "block" | "end_session";

export interface FrictionContext {
  mode: FrictionMode;
  appName: string;
  packageName: string;
  taskName: string;
  remainingMinutes: number;
}

export interface FrictionLog {
  packageName: string;
  appName: string;
  completedAt: number;
  totalDurationSeconds: number;
}
