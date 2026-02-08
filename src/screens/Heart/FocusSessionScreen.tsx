import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { EnhancedTimerRing } from "@/src/screens/Focus/components/EnhancedTimerRing/EnhancedTimerRing";
import { FloatingControlBar } from "@/src/screens/Focus/components/FloatingControlBar";
import { EnhancedFrictionModal } from "@/src/screens/Focus/components/EnhancedFrictionModal/EnhancedFrictionModal";
import { useFocusTimer } from "@/src/hooks/focus/useFocusTimer";

export default function FocusSessionScreen() {
  const { bottom } = useSafeAreaInsets();
  const {
    minutes, seconds, progress, isBreak, isWaitingToStart, showFriction,
    taskName, priority, currentBlock, totalBlocks, endTimeMs, nextBlockName,
    setShowFriction, triggerFriction, handleEndSession,
  } = useFocusTimer();

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <View className="flex-1 items-center justify-center">
        <Animated.View entering={FadeIn.delay(100).duration(800)}>
          <EnhancedTimerRing
            minutes={minutes} seconds={seconds} progress={progress}
            isBreak={isBreak} isIdle={isWaitingToStart}
            taskName={isWaitingToStart ? "Session starts in" : taskName}
            currentBlock={currentBlock} totalBlocks={totalBlocks} priority={priority}
            hideBlockProgress={isWaitingToStart}
            endTime={isWaitingToStart ? undefined : new Date(endTimeMs)}
            nextBlockName={nextBlockName}
          />
        </Animated.View>
      </View>
      <View style={{ paddingBottom: bottom + 24 }}>
        <Animated.View entering={FadeInUp.delay(300).duration(600)} className="items-center px-6">
          <FloatingControlBar onEnd={triggerFriction} />
        </Animated.View>
      </View>
      <EnhancedFrictionModal
        visible={showFriction}
        onClose={() => setShowFriction(false)}
        onConfirmExit={handleEndSession}
      />
    </View>
  );
}
