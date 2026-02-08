import { ProgressPill } from "./ProgressPill";
import { BlockProgressDots } from "./BlockProgressDots";
import { NextBlockCard } from "./NextBlockCard";
import { TimerRingFooterProps } from "@/src/types/Focus/TimerRing";

export function TimerRingFooter({
  progress,
  currentBlock,
  totalBlocks,
  hideBlockProgress,
  nextBlockName,
  theme,
}: TimerRingFooterProps) {
  return (
    <>
      <ProgressPill progress={progress} theme={theme} />

      {!hideBlockProgress && totalBlocks > 1 && (
        <BlockProgressDots
          currentBlock={currentBlock}
          totalBlocks={totalBlocks}
          theme={theme}
        />
      )}

      {nextBlockName && !hideBlockProgress && (
        <NextBlockCard nextBlockName={nextBlockName} />
      )}
    </>
  );
}
