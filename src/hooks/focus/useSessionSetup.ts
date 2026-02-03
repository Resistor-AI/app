import { useState, useMemo, useCallback, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import {
  setSchedule,
  setBlockedApps,
  getBlockedApps,
} from "@/modules/installed-apps";
import { useInstalledApps } from "@/src/hooks/useInstalledApps";
import {
  StepNumber,
  TOTAL_STEPS,
  GeneratedSchedule,
  ScheduleBlock,
} from "@/src/types/Focus";

// Pomodoro configuration
const POMODORO_FOCUS_DURATION = 25; // minutes
const POMODORO_SHORT_BREAK = 5; // minutes
const POMODORO_LONG_BREAK = 15; // minutes
const POMODOROS_BEFORE_LONG_BREAK = 4;

/**
 * Generate Pomodoro-style schedule blocks
 * - 25 min focus + 5 min short break
 * - After 4 pomodoros, take a 15 min long break
 * - Adapts to available time
 */
function generatePomodoroSchedule(
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
    // Determine focus duration
    let focusDuration = Math.min(POMODORO_FOCUS_DURATION, remainingMinutes);

    // If remaining time is less than a full pomodoro + break, just use remaining for focus
    if (remainingMinutes <= POMODORO_FOCUS_DURATION) {
      focusDuration = remainingMinutes;
    }

    // Add focus block
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

    // Add break if there's time remaining
    if (remainingMinutes > 0) {
      // Determine break type and duration
      const isLongBreak = pomodoroCount % POMODOROS_BEFORE_LONG_BREAK === 0;
      const breakDuration = Math.min(
        isLongBreak ? POMODORO_LONG_BREAK : POMODORO_SHORT_BREAK,
        remainingMinutes
      );

      // Only add break if we have enough time for it to be meaningful (at least 3 min)
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

export function useSessionSetup() {
  const router = useRouter();

  // Step state
  const [step, setStep] = useState<StepNumber>(1);
  const [stepDirection, setStepDirection] = useState<"forward" | "back">("forward");

  // Step 1: Time Selection
  const [startTime, setStartTime] = useState<Date>(
    new Date(Date.now() + 10 * 60 * 1000)
  );
  const [endTime, setEndTime] = useState<Date>(
    new Date(Date.now() + 70 * 60 * 1000)
  );

  // Handle end time - auto-adjust to next day if it appears before start time
  const handleEndTimeChange = useCallback((newEndTime: Date) => {
    // If end time appears to be before or equal to start time,
    // assume user means the next day
    if (newEndTime.getTime() <= startTime.getTime()) {
      const nextDay = new Date(newEndTime);
      nextDay.setDate(nextDay.getDate() + 1);
      setEndTime(nextDay);
    } else {
      // Check if we previously shifted to next day but now end time is valid on same day
      const sameDayEnd = new Date(newEndTime);
      sameDayEnd.setFullYear(startTime.getFullYear());
      sameDayEnd.setMonth(startTime.getMonth());
      sameDayEnd.setDate(startTime.getDate());

      if (sameDayEnd.getTime() > startTime.getTime()) {
        setEndTime(sameDayEnd);
      } else {
        setEndTime(newEndTime);
      }
    }
  }, [startTime]);

  // Handle start time - reset end time to same day if needed
  const handleStartTimeChange = useCallback((newStartTime: Date) => {
    setStartTime(newStartTime);

    // If end time is now invalid, adjust it
    if (endTime.getTime() <= newStartTime.getTime()) {
      // Add 1 hour to new start time as default
      const newEndTime = new Date(newStartTime.getTime() + 60 * 60 * 1000);
      setEndTime(newEndTime);
    }
  }, [endTime]);

  // Step 2: App Selection
  const { data: categorizedApps, isLoading: isLoadingApps } = useInstalledApps();
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(
    new Set()
  );

  // Initialize selected packages with currently blocked apps
  useEffect(() => {
    const blockedApps = getBlockedApps();
    if (blockedApps && blockedApps.length > 0) {
      setSelectedPackages(new Set(blockedApps));
    }
  }, []);

  // Flatten apps for display
  const allApps = useMemo(() => {
    if (!categorizedApps) return [];
    return categorizedApps.flatMap((section) => section.data);
  }, [categorizedApps]);

  // Get default blocked apps (currently blocked)
  const defaultBlockedApps = useMemo(() => {
    const blocked = getBlockedApps() || [];
    return allApps.filter((app) => blocked.includes(app.packageName));
  }, [allApps]);

  // Get available apps (not in default blocked)
  const availableApps = useMemo(() => {
    const blocked = getBlockedApps() || [];
    return allApps.filter((app) => !blocked.includes(app.packageName));
  }, [allApps]);

  // Step 3: Brain Dump
  const [brainDump, setBrainDump] = useState("");

  // Step 4: AI Schedule
  const [generatedSchedule, setGeneratedSchedule] =
    useState<GeneratedSchedule | null>(null);
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  // Validation
  const isStartTimeValid = useMemo(
    () => startTime.getTime() >= Date.now() - 60000,
    [startTime]
  );

  const isValidTimeRange = useMemo(
    () => endTime.getTime() > startTime.getTime(),
    [startTime, endTime]
  );

  const isFormValid = isStartTimeValid && isValidTimeRange;

  const durationMinutes = useMemo(() => {
    const diff = endTime.getTime() - startTime.getTime();
    return Math.max(0, Math.round(diff / (1000 * 60)));
  }, [startTime, endTime]);

  const hasBrainDump = brainDump.trim().length > 0;

  // Navigation
  const nextStep = useCallback(() => {
    if (step < TOTAL_STEPS) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setStepDirection("forward");
      setStep((prev) => (prev + 1) as StepNumber);
    }
  }, [step]);

  const prevStep = useCallback(() => {
    if (step > 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setStepDirection("back");
      setStep((prev) => (prev - 1) as StepNumber);
    }
  }, [step]);

  const goToStep = useCallback((targetStep: StepNumber) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStepDirection(targetStep > step ? "forward" : "back");
    setStep(targetStep);
  }, [step]);

  const skipStep = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStepDirection("forward");
    setStep((prev) => (prev + 1) as StepNumber);
  }, []);

  const goBack = useCallback(() => router.back(), [router]);

  // App Selection handlers
  const toggleApp = useCallback((packageName: string) => {
    Haptics.selectionAsync();
    setSelectedPackages((prev) => {
      const next = new Set(prev);
      if (next.has(packageName)) {
        next.delete(packageName);
      } else {
        next.add(packageName);
      }
      return next;
    });
  }, []);

  const selectAllApps = useCallback(() => {
    Haptics.selectionAsync();
    setSelectedPackages(new Set(allApps.map((app) => app.packageName)));
  }, [allApps]);

  const deselectAllApps = useCallback(() => {
    Haptics.selectionAsync();
    // Reset to only default blocked apps
    const blocked = getBlockedApps() || [];
    setSelectedPackages(new Set(blocked));
  }, []);

  // Schedule handlers
  const generateSchedule = useCallback(async () => {
    setIsGeneratingSchedule(true);
    setScheduleError(null);

    try {
      // Generate Pomodoro-style schedule
      const { schedule, totalFocus, totalBreak } = generatePomodoroSchedule(
        startTime,
        durationMinutes,
        hasBrainDump
      );

      const focusBlockCount = schedule.filter((b) => b.type === "task").length;
      const breakCount = schedule.filter((b) => b.type !== "task").length;

      // Generate contextual suggestion
      let suggestion = "";
      if (durationMinutes <= 25) {
        suggestion = "Short focused sprint. Stay locked in and crush it!";
      } else if (durationMinutes <= 60) {
        suggestion = `${focusBlockCount} Pomodoro${focusBlockCount > 1 ? "s" : ""} with strategic breaks to maintain peak focus.`;
      } else if (durationMinutes <= 120) {
        suggestion = `Extended session with ${breakCount} break${breakCount > 1 ? "s" : ""}. The breaks will help you stay sharp throughout.`;
      } else {
        suggestion = `Marathon session! Take your breaks seriously - they're essential for sustained performance.`;
      }

      const generatedSchedule: GeneratedSchedule = {
        tasks: [],
        schedule,
        summary: {
          totalTasks: focusBlockCount,
          totalFocusMinutes: totalFocus,
          totalBreakMinutes: totalBreak,
          urgentTasks: 0,
          suggestion,
        },
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setGeneratedSchedule(generatedSchedule);
    } catch (error) {
      setScheduleError("Failed to generate schedule. Please try again.");
    } finally {
      setIsGeneratingSchedule(false);
    }
  }, [hasBrainDump, startTime, durationMinutes]);

  const reorderSchedule = useCallback((newSchedule: ScheduleBlock[]) => {
    setGeneratedSchedule((prev) =>
      prev ? { ...prev, schedule: newSchedule } : null
    );
  }, []);

  const regenerateSchedule = useCallback(() => {
    generateSchedule();
  }, [generateSchedule]);

  // Start session
  const startSession = useCallback(() => {
    if (!isFormValid) return;

    // Set blocked apps for this session
    const appsToBlock = Array.from(selectedPackages);
    setBlockedApps(appsToBlock);

    // Set schedule
    setSchedule(startTime.getTime(), endTime.getTime());
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    router.replace({
      pathname: "/(app)/(protected)/focus",
      params: {
        startTime: startTime.getTime().toString(),
        endTime: endTime.getTime().toString(),
        schedule: generatedSchedule
          ? JSON.stringify(generatedSchedule)
          : undefined,
      },
    });
  }, [isFormValid, startTime, endTime, router, generatedSchedule, selectedPackages]);

  return {
    // Step state
    step,
    totalSteps: TOTAL_STEPS,
    stepDirection,

    // Time state
    startTime,
    endTime,
    setStartTime: handleStartTimeChange,
    setEndTime: handleEndTimeChange,
    durationMinutes,

    // Validation
    isStartTimeValid,
    isValidTimeRange,
    isFormValid,

    // App selection
    isLoadingApps,
    defaultBlockedApps,
    availableApps,
    selectedPackages,
    toggleApp,
    selectAllApps,
    deselectAllApps,

    // Brain dump
    brainDump,
    setBrainDump,
    hasBrainDump,

    // Schedule
    generatedSchedule,
    isGeneratingSchedule,
    scheduleError,
    generateSchedule,
    reorderSchedule,
    regenerateSchedule,

    // Navigation
    nextStep,
    prevStep,
    goToStep,
    skipStep,
    goBack,
    startSession,
  };
}
