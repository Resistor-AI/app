import { View, TextInput } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/atoms/text";
import { ChallengeSectionProps } from "@/src/types/Focus/EnhancedFrictionModal";

export function ChallengeSection({
  challenge, challengeAnswer, isAnswerCorrect, onAnswerChange,
}: ChallengeSectionProps) {
  return (
    <View className="mt-6 mb-6">
      <AppText variant="h2" className="text-center text-white tracking-widest mb-5">
        {challenge.question} = ?
      </AppText>

      <View className="flex-row items-center rounded-2xl bg-white/[0.05] border border-white/[0.08] px-4">
        <TextInput
          keyboardType="number-pad"
          className="flex-1 text-center text-white text-xl font-semibold py-4"
          placeholder="Answer"
          placeholderTextColor="rgba(255, 255, 255, 0.2)"
          value={challengeAnswer}
          onChangeText={onAnswerChange}
          autoFocus
        />
        {isAnswerCorrect && (
          <Animated.View entering={FadeIn.duration(200)}>
            <Ionicons name="checkmark-circle" size={22} color="#34d399" />
          </Animated.View>
        )}
      </View>
    </View>
  );
}
