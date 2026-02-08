import { View } from "react-native";
import { BlockProgressDotsProps } from "@/src/types/Focus/TimerRing";

export function BlockProgressDots({
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
