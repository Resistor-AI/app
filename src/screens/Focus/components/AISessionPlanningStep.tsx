import { memo, useState } from "react";
import { View, Pressable, ActivityIndicator, ScrollView } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import {
  Sparkles,
  Clock,
  Coffee,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  Check,
  Target,
  Timer,
  Brain,
  ListChecks,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { AppText } from "@/src/components/atoms/text";
import { StepBadge } from "@/src/components/atoms/StepBadge";
import {
  AISessionPlanningStepProps,
  ScheduleBlock,
} from "@/src/types/Focus";

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

interface FocusBlockData {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  totalDuration: number;
  focusDuration: number;
  breakDuration: number;
  breakCount: number;
  priority?: string;
  taskName?: string;
  segments: {
    type: "focus" | "break";
    duration: number;
  }[];
}

// Transform flat schedule into focus blocks with embedded breaks
function transformToFocusBlocks(schedule: ScheduleBlock[]): FocusBlockData[] {
  const blocks: FocusBlockData[] = [];
  let currentBlock: FocusBlockData | null = null;

  schedule.forEach((item, index) => {
    if (item.type === "task") {
      // Save previous block if exists
      if (currentBlock) {
        blocks.push(currentBlock);
      }

      // Start new focus block
      currentBlock = {
        id: item.id,
        title: item.title,
        startTime: item.startTime,
        endTime: item.endTime,
        totalDuration: item.durationMinutes,
        focusDuration: item.durationMinutes,
        breakDuration: 0,
        breakCount: 0,
        priority: item.priority,
        taskName: item.title,
        segments: [{ type: "focus", duration: item.durationMinutes }],
      };
    } else if (currentBlock) {
      // Add break to current block
      currentBlock.breakDuration += item.durationMinutes;
      currentBlock.breakCount += 1;
      currentBlock.totalDuration += item.durationMinutes;
      currentBlock.endTime = item.endTime;
      currentBlock.segments.push({
        type: "break",
        duration: item.durationMinutes,
      });
    }
  });

  // Don't forget the last block
  if (currentBlock) {
    blocks.push(currentBlock);
  }

  return blocks;
}

interface FocusBlockCardProps {
  block: FocusBlockData;
  index: number;
  isLast: boolean;
}

const FocusBlockCard = memo(function FocusBlockCard({
  block,
  index,
  isLast,
}: FocusBlockCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded(!isExpanded);
  };

  const rotation = useDerivedValue(() => {
    return withTiming(isExpanded ? 180 : 0, { duration: 200 });
  }, [isExpanded]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const priorityColors: Record<string, { bg: string; text: string }> = {
    urgent: { bg: "#ef444425", text: "#ef4444" },
    high: { bg: "#f59e0b25", text: "#f59e0b" },
    normal: { bg: "#3b82f625", text: "#3b82f6" },
    low: { bg: "#71717a25", text: "#71717a" },
  };

  const priority = block.priority ? priorityColors[block.priority] : null;

  return (
    <View className="mb-4">
      {/* Time Label */}
      <View className="flex-row items-center mb-2 ml-1">
        <AppText
          variant="body-sm"
          color="tertiary"
          content={formatTime(block.startTime)}
        />
        <View className="flex-1 h-px bg-white/10 ml-3" />
      </View>

      {/* Main Card */}
      <Pressable onPress={toggleExpand}>
        <View
          className="rounded-3xl overflow-hidden border"
          style={{
            backgroundColor: "#ffffff08",
            borderColor: isExpanded ? "#3b82f640" : "#ffffff15",
          }}
        >
          <BlurView intensity={15} tint="dark">
            <View className="p-5">
              {/* Header */}
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-3">
                  {/* Block Number & Priority */}
                  <View className="flex-row items-center gap-2 mb-2">
                    <View className="bg-electricBlue/20 rounded-full px-3 py-1">
                      <AppText
                        variant="caption"
                        content={`Block ${index + 1}`}
                        style={{ color: "#3b82f6" }}
                      />
                    </View>
                    {priority && (
                      <View
                        className="rounded-full px-3 py-1"
                        style={{ backgroundColor: priority.bg }}
                      >
                        <AppText
                          variant="caption"
                          content={block.priority!}
                          style={{ color: priority.text }}
                          className="capitalize"
                        />
                      </View>
                    )}
                  </View>

                  {/* Title */}
                  <AppText
                    variant="h4"
                    content={block.title}
                    className="mb-3"
                  />

                  {/* Quick Stats Row */}
                  <View className="flex-row items-center gap-4">
                    <View className="flex-row items-center gap-1.5">
                      <Timer size={14} color="#3b82f6" />
                      <AppText
                        variant="body-sm"
                        content={formatDuration(block.focusDuration)}
                        style={{ color: "#3b82f6" }}
                      />
                    </View>
                    {block.breakCount > 0 && (
                      <View className="flex-row items-center gap-1.5">
                        <Coffee size={14} color="#22c55e" />
                        <AppText
                          variant="body-sm"
                          content={`${block.breakCount} break${block.breakCount > 1 ? "s" : ""}`}
                          style={{ color: "#22c55e" }}
                        />
                      </View>
                    )}
                  </View>
                </View>

                {/* Duration & Expand */}
                <View className="items-end">
                  <View className="bg-white/10 rounded-2xl px-4 py-2 mb-2">
                    <AppText
                      variant="h4"
                      content={formatDuration(block.totalDuration)}
                    />
                  </View>
                  <Animated.View style={chevronStyle}>
                    <ChevronDown size={20} color="#71717a" />
                  </Animated.View>
                </View>
              </View>

              {/* Expanded Content */}
              {isExpanded && (
                <Animated.View
                  entering={FadeIn.duration(200)}
                  className="mt-4 pt-4 border-t border-white/10"
                >
                  {/* Session Breakdown */}
                  <View className="mb-4">
                    <AppText
                      variant="label"
                      color="secondary"
                      content="Session Breakdown"
                      className="mb-3"
                    />

                    {/* Visual Timeline */}
                    <View className="flex-row h-3 rounded-full overflow-hidden mb-3">
                      {block.segments.map((segment, i) => (
                        <View
                          key={i}
                          style={{
                            flex: segment.duration,
                            backgroundColor:
                              segment.type === "focus" ? "#3b82f6" : "#22c55e",
                            marginLeft: i > 0 ? 2 : 0,
                          }}
                        />
                      ))}
                    </View>

                    {/* Segment Details */}
                    <View className="gap-2">
                      {block.segments.map((segment, i) => (
                        <View
                          key={i}
                          className="flex-row items-center justify-between bg-white/5 rounded-xl px-4 py-3"
                        >
                          <View className="flex-row items-center gap-3">
                            <View
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor:
                                  segment.type === "focus"
                                    ? "#3b82f6"
                                    : "#22c55e",
                              }}
                            />
                            <View className="flex-row items-center gap-2">
                              {segment.type === "focus" ? (
                                <Target size={16} color="#3b82f6" />
                              ) : (
                                <Coffee size={16} color="#22c55e" />
                              )}
                              <AppText
                                variant="body"
                                content={
                                  segment.type === "focus"
                                    ? "Deep Focus"
                                    : "Regenerative Break"
                                }
                              />
                            </View>
                          </View>
                          <AppText
                            variant="body"
                            color="secondary"
                            content={`${segment.duration} min`}
                          />
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Additional Info */}
                  <View className="bg-purple-500/10 rounded-2xl p-4">
                    <View className="flex-row items-center gap-2 mb-2">
                      <Brain size={16} color="#a855f7" />
                      <AppText
                        variant="label"
                        content="AI Insight"
                        style={{ color: "#a855f7" }}
                      />
                    </View>
                    <AppText
                      variant="body-sm"
                      color="secondary"
                      content={
                        block.breakCount > 0
                          ? `This block includes ${block.breakCount} strategic break${block.breakCount > 1 ? "s" : ""} to maintain peak focus. Short breaks improve concentration by up to 40%.`
                          : "This focused session is optimized for deep work. Consider adding a short break for sessions over 45 minutes."
                      }
                    />
                  </View>
                </Animated.View>
              )}
            </View>
          </BlurView>
        </View>
      </Pressable>

      {/* End Time for Last Block */}
      {isLast && (
        <View className="flex-row items-center mt-4 ml-1">
          <AppText
            variant="body-sm"
            color="tertiary"
            content={formatTime(block.endTime)}
          />
          <View className="flex-1 h-px bg-white/10 ml-3 mr-3" />
          <View className="flex-row items-center gap-2 bg-green-500/15 rounded-full px-4 py-2">
            <Check size={16} color="#22c55e" />
            <AppText
              variant="body"
              content="Session Complete"
              style={{ color: "#22c55e" }}
            />
          </View>
        </View>
      )}
    </View>
  );
});

export const AISessionPlanningStep = memo(function AISessionPlanningStep({
  schedule,
  isLoading,
  error,
  onReorder,
  onRegenerateSchedule,
  durationText,
  startTimeDisplay,
  hasBrainDump,
}: AISessionPlanningStepProps) {
  const focusBlocks = schedule
    ? transformToFocusBlocks(schedule.schedule)
    : [];

  return (
    <View className="flex-1">
      <StepBadge
        icon={<Sparkles size={14} color="#a855f7" fill="#a855f7" />}
        label="Your Schedule"
        variant="purple"
        className="mt-2 mb-4"
      />

      {/* Title */}
      <View className="mb-3">
        <AppText
          variant="h3"
          content={hasBrainDump ? "Your Optimized Schedule" : "Focus Schedule"}
          center
          className="mb-1"
        />
        <AppText
          variant="body-sm"
          color="tertiary"
          center
          content={
            hasBrainDump
              ? "AI organized your tasks with strategic breaks"
              : "Deep focus blocks with regenerative breaks"
          }
        />
      </View>

      {/* Session Overview */}
      <View className="flex-row justify-center gap-3 mb-4">
        <View className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex-row items-center gap-2">
          <Clock size={14} color="#71717a" />
          <AppText variant="body-sm" color="secondary" content={durationText} />
        </View>
        <View className="bg-white/5 border border-white/10 rounded-full px-4 py-2">
          <AppText
            variant="body-sm"
            color="secondary"
            content={`Starts ${startTimeDisplay}`}
          />
        </View>
      </View>

      {/* Loading State */}
      {isLoading && (
        <Animated.View entering={FadeIn.duration(200)} className="flex-1">
          <View className="overflow-hidden rounded-3xl border border-purple-500/20">
            <BlurView
              intensity={20}
              tint="dark"
              style={{ padding: 48, alignItems: "center" }}
            >
              <View className="bg-purple-500/20 rounded-full p-5 mb-5">
                <ActivityIndicator size="large" color="#a855f7" />
              </View>
              <AppText
                variant="h3"
                content="Creating your schedule..."
                center
                className="mb-2"
              />
              <AppText
                variant="body"
                color="tertiary"
                content="AI is organizing your focus blocks"
                center
              />
            </BlurView>
          </View>
        </Animated.View>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Animated.View entering={FadeIn.duration(200)}>
          <View className="overflow-hidden rounded-3xl border border-red-500/20">
            <BlurView
              intensity={20}
              tint="dark"
              style={{ padding: 40, alignItems: "center" }}
            >
              <View className="bg-red-500/20 rounded-full p-5 mb-5">
                <AlertCircle size={32} color="#ef4444" />
              </View>
              <AppText
                variant="h4"
                color="error"
                content="Something went wrong"
                center
                className="mb-2"
              />
              <AppText
                variant="body"
                color="tertiary"
                content={error}
                center
                className="mb-5"
              />
              <Pressable
                onPress={onRegenerateSchedule}
                className="bg-white/10 rounded-full px-6 py-3 flex-row items-center gap-2"
              >
                <RefreshCw size={18} color="#ffffff" />
                <AppText variant="body" content="Try Again" />
              </Pressable>
            </BlurView>
          </View>
        </Animated.View>
      )}

      {/* Schedule Content */}
      {schedule && !isLoading && !error && (
        <Animated.View entering={FadeIn.duration(200)} className="flex-1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {/* Tap Hint */}
            <View className="flex-row items-center justify-center gap-2 mb-4">
              <ListChecks size={14} color="#71717a" />
              <AppText
                variant="body-sm"
                color="tertiary"
                content="Tap a block to see details"
              />
            </View>

            {/* Focus Blocks */}
            {focusBlocks.map((block, index) => (
              <FocusBlockCard
                key={block.id}
                block={block}
                index={index}
                isLast={index === focusBlocks.length - 1}
              />
            ))}

            {/* Summary */}
            {schedule.summary && (
              <View className="overflow-hidden rounded-3xl border border-white/10 mt-2">
                <BlurView intensity={20} tint="dark" style={{ padding: 20 }}>
                  <View className="flex-row justify-around mb-4">
                    <View className="items-center">
                      <AppText
                        variant="h2"
                        color="blue"
                        content={`${schedule.summary.totalFocusMinutes}`}
                      />
                      <AppText
                        variant="body-sm"
                        color="tertiary"
                        content="min focus"
                      />
                    </View>
                    <View className="w-px bg-white/10" />
                    <View className="items-center">
                      <AppText
                        variant="h2"
                        color="success"
                        content={`${schedule.summary.totalBreakMinutes}`}
                      />
                      <AppText
                        variant="body-sm"
                        color="tertiary"
                        content="min breaks"
                      />
                    </View>
                    <View className="w-px bg-white/10" />
                    <View className="items-center">
                      <AppText
                        variant="h2"
                        content={`${focusBlocks.length}`}
                      />
                      <AppText
                        variant="body-sm"
                        color="tertiary"
                        content="blocks"
                      />
                    </View>
                  </View>

                  {schedule.summary.suggestion && (
                    <View className="bg-purple-500/10 rounded-2xl p-4 flex-row items-start gap-3">
                      <Sparkles size={18} color="#a855f7" fill="#a855f7" />
                      <AppText
                        variant="body"
                        color="secondary"
                        content={schedule.summary.suggestion}
                        className="flex-1"
                      />
                    </View>
                  )}
                </BlurView>
              </View>
            )}

            {/* Regenerate */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onRegenerateSchedule();
              }}
              className="mt-5 flex-row items-center justify-center gap-2 py-3"
            >
              <RefreshCw size={16} color="#71717a" />
              <AppText
                variant="body-sm"
                color="tertiary"
                content="Regenerate Schedule"
              />
            </Pressable>
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
});
