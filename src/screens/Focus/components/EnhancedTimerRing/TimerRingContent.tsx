import { View } from "react-native";
import Animated from "react-native-reanimated";
import { Clock } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import { RING_SIZE } from "./TimerRingConstants";
import { TimerRingContentProps, TimeDisplayProps } from "@/src/types/Focus/TimerRing";

const formatEndTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

function TimeDisplay({ minutes, seconds, colonStyle, theme }: TimeDisplayProps) {
  return (
    <View className="flex-row items-center">
      <AppText
        className="text-[72px] font-extrabold text-white tracking-tight"
        style={{ fontVariant: ["tabular-nums"], includeFontPadding: false }}
      >
        {String(minutes).padStart(2, "0")}
      </AppText>

      <Animated.View style={colonStyle}>
        <AppText
          className="text-[58px] font-extrabold mx-0.5 -mt-0.5"
          style={{ color: theme.primary }}
        >
          :
        </AppText>
      </Animated.View>

      <AppText
        className="text-[72px] font-extrabold text-white tracking-tight"
        style={{ fontVariant: ["tabular-nums"], includeFontPadding: false }}
      >
        {String(seconds).padStart(2, "0")}
      </AppText>
    </View>
  );
}

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
