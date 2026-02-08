import { memo } from "react";
import { View, TextInput } from "react-native";
import { BlurView } from "expo-blur";
import { Zap, Clock } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import { StepBadge } from "@/src/components/atoms/StepBadge";
import { BrainDumpStepProps } from "@/src/types/Focus/SessionSetup";

export const BrainDumpStep = memo(function BrainDumpStep({
  brainDump,
  onBrainDumpChange,
  durationText,
  startTimeDisplay,
}: BrainDumpStepProps) {
  return (
    <View>
      <StepBadge
        icon={<Zap size={14} color="#ffffff" fill="#ffffff" />}
        label="Plan Your Focus"
        variant="white"
        className="mt-4 mb-8"
      />

      {/* Title Section */}
      <View className="mb-6">
        <AppText
          variant="h3"
          content="What do you want to accomplish?"
          center
          className="mb-2"
        />
        <AppText
          variant="body-sm"
          color="tertiary"
          center
          content="Write down everything you want to get done"
        />
      </View>

      {/* Text Input Card */}
      <View className="overflow-hidden rounded-3xl border border-white/20 mb-4">
        <BlurView intensity={30} tint="dark" style={{ padding: 4 }}>
          <View className="bg-white/5 rounded-2xl p-4">
            <TextInput
              multiline
              value={brainDump}
              onChangeText={onBrainDumpChange}
              placeholder="Finish my report (urgent), reply to emails, prepare for tomorrow's meeting (important), read chapter 5 if time permits..."
              placeholderTextColor="#71717a"
              cursorColor="#ffffff"
              selectionColor="#ffffff50"
              className="text-base text-white min-h-[150px]"
              textAlignVertical="top"
              autoFocus
            />
          </View>
        </BlurView>
      </View>

      {/* AI Hint */}
      <View className="flex-row items-center justify-center gap-2 mb-6">
        <View className="h-px flex-1 bg-zinc-800" />
        <View className="flex-row items-center gap-1.5 px-3">
          <Zap size={12} color="#3b82f6" fill="#3b82f6" />
          <AppText
            variant="caption"
            color="tertiary"
            content="AI will organize these into tasks"
          />
        </View>
        <View className="h-px flex-1 bg-zinc-800" />
      </View>

      {/* Session Summary */}
      <View className="overflow-hidden rounded-2xl border border-white/10">
        <BlurView intensity={20} tint="dark" style={{ padding: 20 }}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="bg-electricBlue/15 rounded-full p-3">
                <Clock size={20} color="#3b82f6" />
              </View>
              <View>
                <AppText variant="h4" content={durationText} />
                <AppText
                  variant="caption"
                  color="tertiary"
                  content="Focus Duration"
                />
              </View>
            </View>
            <View className="items-end">
              <AppText variant="h5" content={startTimeDisplay} />
              <AppText variant="caption" color="tertiary" content="Start Time" />
            </View>
          </View>
        </BlurView>
      </View>
    </View>
  );
});
