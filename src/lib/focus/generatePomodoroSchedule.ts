import { ScheduleBlock } from "@/src/types/Focus";

const POMODORO_FOCUS_DURATION = 25;
const POMODORO_SHORT_BREAK = 5;
const POMODORO_LONG_BREAK = 15;
const POMODOROS_BEFORE_LONG_BREAK = 4;

export function generatePomodoroSchedule(
  startTime: Date,
  totalMinutes: number,
  hasTasks: boolean
): { schedule: ScheduleBlock[]; totalFocus: number; totalBreak: number } {
  const schedule: ScheduleBlock[] = [];
  let currentTime = new Date(startTime);
  let remainingMinutes = totalMinutes;
  let blockIndex = 1;
  let pomodoroCount = 0;
  let totalFocus = 0;
  let totalBreak = 0;

  while (remainingMinutes > 0) {
    let focusDuration = Math.min(POMODORO_FOCUS_DURATION, remainingMinutes);
    if (remainingMinutes <= POMODORO_FOCUS_DURATION) {
      focusDuration = remainingMinutes;
    }

    const focusEnd = new Date(currentTime.getTime() + focusDuration * 60000);
    schedule.push({
      id: `focus_${blockIndex}`,
      type: "task",
      title: hasTasks ? `Focus Block ${blockIndex}` : `Deep Focus ${blockIndex}`,
      startTime: currentTime.toISOString(),
      endTime: focusEnd.toISOString(),
      durationMinutes: focusDuration,
    });

    totalFocus += focusDuration;
    remainingMinutes -= focusDuration;
    currentTime = focusEnd;
    pomodoroCount++;
    blockIndex++;

    if (remainingMinutes > 0) {
      const isLongBreak = pomodoroCount % POMODOROS_BEFORE_LONG_BREAK === 0;
      const breakDuration = Math.min(
        isLongBreak ? POMODORO_LONG_BREAK : POMODORO_SHORT_BREAK,
        remainingMinutes
      );

      if (breakDuration >= 3) {
        const breakEnd = new Date(currentTime.getTime() + breakDuration * 60000);
        schedule.push({
          id: `break_${blockIndex}`,
          type: isLongBreak ? "regenerative_break" : "short_break",
          title: isLongBreak ? "Long Break" : "Short Break",
          startTime: currentTime.toISOString(),
          endTime: breakEnd.toISOString(),
          durationMinutes: breakDuration,
        });

        totalBreak += breakDuration;
        remainingMinutes -= breakDuration;
        currentTime = breakEnd;
      }
    }
  }

  return { schedule, totalFocus, totalBreak };
}
