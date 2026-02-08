import { ScheduleBlock, TaskPriority, CurrentBlockInfo, UpcomingBlockInfo } from "@/src/types/Focus";

export function findCurrentBlock(schedule: ScheduleBlock[]): CurrentBlockInfo | null {
  if (!schedule.length) return null;
  const now = Date.now();
  let currentBlock: ScheduleBlock | null = null;
  let currentIndex = 0;

  for (let i = 0; i < schedule.length; i++) {
    const blockStart = new Date(schedule[i].startTime).getTime();
    const blockEnd = new Date(schedule[i].endTime).getTime();

    if (now >= blockStart && now < blockEnd) {
      currentBlock = schedule[i];
      currentIndex = i;
      break;
    }

    if (now >= blockEnd && i < schedule.length - 1) {
      const nextStart = new Date(schedule[i + 1].startTime).getTime();
      if (now < nextStart) {
        currentBlock = schedule[i];
        currentIndex = i;
        break;
      }
      continue; // next block has started — keep iterating
    }
  }

  if (!currentBlock) {
    const firstStart = new Date(schedule[0].startTime).getTime();
    const lastEnd = new Date(schedule[schedule.length - 1].endTime).getTime();
    if (now < firstStart) {
      currentBlock = schedule[0];
      currentIndex = 0;
    } else if (now >= lastEnd) {
      return null; // session truly over
    } else {
      currentBlock = schedule[schedule.length - 1];
      currentIndex = schedule.length - 1;
    }
  }

  return buildBlockInfo(schedule, currentBlock, currentIndex);
}

function buildBlockInfo(
  schedule: ScheduleBlock[], block: ScheduleBlock, index: number,
): CurrentBlockInfo {
  const focusBlocks = schedule.filter((b) => b.type === "task");
  const focusBlockIndex = focusBlocks.findIndex((b) => b.id === block.id);
  const isBreak = block.type !== "task";
  const priority: TaskPriority = block.priority || "normal";

  let breakCount = 0;
  for (let j = index + 1; j < schedule.length && schedule[j].type !== "task"; j++) {
    breakCount++;
  }

  return {
    block, blockIndex: isBreak ? focusBlockIndex : focusBlockIndex + 1,
    totalFocusBlocks: focusBlocks.length, isBreak, priority, breakCount,
  };
}

export function findUpcomingBlocks(
  schedule: ScheduleBlock[], currentBlockId?: string,
): UpcomingBlockInfo[] {
  const now = Date.now();
  const upcoming: UpcomingBlockInfo[] = [];
  for (let i = 0; i < schedule.length; i++) {
    const block = schedule[i];
    if (block.type !== "task") continue;
    const blockStart = new Date(block.startTime).getTime();
    if (blockStart >= now && block.id !== currentBlockId) {
      let breaks = 0;
      for (let j = i + 1; j < schedule.length && schedule[j].type !== "task"; j++) {
        breaks++;
      }
      upcoming.push({
        block, isBreak: false,
        priority: block.priority || "normal", startsIn: blockStart - now,
        breakCount: breaks,
      });
    }
  }
  return upcoming;
}
