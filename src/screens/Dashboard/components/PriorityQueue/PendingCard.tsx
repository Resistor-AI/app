import { View, Pressable } from "react-native";
import { memo } from "react";
import Animated from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { useStaggeredEntry } from "@/src/hooks/animations/useStaggeredEntry";
import { useScalePress } from "@/src/hooks/animations/useScalePress";
import { Clock, Timer, Coffee } from "lucide-react-native";
import { PendingCardProps } from "@/src/types/Dashboard/PriorityQueue";
import { PENDING_PRIORITY_CONFIG, PENDING_BREAK_CONFIG } from "./ActiveCard/PriorityConfig";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const formatStartsIn = (ms: number) => {
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
};

export const PendingCard = memo(function PendingCard({
  index, title, priority, isBreak, startsIn, durationMinutes, breakCount, onPress,
}: PendingCardProps) {
  const config = isBreak ? PENDING_BREAK_CONFIG : PENDING_PRIORITY_CONFIG[priority];
  const PriorityIcon = config.Icon;
  const isFilled = priority === "urgent" || priority === "high" || isBreak;

  const { animatedStyle: entryStyle } = useStaggeredEntry({ index, duration: 500, translateY: 20, initialScale: 0.95, useSpring: true, springPreset: "snappy" });
  const { animatedStyle: pressStyle, onPressIn, onPressOut } = useScalePress({ minScale: 0.96 });

  return (
    <AnimatedPressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} style={[entryStyle, pressStyle]}
      className="mr-4 w-[200px] bg-zinc-900/70 rounded-3xl p-5 h-48 border border-zinc-800 relative overflow-hidden">
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <View style={{ backgroundColor: config.bg, borderColor: config.border }} className="flex-row items-center gap-1.5 px-2.5 py-1.5 rounded-full border">
          <PriorityIcon size={11} color={config.accent} fill={isFilled ? config.accent : "transparent"} style={{ opacity: 0.7 }} />
          <AppText style={{ color: config.accent, opacity: 0.7 }} className="text-[10px] font-bold uppercase tracking-wide">{config.label}</AppText>
        </View>
      </View>

      {/* Title */}
      <AppText className="text-white/70 text-base font-bold leading-5 tracking-tight" numberOfLines={2}>{title}</AppText>
      <View className="flex-1" />

      {/* Bottom metadata */}
      <View className="flex-row items-end justify-between">
        <View>
          <View className="flex-row items-center gap-1 mb-1">
            <Clock size={10} color="#71717a" />
            <AppText className="text-zinc-500 text-[10px] font-medium">Starts in</AppText>
          </View>
          <AppText className="text-zinc-400 text-2xl font-bold tracking-tight" style={{ fontVariant: ["tabular-nums"] }}>{formatStartsIn(startsIn)}</AppText>
        </View>
        <View className="items-end gap-1.5">
          {durationMinutes > 0 && (
            <View className="flex-row items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: config.bg }}>
              <Timer size={9} color={config.accent} style={{ opacity: 0.6 }} />
              <AppText style={{ color: config.accent, opacity: 0.6 }} className="text-[10px] font-bold">{durationMinutes}m</AppText>
            </View>
          )}
          {breakCount != null && breakCount > 0 && (
            <View className="flex-row items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: config.bg }}>
              <Coffee size={9} color={config.accent} style={{ opacity: 0.6 }} />
              <AppText style={{ color: config.accent, opacity: 0.6 }} className="text-[10px] font-bold">
                {breakCount} {breakCount === 1 ? "break" : "breaks"}
              </AppText>
            </View>
          )}
        </View>
      </View>

      {/* Bottom accent bar */}
      <View className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: `${config.accent}30` }} />
    </AnimatedPressable>
  );
});
