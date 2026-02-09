import { View, Dimensions } from "react-native";
import Animated from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { AppText } from "@/src/components/atoms/text";
import { RING_SIZE, PRIORITY_THEMES } from "./TimerRingConstants";
import { useTimerAnimations } from "@/src/hooks/focus/useTimerAnimations";
import { TimerRingProgress } from "./TimerRingProgress";
import { TimerRingContent } from "./TimerRingContent";
import { TimerRingFooter } from "./TimerRingFooter";
import { EnhancedTimerRingProps, StatusBadgeProps } from "@/src/types/Focus/TimerRing";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function StatusBadge({ theme, priority, isBreak }: StatusBadgeProps) {
  const StatusIcon = theme.Icon;
  const shouldFillIcon = priority === "urgent" || priority === "high" || isBreak;

  return (
    <View className="items-center mb-8">
      <View
        className="overflow-hidden rounded-full"
        style={{ borderWidth: 1, borderColor: `${theme.primary}30` }}
      >
        <BlurView intensity={40} tint="dark">
          <View
            className="flex-row items-center gap-2 px-5 py-2.5"
            style={{ backgroundColor: theme.soft }}
          >
            <StatusIcon
              size={18}
              color={theme.primary}
              fill={shouldFillIcon ? theme.primary : "transparent"}
            />
            <AppText
              variant="label"
              className="font-bold tracking-[2px] uppercase"
              style={{ color: theme.primary }}
            >
              {theme.label}
            </AppText>
          </View>
        </BlurView>
      </View>
    </View>
  );
}

function InnerGlassPanel() {
  return (
    <View
      className="absolute overflow-hidden"
      style={{
        width: RING_SIZE * 0.78,
        height: RING_SIZE * 0.78,
        borderRadius: RING_SIZE,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
      }}
    >
      <BlurView
        intensity={25}
        tint="dark"
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
      />
    </View>
  );
}

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
