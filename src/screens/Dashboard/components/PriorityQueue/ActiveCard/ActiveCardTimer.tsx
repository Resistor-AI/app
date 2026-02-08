import { View } from "react-native";
import { memo } from "react";
import { AppText } from "@/src/components/atoms/text";
import { AnimatedProgressBar } from "@/src/components/animations/AnimatedProgressBar";
import { Clock } from "lucide-react-native";
import { ActiveCardTimerProps } from "@/src/types/Dashboard/ActiveCard";

export const ActiveCardTimer = memo(function ActiveCardTimer({
  isWaitingToStart,
  timeLeft,
  progress,
  accent,
}: ActiveCardTimerProps) {
  return (
    <>
      <View className="flex-row items-end justify-between">
        <View>
          {isWaitingToStart ? (
            <View className="flex-row items-center gap-1 mb-1">
              <Clock size={10} color="#f59e0b" />
              <AppText className="text-amber-500 text-[10px] font-semibold">
                Starts in
              </AppText>
            </View>
          ) : (
            <AppText className="text-zinc-500 text-[10px] font-medium uppercase tracking-wide mb-1">
              Time Left
            </AppText>
          )}
          <AppText
            className="text-white text-2xl font-bold tracking-tight"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {timeLeft}
          </AppText>
        </View>

        {/* Mini progress circle for visual interest */}
        {!isWaitingToStart && (
          <View
            style={{ borderColor: accent }}
            className="w-10 h-10 rounded-full border-2 items-center justify-center"
          >
            <AppText style={{ color: accent }} className="text-[10px] font-bold">
              {Math.round(progress)}%
            </AppText>
          </View>
        )}
      </View>

      {/* Bottom Progress Bar */}
      {!isWaitingToStart && (
        <View className="absolute bottom-0 left-0 right-0">
          <AnimatedProgressBar
            progress={progress}
            height={3}
            trackColor="rgba(255,255,255,0.05)"
            fillColor={accent}
            duration={1000}
          />
        </View>
      )}
    </>
  );
});
