import { useState, useCallback } from "react";
import * as Haptics from "expo-haptics";
import { setSchedule, setBlockedApps } from "@/modules/installed-apps";
import { useFocusSessionStore } from "@/src/store/focusSessionStore";
import { useTimeSelection } from "./useTimeSelection";
import { useAppSelection } from "./useAppSelection";
import { useScheduleGeneration } from "./useScheduleGeneration";
import { useSessionNavigation } from "./useSessionNavigation";

export function useSessionSetup() {
  const setActiveSchedule = useFocusSessionStore((s) => s.setActiveSchedule);
  const time = useTimeSelection();
  const apps = useAppSelection();
  const nav = useSessionNavigation();
  const [brainDump, setBrainDump] = useState("");
  const hasBrainDump = brainDump.trim().length > 0;

  const schedule = useScheduleGeneration(
    time.startTime, time.endTime, brainDump
  );

  const startSession = useCallback(() => {
    if (!time.isFormValid) return;
    setBlockedApps(Array.from(apps.selectedPackages));
    setSchedule(time.startTime.getTime(), time.endTime.getTime());
    if (schedule.generatedSchedule) setActiveSchedule(schedule.generatedSchedule);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    nav.router.replace({
      pathname: "/(app)/(protected)/focus",
      params: {
        startTime: time.startTime.getTime().toString(),
        endTime: time.endTime.getTime().toString(),
        schedule: schedule.generatedSchedule ? JSON.stringify(schedule.generatedSchedule) : undefined,
      },
    });
  }, [time, apps.selectedPackages, schedule.generatedSchedule, setActiveSchedule, nav.router]);

  return {
    step: nav.step, totalSteps: nav.totalSteps, stepDirection: nav.stepDirection,
    startTime: time.startTime, endTime: time.endTime,
    setStartTime: time.setStartTime, setEndTime: time.setEndTime,
    durationMinutes: time.durationMinutes,
    isStartTimeValid: time.isStartTimeValid,
    isValidTimeRange: time.isValidTimeRange,
    isFormValid: time.isFormValid,
    isLoadingApps: apps.isLoadingApps,
    defaultBlockedApps: apps.defaultBlockedApps,
    availableApps: apps.availableApps,
    selectedPackages: apps.selectedPackages,
    toggleApp: apps.toggleApp,
    selectAllApps: apps.selectAllApps,
    deselectAllApps: apps.deselectAllApps,
    brainDump, setBrainDump, hasBrainDump,
    generatedSchedule: schedule.generatedSchedule,
    isGeneratingSchedule: schedule.isGeneratingSchedule,
    scheduleError: schedule.scheduleError,
    generateSchedule: schedule.generateSchedule,
    reorderSchedule: schedule.reorderSchedule,
    regenerateSchedule: schedule.regenerateSchedule,
    nextStep: nav.nextStep, prevStep: nav.prevStep,
    skipStep: nav.skipStep, goBack: nav.goBack,
    startSession,
  };
}
