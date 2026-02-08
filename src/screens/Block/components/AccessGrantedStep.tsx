import { useEffect, useState, useRef } from "react";
import { View } from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/atoms/text";
import { COLORS } from "@/src/constants/colors";
import { AccessGrantedStepProps } from "@/src/types/Block/components";

const COUNTDOWN_FROM = 3;

export function AccessGrantedStep({ context, onUnlock }: AccessGrantedStepProps) {
  const [countdown, setCountdown] = useState(COUNTDOWN_FROM);
  const calledRef = useRef(false);
  const isEndSession = context.mode === "end_session";

  useEffect(() => {
    if (countdown <= 0 && !calledRef.current) {
      calledRef.current = true;
      onUnlock();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, onUnlock]);

  return (
    <View className="flex-1 pt-12 items-center">
      <Animated.View
        entering={ZoomIn.duration(400)}
        className="size-20 rounded-full items-center justify-center mb-6"
        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
      >
        <Ionicons name="checkmark" size={40} color="#FFFFFF" />
      </Animated.View>

      <Animated.View entering={FadeIn.delay(200).duration(300)} className="items-center">
        <AppText variant="h2" className="text-white mb-2">
          {isEndSession ? "Session ending" : "Access granted"}
        </AppText>
        <AppText variant="body" color="secondary" className="mb-1">
          {isEndSession ? "Your session will end now" : "2 minutes of temporary access"}
        </AppText>
        <AppText variant="body-sm" color="tertiary">
          {context.remainingMinutes} minutes of focus sacrificed
        </AppText>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(600).duration(300)} className="mt-8">
        <AppText variant="h3" className="text-white">
          {isEndSession ? "Ending" : "Opening"} in {countdown}...
        </AppText>
      </Animated.View>
    </View>
  );
}
