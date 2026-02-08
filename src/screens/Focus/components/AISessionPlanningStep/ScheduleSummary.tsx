import { View } from "react-native";
import { BlurView } from "expo-blur";
import { Sparkles, AlertTriangle } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import { ScheduleSummaryProps } from "@/src/types/Focus/AISessionPlanningStep";

export function ScheduleSummary({
  totalFocusMinutes,
  totalBreakMinutes,
  focusBlockCount,
  totalTasks,
  scheduledTasks,
  unscheduledTasks,
  suggestion,
}: ScheduleSummaryProps) {
  return (
    <View className="overflow-hidden rounded-3xl border border-white/10 mt-2">
      <BlurView intensity={20} tint="dark" style={{ padding: 20 }}>
        <View className="flex-row justify-around mb-4">
          <SummaryStatItem value={`${totalFocusMinutes}`} label="min focus" color="#3b82f6" />
          <View className="w-px bg-white/10" />
          <SummaryStatItem value={`${totalBreakMinutes}`} label="min breaks" color="#22c55e" />
          <View className="w-px bg-white/10" />
          <SummaryStatItem value={`${scheduledTasks}/${totalTasks}`} label="tasks" />
        </View>

        {unscheduledTasks.length > 0 && (
          <UnscheduledTasksList tasks={unscheduledTasks} />
        )}

        {suggestion && (
          <View className="bg-purple-500/10 rounded-2xl p-4 flex-row items-start gap-3">
            <Sparkles size={18} color="#a855f7" fill="#a855f7" />
            <AppText variant="body" color="secondary" content={suggestion} className="flex-1" />
          </View>
        )}
      </BlurView>
    </View>
  );
}

function SummaryStatItem({ value, label, color }: { value: string; label: string; color?: string }) {
  return (
    <View className="items-center">
      <AppText variant="h2" content={value} style={color ? { color } : undefined} />
      <AppText variant="body-sm" color="tertiary" content={label} />
    </View>
  );
}

function UnscheduledTasksList({ tasks }: { tasks: string[] }) {
  return (
    <View className="bg-amber-500/10 rounded-2xl p-4 mb-3">
      <View className="flex-row items-center gap-2 mb-2">
        <AlertTriangle size={16} color="#f59e0b" />
        <AppText variant="label" content="Didn't fit this session" style={{ color: "#f59e0b" }} />
      </View>
      {tasks.map((task) => (
        <View key={task} className="flex-row items-center gap-2 ml-6 mt-1">
          <View className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
          <AppText variant="body-sm" color="secondary" content={task} />
        </View>
      ))}
    </View>
  );
}
