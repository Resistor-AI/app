import { View } from "react-native";
import { Target, Zap, Clock } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import { GlassCard } from "@/src/components/molecules/GlassCard";
import { SessionInfoCardProps } from "@/src/types/Focus/components";

export function SessionInfoCard({
  taskName,
  currentBlock,
  totalBlocks,
  totalTimeMinutes,
}: SessionInfoCardProps) {
  return (
    <GlassCard className="mx-6 bg-zinc-900/60">
      <View className="flex-row items-center">
        {/* Task Column */}
        <View className="flex-1 items-center">
          <View className="flex-row items-center gap-2 mb-1">
            <Target size={14} color="#0A84FF" />
            <AppText variant="caption" color="tertiary" className="uppercase tracking-widest">
              Task
            </AppText>
          </View>
          <AppText
            variant="body-sm"
            className="text-center"
            numberOfLines={1}
          >
            {taskName}
          </AppText>
        </View>

        {/* Divider */}
        <View className="w-[1px] h-10 bg-white/10" />

        {/* Blocks Column */}
        <View className="flex-1 items-center">
          <View className="flex-row items-center gap-2 mb-1">
            <Zap size={14} color="#F59E0B" fill="#F59E0B" />
            <AppText variant="caption" color="tertiary" className="uppercase tracking-widest">
              Blocks
            </AppText>
          </View>
          <AppText variant="body-sm">
            {currentBlock}/{totalBlocks}
          </AppText>
        </View>

        {/* Divider */}
        <View className="w-[1px] h-10 bg-white/10" />

        {/* Session Time Column */}
        <View className="flex-1 items-center">
          <View className="flex-row items-center gap-2 mb-1">
            <Clock size={14} color="#BF5AF2" />
            <AppText variant="caption" color="tertiary" className="uppercase tracking-widest">
              Total
            </AppText>
          </View>
          <AppText variant="body-sm">
            {totalTimeMinutes} min
          </AppText>
        </View>
      </View>
    </GlassCard>
  );
}
