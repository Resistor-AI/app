import { View } from "react-native";
import { Clock } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import { RING_SIZE } from "./TimerRingConstants";
import { TimeDisplay } from "./TimeDisplay";
import { TimerRingContentProps } from "@/src/types/Focus/TimerRing";

const formatEndTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

export function TimerRingContent({
  minutes,
  seconds,
  taskName,
  currentBlock,
  totalBlocks,
  hideBlockProgress,
  endTime,
  colonStyle,
  theme,
}: TimerRingContentProps) {
  return (
    <View className="items-center justify-center absolute">
      {!hideBlockProgress && totalBlocks > 1 && (
        <View className="px-3 py-1 rounded-full mb-3 bg-white/[0.08]">
          <AppText variant="label" className="text-white/50 tracking-widest font-bold uppercase">
            BLOCK {currentBlock} OF {totalBlocks}
          </AppText>
        </View>
      )}

      <TimeDisplay
        minutes={minutes}
        seconds={seconds}
        colonStyle={colonStyle}
        theme={theme}
      />

      <AppText
        variant="h5"
        className="text-white/70 mt-2 text-center font-semibold"
        style={{ maxWidth: RING_SIZE * 0.6 }}
        numberOfLines={1}
      >
        {taskName}
      </AppText>

      {endTime && !hideBlockProgress && (
        <View className="flex-row items-center gap-1.5 mt-2">
          <Clock size={15} color="rgba(255, 255, 255, 0.4)" />
          <AppText variant="body-sm" className="text-white/40 font-semibold">
            ends {formatEndTime(endTime)}
          </AppText>
        </View>
      )}
    </View>
  );
}
