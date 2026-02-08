import { ParsedTask, ScheduleBlock } from "@/src/types/Focus";
import { FocusBlockData } from "@/src/types/Focus/AISessionPlanningStep";
import { formatTimeDisplay } from "./formatters";

export function formatBlockTime(isoString: string): string {
  return formatTimeDisplay(new Date(isoString));
}

export function formatBlockDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export function transformToFocusBlocks(
  schedule: ScheduleBlock[],
  tasks?: ParsedTask[],
): FocusBlockData[] {
  const taskMap = new Map(tasks?.map((t) => [t.id, t]) ?? []);
  const blocks: FocusBlockData[] = [];
  let currentBlock: FocusBlockData | null = null;

  schedule.forEach((item) => {
    if (item.type === "task") {
      if (currentBlock) blocks.push(currentBlock);
      const task = item.taskId ? taskMap.get(item.taskId) : undefined;
      currentBlock = {
        id: item.id,
        title: item.title,
        startTime: item.startTime,
        endTime: item.endTime,
        totalDuration: item.durationMinutes,
        focusDuration: item.durationMinutes,
        breakDuration: 0,
        breakCount: 0,
        priority: item.priority,
        taskName: item.title,
        notes: task?.notes,
        segments: [{ type: "focus", duration: item.durationMinutes }],
      };
    } else if (currentBlock) {
      currentBlock.breakDuration += item.durationMinutes;
      currentBlock.breakCount += 1;
      currentBlock.totalDuration += item.durationMinutes;
      currentBlock.endTime = item.endTime;
      currentBlock.segments.push({
        type: "break",
        duration: item.durationMinutes,
        title: item.title,
      });
    }
  });

  if (currentBlock) blocks.push(currentBlock);
  return blocks;
}
