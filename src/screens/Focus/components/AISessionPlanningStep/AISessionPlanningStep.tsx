import { memo } from "react";
import { View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Sparkles, Clock, ListChecks, Check } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import { StepBadge } from "@/src/components/atoms/StepBadge";
import { AISessionPlanningStepProps } from "@/src/types/Focus/SessionSetup";
import { transformToFocusBlocks, formatBlockTime } from "@/src/lib/focus/focusBlockUtils";
import { FocusBlockCard } from "./FocusBlockCard";
import { ScheduleLoadingState } from "./ScheduleLoadingState";
import { ScheduleErrorState } from "./ScheduleErrorState";
import { ScheduleSummary } from "./ScheduleSummary";

export const AISessionPlanningStep = memo(function AISessionPlanningStep({
  schedule, isLoading, error, onRegenerateSchedule, durationText, startTimeDisplay, hasBrainDump,
}: AISessionPlanningStepProps) {
  const focusBlocks = schedule ? transformToFocusBlocks(schedule.schedule, schedule.tasks) : [];
  const lastBlock = focusBlocks[focusBlocks.length - 1];

  return (
    <View className="flex-1">
      <StepBadge icon={<Sparkles size={14} color="#ffffff" fill="#ffffff" />} label="Your Schedule" variant="white" className="mt-2 mb-4" />
      <View className="mb-3">
        <AppText variant="h3" content={hasBrainDump ? "Your Optimized Schedule" : "Focus Schedule"} center className="mb-1" />
        <AppText variant="body-sm" color="tertiary" center content={hasBrainDump ? "AI organized your tasks with strategic breaks" : "Deep focus blocks with regenerative breaks"} />
      </View>
      <View className="flex-row justify-center gap-3 mb-4">
        <View className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex-row items-center gap-2">
          <Clock size={14} color="#71717a" />
          <AppText variant="body-sm" color="secondary" content={durationText} />
        </View>
        <View className="bg-white/5 border border-white/10 rounded-full px-4 py-2">
          <AppText variant="body-sm" color="secondary" content={`Starts ${startTimeDisplay}`} />
        </View>
      </View>

      {isLoading && <ScheduleLoadingState />}
      {error && !isLoading && <ScheduleErrorState error={error} onRetry={onRegenerateSchedule} />}

      {schedule && !isLoading && !error && (
        <Animated.View entering={FadeIn.duration(200)} className="flex-1">
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
            <View className="flex-row items-center justify-center gap-2 mb-4">
              <ListChecks size={14} color="#71717a" />
              <AppText variant="body-sm" color="tertiary" content="Tap a block to see details" />
            </View>
            {focusBlocks.map((block, index) => (
              <FocusBlockCard key={block.id} block={block} index={index} />
            ))}
            {lastBlock && (
              <View className="flex-row items-center ml-1 mb-4">
                <AppText variant="body-sm" color="tertiary" content={formatBlockTime(lastBlock.endTime)} />
                <View className="flex-1 h-px bg-white/10 ml-3 mr-3" />
                <View className="flex-row items-center gap-2 bg-green-500/15 rounded-full px-4 py-2">
                  <Check size={16} color="#22c55e" />
                  <AppText variant="body" content="Session Complete" style={{ color: "#22c55e" }} />
                </View>
              </View>
            )}
            {schedule.summary && (
              <ScheduleSummary
                totalFocusMinutes={schedule.summary.totalFocusMinutes}
                totalBreakMinutes={schedule.summary.totalBreakMinutes}
                focusBlockCount={focusBlocks.length}
                totalTasks={schedule.summary.totalTasks}
                scheduledTasks={schedule.summary.scheduledTasks ?? focusBlocks.length}
                unscheduledTasks={schedule.summary.unscheduledTasks ?? []}
                suggestion={schedule.summary.suggestion}
              />
            )}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
});
