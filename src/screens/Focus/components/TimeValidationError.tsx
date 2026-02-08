import { memo } from "react";
import { View } from "react-native";
import { AlertCircle } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import { TimeValidationErrorProps } from "@/src/types/Focus/SessionSetup";

export const TimeValidationError = memo(function TimeValidationError({
  message,
}: TimeValidationErrorProps) {
  return (
    <View className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex-row items-center gap-3 mb-4">
      <View className="bg-red-500/20 rounded-full p-1.5">
        <AlertCircle size={16} color="#ef4444" />
      </View>
      <AppText
        variant="body-sm"
        color="error"
        content={message}
        className="flex-1"
      />
    </View>
  );
});
