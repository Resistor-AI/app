import { useState, useEffect } from "react";
import { View, TextInput, Pressable } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { COLORS } from "@/src/constants/colors";
import { WordRecallChallengeProps } from "@/src/types/Block/components";

function MemorizePhase({ words }: { words: string[] }) {
  return (
    <Animated.View entering={FadeIn.duration(300)} className="items-center">
      <AppText variant="body-sm" color="secondary" className="mb-4">
        Memorize these words
      </AppText>
      <View className="flex-row flex-wrap justify-center gap-3">
        {words.map((word) => (
          <View
            key={word}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.05]"
          >
            <AppText variant="h4" className="text-white">
              {word}
            </AppText>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

function RecallPhase({
  words,
  answers,
  onAnswerChange,
  onSubmit,
}: {
  words: string[];
  answers: string[];
  onAnswerChange: (idx: number, text: string) => void;
  onSubmit: () => void;
}) {
  const allFilled = answers.every((a) => a.trim().length > 0);

  return (
    <Animated.View entering={FadeIn.duration(300)}>
      <AppText variant="body-sm" color="secondary" className="mb-4">
        Type back all {words.length} words (any order)
      </AppText>
      <View className="gap-3">
        {words.map((_, i) => (
          <TextInput
            key={i}
            value={answers[i]}
            onChangeText={(t) => onAnswerChange(i, t)}
            placeholder={`Word ${i + 1}`}
            placeholderTextColor="rgba(255,255,255,0.2)"
            className="rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-3 text-white"
            autoCorrect={false}
            spellCheck={false}
            textContentType="none"
            contextMenuHidden
            autoCapitalize="none"
          />
        ))}
      </View>
      <Pressable
        onPress={onSubmit}
        disabled={!allFilled}
        className="mt-4 rounded-full py-4 items-center"
        style={{
          backgroundColor: allFilled ? "#FFFFFF" : "rgba(255,255,255,0.05)",
        }}
      >
        <AppText variant="body" className="font-semibold" style={{ color: "#050505" }}>
          Submit
        </AppText>
      </Pressable>
    </Animated.View>
  );
}

export function WordRecallChallengeView({
  challenge,
  phase,
  onSuccess,
  onFail,
}: WordRecallChallengeProps) {
  const [answers, setAnswers] = useState<string[]>(
    () => Array(challenge.words.length).fill(""),
  );

  useEffect(() => {
    if (phase === "memorize") setAnswers(Array(challenge.words.length).fill(""));
  }, [phase, challenge.words.length]);

  const handleAnswerChange = (idx: number, text: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = text;
      return next;
    });
  };

  const handleSubmit = () => {
    const target = new Set(challenge.words.map((w) => w.toLowerCase()));
    const given = new Set(answers.map((a) => a.trim().toLowerCase()));
    const allMatch = [...target].every((w) => given.has(w));
    allMatch ? onSuccess() : onFail();
  };

  if (phase === "memorize") {
    return <MemorizePhase words={challenge.words} />;
  }

  return (
    <RecallPhase
      words={challenge.words}
      answers={answers}
      onAnswerChange={handleAnswerChange}
      onSubmit={handleSubmit}
    />
  );
}
