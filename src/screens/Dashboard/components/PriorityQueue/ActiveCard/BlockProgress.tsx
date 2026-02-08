import { View } from "react-native";
import { memo } from "react";
import { AppText } from "@/src/components/atoms/text";
import { BlockProgressProps } from "@/src/types/Dashboard/ActiveCard";

export const BlockProgress = memo(function BlockProgress({
  currentBlock,
  totalBlocks,
  accent,
  isWaitingToStart,
}: BlockProgressProps) {
  if (isWaitingToStart || totalBlocks <= 1) {
    return null;
  }

  return (
    <View className="flex-row items-center gap-1">
      <AppText className="text-zinc-500 text-[10px] font-medium mr-1">
        Block {currentBlock}/{totalBlocks}
      </AppText>
      {Array.from({ length: Math.min(totalBlocks, 5) }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i + 1 === currentBlock ? 14 : 6,
            height: 4,
            borderRadius: 2,
            backgroundColor: i < currentBlock ? accent : "rgba(255,255,255,0.1)",
          }}
        />
      ))}
    </View>
  );
});
