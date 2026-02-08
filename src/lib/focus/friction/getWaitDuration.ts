const DURATIONS = [10, 20, 30] as const;
const MAX_DURATION = 30;

export function getWaitDuration(attemptCount: number): number {
  if (attemptCount <= 0) return DURATIONS[0];
  if (attemptCount <= DURATIONS.length) return DURATIONS[attemptCount - 1];
  return MAX_DURATION;
}
