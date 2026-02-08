import { memo } from "react";
import { usePulseAnimation } from "@/src/hooks/animations/usePulseAnimation";
import { useStaggeredEntry } from "@/src/hooks/animations/useStaggeredEntry";
import { useScalePress } from "@/src/hooks/animations/useScalePress";
import { ExtendedActiveCardProps } from "@/src/types/Dashboard/ActiveCard";
import { PRIORITY_CONFIG, BREAK_CONFIG } from "./PriorityConfig";
import { ActiveCardOffline } from "./ActiveCardOffline";
import { ActiveCardActive } from "./ActiveCardActive";

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
