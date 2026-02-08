import { useState, useCallback } from "react";
import { GeneratedSchedule, ScheduleBlock } from "@/src/types/Focus";
import { ScheduleGenerationInput } from "@/src/types/Focus/ScheduleGeneration";
import { supabase } from "@/src/lib/supabase/client";
import { generatePomodoroSchedule } from "@/src/lib/focus/generatePomodoroSchedule";
import { useFocusSessionStore } from "@/src/store/focusSessionStore";

export function useScheduleGeneration(
  startTime: Date,
  endTime: Date,
  brainDump: string,
) {
  const setTraceId = useFocusSessionStore((s) => s.setTraceId);
  const [generatedSchedule, setGeneratedSchedule] =
    useState<GeneratedSchedule | null>(null);
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const durationMinutes = Math.round(
    (endTime.getTime() - startTime.getTime()) / 60000,
  );
  const hasBrainDump = brainDump.trim().length > 0;

  const generateSchedule = useCallback(async () => {
    setIsGeneratingSchedule(true);
    setScheduleError(null);

    const result = await generateWithAI(
      startTime,
      endTime,
      durationMinutes,
      brainDump,
    );

    if (result) {
      setGeneratedSchedule(result.schedule);
      setTraceId(result.traceId);
      setIsGeneratingSchedule(false);
      return;
    }

    setTraceId(null);
    setScheduleError("AI unavailable — using local schedule instead.");
    const fallback = buildLocalSchedule(
      startTime,
      durationMinutes,
      hasBrainDump,
    );
    setGeneratedSchedule(fallback);
    setIsGeneratingSchedule(false);
  }, [hasBrainDump, startTime, endTime, durationMinutes, brainDump]);

  const reorderSchedule = useCallback((newSchedule: ScheduleBlock[]) => {
    setGeneratedSchedule((prev) =>
      prev ? { ...prev, schedule: newSchedule } : null,
    );
  }, []);

  const regenerateSchedule = useCallback(
    () => generateSchedule(),
    [generateSchedule],
  );

  return {
    generatedSchedule,
    isGeneratingSchedule,
    scheduleError,
    generateSchedule,
    reorderSchedule,
    regenerateSchedule,
  };
}

async function generateWithAI(
  startTime: Date,
  endTime: Date,
  durationMinutes: number,
  brainDump: string,
): Promise<{ schedule: GeneratedSchedule; traceId: string | null } | null> {
  try {
    const input: ScheduleGenerationInput = {
      brainDump,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      durationMinutes,
      breakPreference: "balanced",
    };

    const { data, error } = await supabase.functions.invoke(
      "generate-schedule",
      { body: input },
    );

    if (error) {
      console.error("Edge function error:", error.message);
      const errorBody = await error.context?.json?.().catch(() => null);
      console.error("Error details:", errorBody);
      return null;
    }

    if (!data?.success) {
      console.error("Schedule generation failed:", data?.error);
      return null;
    }

    return {
      schedule: data.data as GeneratedSchedule,
      traceId: data.traceId ?? null,
    };
  } catch {
    return null;
  }
}

function buildLocalSchedule(
  startTime: Date,
  durationMinutes: number,
  hasBrainDump: boolean,
): GeneratedSchedule {
  const { schedule, totalFocus, totalBreak } = generatePomodoroSchedule(
    startTime,
    durationMinutes,
    hasBrainDump,
  );

  const focusBlockCount = schedule.filter((b) => b.type === "task").length;
  const suggestion = buildSuggestion(
    durationMinutes,
    focusBlockCount,
    schedule.length - focusBlockCount,
  );

  return {
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
}

function buildSuggestion(
  duration: number,
  focusBlocks: number,
  breakCount: number,
): string {
  if (duration <= 25)
    return "Short focused sprint. Stay locked in and crush it!";
  if (duration <= 60)
    return `${focusBlocks} Pomodoro${focusBlocks > 1 ? "s" : ""} with strategic breaks to maintain peak focus.`;
  if (duration <= 120)
    return `Extended session with ${breakCount} break${breakCount > 1 ? "s" : ""}. The breaks will help you stay sharp throughout.`;
  return "Marathon session! Take your breaks seriously - they're essential for sustained performance.";
}
