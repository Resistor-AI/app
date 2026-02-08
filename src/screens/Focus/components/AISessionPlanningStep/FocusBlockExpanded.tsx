import { View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Target, Coffee, Brain } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import { FocusBlockExpandedProps } from "@/src/types/Focus/AISessionPlanningStep";

export function FocusBlockExpanded({ block }: FocusBlockExpandedProps) {
  return (
    <Animated.View entering={FadeIn.duration(200)} className="mt-4 pt-4 border-t border-white/10">
      {block.notes && (
        <View className="bg-white/5 rounded-xl px-4 py-3 mb-4">
          <AppText variant="body-sm" color="secondary" content={block.notes} />
        </View>
      )}

      <AppText variant="label" color="secondary" content="Session Breakdown" className="mb-3" />

      <SegmentBar segments={block.segments} />

      <View className="gap-2 mb-4">
        {block.segments.map((segment, i) => (
          <SegmentRow key={i} segment={segment} />
        ))}
      </View>

      <AiInsightCard breakCount={block.breakCount} />
    </Animated.View>
  );
}

function SegmentBar({ segments }: { segments: FocusBlockExpandedProps["block"]["segments"] }) {
  return (
    <View className="flex-row h-3 rounded-full overflow-hidden mb-3">
      {segments.map((segment, i) => (
        <View
          key={i}
          style={{
            flex: segment.duration,
            backgroundColor: segment.type === "focus" ? "#3b82f6" : "#22c55e",
            marginLeft: i > 0 ? 2 : 0,
          }}
        />
      ))}
    </View>
  );
}

function SegmentRow({ segment }: { segment: FocusBlockExpandedProps["block"]["segments"][number] }) {
  const isFocus = segment.type === "focus";
  const color = isFocus ? "#3b82f6" : "#22c55e";
  const label = isFocus ? "Deep Focus" : (segment.title ?? "Break");

  return (
    <View className="flex-row items-center justify-between bg-white/5 rounded-xl px-4 py-3">
      <View className="flex-row items-center gap-3 flex-1 mr-2">
        <View className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <View className="flex-row items-center gap-2">
          {isFocus ? <Target size={16} color={color} /> : <Coffee size={16} color={color} />}
          <AppText variant="body" content={label} />
        </View>
      </View>
      <AppText variant="body" color="secondary" content={`${segment.duration} min`} />
    </View>
  );
}

function AiInsightCard({ breakCount }: { breakCount: number }) {
  const insight = breakCount > 0
    ? `This block includes ${breakCount} strategic break${breakCount > 1 ? "s" : ""} to maintain peak focus.`
    : "This focused session is optimized for deep work.";

  return (
    <View className="bg-purple-500/10 rounded-2xl p-4">
      <View className="flex-row items-center gap-2 mb-2">
        <Brain size={16} color="#a855f7" />
        <AppText variant="label" content="AI Insight" style={{ color: "#a855f7" }} />
      </View>
      <AppText variant="body-sm" color="secondary" content={insight} />
    </View>
  );
}
