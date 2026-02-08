export interface ScheduleGenerationInput {
  brainDump: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  breakPreference: BreakPreference;
}

export type BreakPreference = "short" | "balanced" | "extended";

export interface ScheduleGenerationResponse {
  success: boolean;
  data?: import("./index").GeneratedSchedule;
  traceId?: string;
  error?: string;
}
