import { View } from "react-native";
import { useCallback, memo } from "react";
import { FlashList } from "@shopify/flash-list";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";

import { ItemCard } from "./ItemCard";
import { ActiveCard } from "./ActiveCard/ActiveCard";
import { PendingCard } from "./PendingCard";
import { usePulseAnimation } from "@/src/hooks/animations/usePulseAnimation";
import { useQueueData } from "@/src/hooks/dashboard/useQueueData";
import { useQueueTimer } from "@/src/hooks/dashboard/useQueueTimer";
import { useQueueNavigation } from "@/src/hooks/dashboard/useQueueNavigation";
import { PriorityQueueProps, QueueItem } from "@/src/types/Dashboard/PriorityQueue";

export const PriorityQueue = memo(function PriorityQueue({
  settings,
  data,
}: PriorityQueueProps) {
  const isActive = settings?.isSessionActive;

  const { hasScheduledSession, currentBlockInfo, queueData, getCurrentBlock } =
    useQueueData(settings, data, "");
  const { timeLeft, progress, isWaitingToStart } = useQueueTimer(settings, hasScheduledSession);
  const { handleActiveCardPress } = useQueueNavigation(settings, hasScheduledSession, getCurrentBlock);

  const { animatedStyle: liveIndicatorStyle } = usePulseAnimation({
    isActive: isActive ?? false, duration: 1000, minOpacity: 0.5,
  });

  const renderItem = useCallback(
    ({ item, index }: { item: QueueItem; index: number }) => {
      if (item.status === "active") {
        return (
          <ActiveCard
            isActive={hasScheduledSession}
            timeLeft={timeLeft}
            progress={progress}
            index={index}
            onPress={handleActiveCardPress}
            taskName={currentBlockInfo?.block.title || "Focus Block"}
            priority={currentBlockInfo?.priority}
            isBreak={currentBlockInfo?.isBreak}
            currentBlock={currentBlockInfo?.blockIndex}
            totalBlocks={currentBlockInfo?.totalFocusBlocks}
            isWaitingToStart={isWaitingToStart}
            breakCount={currentBlockInfo?.breakCount}
          />
        );
      }
      if (item.status === "pending") {
        return (
          <PendingCard
            index={index}
            title={item.block?.title || ""}
            priority={item.priority ?? "normal"}
            isBreak={item.isBreak ?? false}
            startsIn={item.startsIn ?? 0}
            durationMinutes={item.durationMinutes ?? 0}
            breakCount={item.breakCount ?? 0}
          />
        );
      }
      return <ItemCard item={item} index={index} />;
    },
    [hasScheduledSession, isWaitingToStart, timeLeft, progress, handleActiveCardPress, currentBlockInfo]
  );

  if (queueData.length === 0) return null;

  const [indicatorColor, statusText, textColor] = isWaitingToStart
    ? ["bg-amber-500", "Scheduled", "text-amber-500"] : ["bg-green-500", "Live", "text-green-500"];

  return (
    <Animated.View entering={FadeInDown.duration(350).delay(100)} className="mb-10 w-full">
      <View className="px-6 flex-row items-center justify-between mb-4 pl-1">
        <AppText content="Priority Queue" variant="overline" />
        <View className="flex-row items-center gap-2">
          {hasScheduledSession && (
            <>
              <Animated.View style={liveIndicatorStyle} className={`h-1.5 w-1.5 rounded-full ${indicatorColor}`} />
              <AppText content={statusText} className={`${textColor} text-[10px] font-bold uppercase`} />
            </>
          )}
        </View>
      </View>
      <FlashList
        data={queueData}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        extraData={timeLeft}
      />
    </Animated.View>
  );
});
