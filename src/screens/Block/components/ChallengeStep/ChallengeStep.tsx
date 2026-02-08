import { View } from "react-native";
import * as Haptics from "expo-haptics";
import { AppText } from "@/src/components/atoms/text";
import { useMemoryChallenge } from "@/src/hooks/block/useMemoryChallenge";
import { ChallengeStepProps } from "@/src/types/Block/components";
import { COLOR_PALETTE } from "@/src/lib/focus/friction/challengeData";
import { WordRecallChallengeView } from "./WordRecallChallenge";
import { ColorSequenceChallengeView } from "./ColorSequenceChallenge";
import { GridPatternChallengeView } from "./GridPatternChallenge";

export function ChallengeStep({ onComplete }: ChallengeStepProps) {
  const { challenge, phase, retry } = useMemoryChallenge();

  const handleFail = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    retry();
  };

  return (
    <View className="flex-1 pt-6">
      <AppText variant="h3" className="text-white mb-2">
        Memory challenge
      </AppText>
      <AppText variant="body-sm" color="secondary" className="mb-6">
        Prove you are present and deliberate.
      </AppText>

      {challenge.type === "word_recall" && (
        <WordRecallChallengeView
          challenge={challenge}
          phase={phase}
          onSuccess={onComplete}
          onFail={handleFail}
        />
      )}
      {challenge.type === "color_sequence" && (
        <ColorSequenceChallengeView
          challenge={challenge}
          phase={phase}
          palette={COLOR_PALETTE}
          onSuccess={onComplete}
          onFail={handleFail}
        />
      )}
      {challenge.type === "grid_pattern" && (
        <GridPatternChallengeView
          challenge={challenge}
          phase={phase}
          onSuccess={onComplete}
          onFail={handleFail}
        />
      )}
    </View>
  );
}
