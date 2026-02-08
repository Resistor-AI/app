import { View, TextInput, Pressable } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import { COLORS } from "@/src/constants/colors";
import { useWrittenJustification } from "@/src/hooks/block/useWrittenJustification";
import { JustificationStepProps } from "@/src/types/Block/components";

const MIN_CHARS = 100;

function CharCounter({ count }: { count: number }) {
  const isMet = count >= MIN_CHARS;
  return (
    <AppText
      variant="body-sm"
      style={{ color: isMet ? "#FFFFFF" : COLORS.textTertiary }}
      className="text-right mt-2"
    >
      {count}/{MIN_CHARS}
    </AppText>
  );
}

export function JustificationStep({ appName, mode, onComplete }: JustificationStepProps) {
  const {
    text,
    handleChange,
    charCount,
    isValid,
    validationMessage,
  } = useWrittenJustification();

  const isEndSession = mode === "end_session";
  const prompt = isEndSession
    ? "Explain why ending your session right now is necessary."
    : `Explain why checking ${appName} right now is urgent enough to break your commitment to focus.`;

  return (
    <View className="flex-1 pt-6">
      <AppText variant="h3" className="text-white mb-2">
        Justify yourself
      </AppText>
      <AppText variant="body-sm" color="secondary" className="mb-6">
        {prompt}
      </AppText>

      <TextInput
        value={text}
        onChangeText={handleChange}
        placeholder="I need to open this app because..."
        placeholderTextColor="rgba(255,255,255,0.2)"
        className="rounded-2xl bg-white/[0.05] border border-white/[0.08] px-4 py-4 text-white text-base"
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        style={{ minHeight: 160 }}
        autoCorrect={false}
        spellCheck={false}
        textContentType="none"
        contextMenuHidden
      />

      <CharCounter count={charCount} />

      {!isValid && charCount >= MIN_CHARS && validationMessage && (
        <AppText variant="body-sm" className="text-red-400 mt-1">
          {validationMessage}
        </AppText>
      )}

      <Pressable
        onPress={onComplete}
        disabled={!isValid}
        className="mt-4 rounded-full py-4 items-center"
        style={{
          backgroundColor: isValid ? "#FFFFFF" : "rgba(255,255,255,0.05)",
        }}
      >
        <AppText
          variant="body"
          className="font-semibold"
          style={{ color: isValid ? "#050505" : "rgba(255,255,255,0.3)" }}
        >
          Continue
        </AppText>
      </Pressable>
    </View>
  );
}
