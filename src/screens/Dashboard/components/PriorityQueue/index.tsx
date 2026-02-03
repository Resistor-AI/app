import { View } from "react-native";
import { useEffect, useState, useCallback, memo } from "react";
import { FlashList } from "@shopify/flash-list";
import Animated from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";

import { ItemCard } from "./ItemCard";
import { EmptyState } from "./EmptyState";
import { ActiveCard } from "./ActiveCard";
import { PriorityQueueProps } from "@/src/types/Dashboard";
import { usePulseAnimation, useStaggeredEntry } from "@/src/hooks/animations";

export const PriorityQueue = memo(function PriorityQueue({
  settings,
  data,
}: PriorityQueueProps) {
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const [progress, setProgress] = useState(0);

  const isActive = settings?.isSessionActive;

  // Container entry animation
  const { animatedStyle: containerStyle } = useStaggeredEntry({
    index: 2,
    staggerDelay: 100,
    duration: 600,
    translateY: 15,
  });

  // Live indicator pulse
  const { animatedStyle: liveIndicatorStyle } = usePulseAnimation({
    isActive: isActive ?? false,
    duration: 1000,
    minOpacity: 0.5,
  });

  // Start with provided data or empty
  let queueData = data || [];

  // If session is active, ensure we have an item to render the Active Card
  if (settings?.isSessionActive) {
    const hasActiveItem = queueData.some((item) => item.status === "active");
    if (!hasActiveItem) {
      queueData = [
        { status: "active", id: "current-active-session" },
        ...queueData,
      ];
    }
  }

  useEffect(() => {
    if (!settings?.isSessionActive) {
      setTimeLeft("OFFLINE");
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const end = settings.scheduleEnd;
      const start = settings.scheduleStart;
      const remaining = end - now;
      const totalDuration = end - start;

      if (remaining <= 0) {
        setTimeLeft("FINISHED");
        setProgress(100);
        clearInterval(interval);
      } else {
        const h = Math.floor(remaining / 3600000);
        const m = Math.floor((remaining % 3600000) / 60000);
        const s = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(
          `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`,
        );
        setProgress(((now - start) / totalDuration) * 100);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settings]);

  // Empty State Card
  if (queueData.length === 0) return <EmptyState />;

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      if (item.status === "active") {
        return (
          <ActiveCard
            isActive={isActive}
            timeLeft={timeLeft}
            progress={progress}
            index={index}
          />
        );
      }

      return <ItemCard item={item} index={index} />;
    },
    [isActive, timeLeft, progress],
  );

  return (
    <Animated.View style={containerStyle} className="mb-10 w-full">
      <View className="px-6 flex-row items-center justify-between mb-4 pl-1">
        <AppText content="Priority Queue" variant="overline" />
        <View className="flex-row items-center gap-2">
          {isActive && (
            <>
              <Animated.View
                style={liveIndicatorStyle}
                className="h-1.5 w-1.5 rounded-full bg-green-500"
              />
              <AppText
                content="Live"
                className="text-green-500 text-[10px] font-bold uppercase"
              />
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
        // @ts-ignore
        estimatedItemSize={200}
      />
    </Animated.View>
  );
});
