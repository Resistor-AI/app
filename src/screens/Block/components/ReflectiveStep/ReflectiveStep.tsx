import { useEffect } from "react";
import { View, TextInput } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import { useReflectiveStatement } from "@/src/hooks/block/useReflectiveStatement";
import { ReflectiveStepProps } from "@/src/types/Block/components";
import { COLORS } from "@/src/constants/colors";
import { StatementDisplay } from "./StatementDisplay";

function ProgressBar({ progress }: { progress: number }) {
  return (
    <View className="h-1 rounded-full bg-white/5 mt-4 overflow-hidden">
      <View
        className="h-full rounded-full"
        style={{
          width: `${Math.min(progress * 100, 100)}%`,
          backgroundColor: COLORS.textPrimary,
        }}
      />
    </View>
  );
}

export function ReflectiveStep({ context, onComplete }: ReflectiveStepProps) {
  const {
    targetText,
    typedText,
    handleTextChange,
    isComplete,
    progress,
  } = useReflectiveStatement(context);

  useEffect(() => {
    if (isComplete) {
      const timeout = setTimeout(onComplete, 600);
      return () => clearTimeout(timeout);
    }
  }, [isComplete, onComplete]);

  return (
    <View className="flex-1 pt-6">
      <AppText variant="h3" className="text-white mb-2">
        Type this statement
      </AppText>
      <AppText variant="body-sm" color="secondary" className="mb-6">
        Acknowledge what you are choosing to do.
      </AppText>

      <View className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 mb-4">
        <StatementDisplay targetText={targetText} typedText={typedText} />
      </View>

      <TextInput
        value={typedText}
        onChangeText={handleTextChange}
        placeholder="Start typing..."
        placeholderTextColor="rgba(255,255,255,0.2)"
        className="rounded-2xl bg-white/[0.05] border border-white/[0.08] px-4 py-4 text-white text-base"
        autoCorrect={false}
        spellCheck={false}
        textContentType="none"
        contextMenuHidden
        autoFocus
        multiline
      />

      <ProgressBar progress={progress} />

      <AppText variant="body-sm" color="tertiary" className="text-center mt-2">
        {Math.round(progress * 100)}% complete
      </AppText>
    </View>
  );
}
