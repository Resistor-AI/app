import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { StarRatingProps } from "@/src/types/Focus/ScheduleFeedback";
import { FeedbackRating } from "@/src/types/Focus/ScheduleFeedback";

export function StarRating({ rating, onRate, disabled }: StarRatingProps) {
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
