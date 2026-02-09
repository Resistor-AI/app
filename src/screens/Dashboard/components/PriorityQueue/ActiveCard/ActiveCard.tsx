import { View } from "react-native";
import { memo } from "react";
import Animated from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { Target } from "lucide-react-native";
import { usePulseAnimation } from "@/src/hooks/animations/usePulseAnimation";
import { useStaggeredEntry } from "@/src/hooks/animations/useStaggeredEntry";
import { useScalePress } from "@/src/hooks/animations/useScalePress";
import { ExtendedActiveCardProps, ActiveCardOfflineProps } from "@/src/types/Dashboard/ActiveCard";
import { PRIORITY_CONFIG, BREAK_CONFIG } from "./PriorityConfig";
import { ActiveCardActive } from "./ActiveCardActive";

const ActiveCardOffline = memo(function ActiveCardOffline({
  entryStyle,
}: ActiveCardOfflineProps) {
  return (
    <Animated.View
      style={[entryStyle]}
      className="mr-4 w-[200px] bg-zinc-900/90 rounded-3xl p-5 h-48 border border-zinc-800 justify-center items-center"
    >
      <View className="w-12 h-12 rounded-full bg-zinc-800 items-center justify-center mb-3">
        <Target size={20} color="#52525b" />
      </View>
      <AppText className="text-zinc-500 text-sm font-semibold mb-1">
        No Active Session
      </AppText>
      <AppText className="text-zinc-600 text-xs text-center">
        Tap + to start focusing
      </AppText>
    </Animated.View>
  );
});

export const ActiveCard = memo(function ActiveCard({
  isActive,
  timeLeft,
  progress,
  index = 0,
  onPress,
  taskName,
  priority = "normal",
  isBreak = false,
  currentBlock = 1,
  totalBlocks = 1,
  isWaitingToStart = false,
  breakCount = 0,
}: ExtendedActiveCardProps) {
  // Get config based on state
  const config = isBreak ? BREAK_CONFIG : PRIORITY_CONFIG[priority];
  const displayTitle = taskName || (isBreak ? "Break Time" : "Focus Session");

  // Animations
  const { animatedStyle: entryStyle } = useStaggeredEntry({
    index,
    duration: 500,
    translateY: 20,
    initialScale: 0.95,
    useSpring: true,
    springPreset: "snappy",
  });

  const { animatedStyle: pressStyle, onPressIn, onPressOut } = useScalePress({
    minScale: 0.96,
  });

  const { animatedStyle: pulseStyle } = usePulseAnimation({
    isActive: isActive ?? false,
    duration: 1500,
    minOpacity: 0.4,
  });

  const { animatedStyle: glowStyle } = usePulseAnimation({
    isActive: (isActive && !isWaitingToStart) ?? false,
    useScale: true,
    minScale: 0.9,
    maxScale: 1.15,
    duration: 2500,
  });

  if (!isActive) {
    return <ActiveCardOffline entryStyle={entryStyle} />;
  }

  return (
    <ActiveCardActive
      config={config}
      displayTitle={displayTitle}
      priority={priority}
      isBreak={isBreak}
      currentBlock={currentBlock}
      totalBlocks={totalBlocks}
      isWaitingToStart={isWaitingToStart}
      timeLeft={timeLeft}
      progress={progress}
      entryStyle={entryStyle}
      pressStyle={pressStyle}
      pulseStyle={pulseStyle}
      glowStyle={glowStyle}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      breakCount={breakCount}
    />
  );
});
