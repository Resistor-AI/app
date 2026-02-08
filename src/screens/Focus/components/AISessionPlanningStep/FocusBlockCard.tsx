import { memo, useState } from "react";
import { View, Pressable } from "react-native";
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Coffee, ChevronDown, Timer } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { AppText } from "@/src/components/atoms/text";
import { FocusBlockCardProps } from "@/src/types/Focus/AISessionPlanningStep";
import { formatBlockTime, formatBlockDuration } from "@/src/lib/focus/focusBlockUtils";
import { FocusBlockExpanded } from "./FocusBlockExpanded";

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  urgent: { bg: "#ef444425", text: "#ef4444" },
  high: { bg: "#f59e0b25", text: "#f59e0b" },
  normal: { bg: "#3b82f625", text: "#3b82f6" },
  low: { bg: "#71717a25", text: "#71717a" },
};

export const FocusBlockCard = memo(function FocusBlockCard({
  block, index,
}: FocusBlockCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded(!isExpanded);
  };

  const rotation = useDerivedValue(() => withTiming(isExpanded ? 180 : 0, { duration: 200 }), [isExpanded]);
  const chevronStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));
  const priority = block.priority ? PRIORITY_COLORS[block.priority] : null;

  return (
    <View className="mb-4">
      <View className="flex-row items-center mb-2 ml-1">
        <AppText variant="body-sm" color="tertiary" content={formatBlockTime(block.startTime)} />
        <View className="flex-1 h-px bg-white/10 ml-3" />
      </View>

      <Pressable onPress={toggleExpand}>
        <View className="rounded-3xl overflow-hidden border" style={{ backgroundColor: "#ffffff08", borderColor: isExpanded ? "#3b82f640" : "#ffffff15" }}>
          <BlurView intensity={15} tint="dark">
            <View className="p-5">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center gap-2 mb-2">
                    <View className="bg-electricBlue/20 rounded-full px-3 py-1">
                      <AppText variant="caption" content={`Block ${index + 1}`} style={{ color: "#3b82f6" }} />
                    </View>
                    {priority && (
                      <View className="rounded-full px-3 py-1" style={{ backgroundColor: priority.bg }}>
                        <AppText variant="caption" content={block.priority!} style={{ color: priority.text }} className="capitalize" />
                      </View>
                    )}
                  </View>
                  <AppText variant="h4" content={block.title} className="mb-3" />
                  <View className="flex-row items-center gap-4">
                    <View className="flex-row items-center gap-1.5">
                      <Timer size={14} color="#3b82f6" />
                      <AppText variant="body-sm" content={formatBlockDuration(block.focusDuration)} style={{ color: "#3b82f6" }} />
                    </View>
                    {block.breakCount > 0 && (
                      <View className="flex-row items-center gap-1.5">
                        <Coffee size={14} color="#22c55e" />
                        <AppText variant="body-sm" content={`${block.breakCount} break${block.breakCount > 1 ? "s" : ""}`} style={{ color: "#22c55e" }} />
                      </View>
                    )}
                  </View>
                </View>
                <View className="items-end">
                  <View className="bg-white/10 rounded-2xl px-4 py-2 mb-2">
                    <AppText variant="h4" content={formatBlockDuration(block.totalDuration)} />
                  </View>
                  <Animated.View style={chevronStyle}>
                    <ChevronDown size={20} color="#71717a" />
                  </Animated.View>
                </View>
              </View>
              {isExpanded && <FocusBlockExpanded block={block} />}
            </View>
          </BlurView>
        </View>
      </Pressable>
    </View>
  );
});
