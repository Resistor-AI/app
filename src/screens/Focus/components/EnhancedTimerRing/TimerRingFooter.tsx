import { View } from "react-native";
import { BlurView } from "expo-blur";
import { AppText } from "@/src/components/atoms/text";
import { NextBlockCard } from "./NextBlockCard";
import {
  TimerRingFooterProps,
  ProgressPillProps,
  BlockProgressDotsProps,
} from "@/src/types/Focus/TimerRing";

function ProgressPill({ progress, theme }: ProgressPillProps) {
  return (
    <View className="items-center mt-6">
      <View
        className="overflow-hidden rounded-full border border-white/10"
      >
        <BlurView intensity={30} tint="dark">
          <View className="px-4 py-2 bg-white/5">
            <AppText
              variant="body"
              className="font-bold tracking-wide"
              style={{ color: theme.primary }}
            >
              {Math.round(progress * 100)}% complete
            </AppText>
          </View>
        </BlurView>
      </View>
    </View>
  );
}

function BlockProgressDots({
  currentBlock,
  totalBlocks,
  theme,
}: BlockProgressDotsProps) {
  return (
    <View className="flex-row items-center justify-center gap-2 mt-5">
      {Array.from({ length: totalBlocks }).map((_, i) => {
        const isCompleted = i < currentBlock - 1;
        const isCurrent = i + 1 === currentBlock;

        return (
          <View
            key={i}
            style={{
              width: isCurrent ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: isCompleted
                ? theme.primary
                : isCurrent
                  ? theme.primary
                  : "rgba(255, 255, 255, 0.15)",
              opacity: isCompleted ? 0.5 : 1,
            }}
          />
        );
      })}
    </View>
  );
}

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
