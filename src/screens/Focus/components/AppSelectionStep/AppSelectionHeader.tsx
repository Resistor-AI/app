import { memo } from "react";
import { View, Pressable } from "react-native";
import { Shield } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import { StepBadge } from "@/src/components/atoms/StepBadge";
import { AppSelectionHeaderProps } from "@/src/types/Focus/AppSelectionStep";

export const AppSelectionHeader = memo(function AppSelectionHeader({
  selectedCount, totalCount, durationText, onSelectAll, onDeselectAll,
}: AppSelectionHeaderProps) {
  return (
    <>
      <StepBadge
        icon={<Shield size={14} color="#ffffff" fill="#ffffff" />}
        label="Block Distractions"
        variant="white"
        className="mt-4 mb-6"
      />
      <View className="mb-4">
        <AppText variant="h3" content="Which apps should be blocked?" center className="mb-2" />
        <AppText
          variant="body-sm" color="tertiary" center
          content={`${selectedCount} of ${totalCount} apps selected for ${durationText}`}
        />
      </View>
      <View className="flex-row justify-center gap-3 mb-4">
        <Pressable onPress={onSelectAll} className="bg-white/5 border border-white/10 rounded-full px-4 py-2">
          <AppText variant="label" color="secondary" content="Select All" />
        </Pressable>
        <Pressable onPress={onDeselectAll} className="bg-white/5 border border-white/10 rounded-full px-4 py-2">
          <AppText variant="label" color="secondary" content="Defaults Only" />
        </Pressable>
      </View>
    </>
  );
});
