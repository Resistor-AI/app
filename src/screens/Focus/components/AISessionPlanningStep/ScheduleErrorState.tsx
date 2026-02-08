import { View, Pressable } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { AlertCircle, RefreshCw } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import { ScheduleErrorStateProps } from "@/src/types/Focus/AISessionPlanningStep";

export function ScheduleErrorState({ error, onRetry }: ScheduleErrorStateProps) {
  return (
    <Animated.View entering={FadeIn.duration(200)}>
      <View className="overflow-hidden rounded-3xl border border-red-500/20">
        <BlurView
          intensity={20}
          tint="dark"
          style={{ padding: 40, alignItems: "center" }}
        >
          <View className="bg-red-500/20 rounded-full p-5 mb-5">
            <AlertCircle size={32} color="#ef4444" />
          </View>
          <AppText
            variant="h4"
            color="error"
            content="Something went wrong"
            center
            className="mb-2"
          />
          <AppText
            variant="body"
            color="tertiary"
            content={error}
            center
            className="mb-5"
          />
          <Pressable
            onPress={onRetry}
            className="bg-white/10 rounded-full px-6 py-3 flex-row items-center gap-2"
          >
            <RefreshCw size={18} color="#ffffff" />
            <AppText variant="body" content="Try Again" />
          </Pressable>
        </BlurView>
      </View>
    </Animated.View>
  );
}
