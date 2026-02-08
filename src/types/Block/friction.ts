export interface FrictionConfig {
  attemptCount: number;
  currentTask: string;
  blockedApp: string;
  focusedMinutes: number;
}

export interface FrictionResult {
  opened: boolean;
  waitedSeconds: number;
  attemptNumber: number;
}

export interface BreathingCircleProps {
  durationSeconds: number;
  onComplete: () => void;
}
