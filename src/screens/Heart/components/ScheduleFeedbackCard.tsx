import { View, TextInput, Pressable } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { AppText } from "@/src/components/atoms/text";
import { useScheduleFeedback } from "@/src/hooks/focus/useScheduleFeedback";
import { ScheduleFeedbackCardProps, StarRatingProps, FeedbackRating } from "@/src/types/Focus/ScheduleFeedback";

function StarRating({ rating, onRate, disabled }: StarRatingProps) {
  const handlePress = (value: FeedbackRating) => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRate(value);
  };

  return (
    <View className="flex-row gap-2 justify-center">
      {([1, 2, 3, 4, 5] as FeedbackRating[]).map((star) => (
        <Pressable
          key={star}
          onPress={() => handlePress(star)}
          disabled={disabled}
          hitSlop={8}
        >
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={32}
            color={star <= rating ? "#F59E0B" : "#ffffff40"}
          />
        </Pressable>
      ))}
    </View>
  );
}

export function ScheduleFeedbackCard({ traceId }: ScheduleFeedbackCardProps) {
  const feedback = useScheduleFeedback(traceId);

  if (!traceId) return null;

  if (feedback.isSubmitted) {
    return (
      <Animated.View entering={FadeIn.duration(400)} className="mt-6 items-center">
        <Ionicons name="checkmark-circle" size={28} color="#4ADE80" />
        <AppText variant="caption" color="secondary" className="mt-1">
          Thanks for your feedback!
        </AppText>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn.delay(1800).duration(500)} className="mt-6 px-2">
      <AppText variant="h5" center className="text-white/80 mb-3">
        How was your AI schedule?
      </AppText>
      <StarRating
        rating={feedback.rating}
        onRate={(r: FeedbackRating) => feedback.setRating(r)}
        disabled={feedback.isSubmitting}
      />
      {feedback.rating > 0 && (
        <Animated.View entering={FadeIn.duration(300)} className="mt-3 gap-3">
          <TextInput
            className="bg-white/10 rounded-xl px-4 py-3 text-white text-sm"
            placeholder="Any comments? (optional)"
            placeholderTextColor="#ffffff50"
            value={feedback.comment}
            onChangeText={feedback.setComment}
            multiline
            maxLength={280}
          />
          <Pressable
            className="bg-white/20 rounded-xl py-3 items-center"
            onPress={feedback.submitFeedback}
            disabled={feedback.isSubmitting}
          >
            <AppText variant="body" className="text-white font-semibold">
              {feedback.isSubmitting ? "Submitting..." : "Submit"}
            </AppText>
          </Pressable>
        </Animated.View>
      )}
    </Animated.View>
  );
}
