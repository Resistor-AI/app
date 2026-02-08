import { View, Dimensions } from "react-native";
import Animated from "react-native-reanimated";
import { RING_SIZE, PRIORITY_THEMES } from "./TimerRingConstants";
import { useTimerAnimations } from "@/src/hooks/focus/useTimerAnimations";
import { StatusBadge } from "./StatusBadge";
import { InnerGlassPanel } from "./InnerGlassPanel";
import { TimerRingProgress } from "./TimerRingProgress";
import { TimerRingContent } from "./TimerRingContent";
import { TimerRingFooter } from "./TimerRingFooter";
import { EnhancedTimerRingProps } from "@/src/types/Focus/TimerRing";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function EnhancedTimerRing({
  minutes,
  seconds,
  progress,
  isBreak,
  isIdle,
  taskName,
  currentBlock,
  totalBlocks,
  priority = "normal",
  hideBlockProgress = false,
  endTime,
  nextBlockName,
}: EnhancedTimerRingProps) {
  const theme = isBreak ? PRIORITY_THEMES.break : PRIORITY_THEMES[priority];

  const animations = useTimerAnimations(progress, isIdle);

  return (
    <View className="items-center justify-center" style={{ width: SCREEN_WIDTH }}>
      <Animated.View style={animations.contentStyle}>
        <StatusBadge theme={theme} priority={priority} isBreak={isBreak} />

        <View
          className="items-center justify-center"
          style={{ width: RING_SIZE, height: RING_SIZE }}
        >
          <TimerRingProgress
            theme={theme}
            ringContainerStyle={animations.ringContainerStyle}
            glowStyle={animations.glowStyle}
            progressStrokeStyle={animations.progressStrokeStyle}
            indicatorStyle={animations.indicatorStyle}
          />

          <InnerGlassPanel />

          <TimerRingContent
            minutes={minutes}
            seconds={seconds}
            taskName={taskName}
            currentBlock={currentBlock}
            totalBlocks={totalBlocks}
            hideBlockProgress={hideBlockProgress}
            endTime={endTime}
            colonStyle={animations.colonStyle}
            theme={theme}
          />
        </View>

        <TimerRingFooter
          progress={progress}
          currentBlock={currentBlock}
          totalBlocks={totalBlocks}
          hideBlockProgress={hideBlockProgress}
          nextBlockName={nextBlockName}
          theme={theme}
        />
      </Animated.View>
    </View>
  );
}
