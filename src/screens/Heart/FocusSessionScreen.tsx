import { View, Pressable, Modal, TextInput } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  FadeIn,
  ZoomIn,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { BlurView } from "expo-blur";
import { COLORS } from "@/src/constants";

import { ROASTS } from "@/src/data/FocusSessionScreen";

export default function FocusSessionScreen() {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const duration = params.duration || "25";

  const [showFriction, setShowFriction] = useState(false);
  const [challengeAnswer, setChallengeAnswer] = useState("");
  const [roastIndex, setRoastIndex] = useState(0);

  const handleEndSession = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.replace("/(app)/(protected)/break");
  };

  const triggerFriction = () => {
    setRoastIndex(Math.floor(Math.random() * ROASTS.length));
    setChallengeAnswer("");
    setShowFriction(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: withRepeat(
      withSequence(
        withTiming(0.4, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    ),
  }));

  return (
    <View className="flex-1 bg-black items-center justify-center">
      <StatusBar style="light" />

      {/* Background Pulse */}
      <Animated.View
        className="absolute size-[500px] bg-electricBlue/10 rounded-full blur-[100px]"
        style={pulseStyle}
      />

      <Animated.View
        entering={FadeIn.duration(1000)}
        className="items-center w-full px-6"
      >
        <AppText
          variant="label"
          className="tracking-[0.5em] text-white/50 mb-12 uppercase"
        >
          Deep Work Session
        </AppText>

        <AppText className="text-9xl font-mono text-white font-bold mb-4 tracking-tighter">
          {duration}:00
        </AppText>

        <View className="bg-white/5 px-6 py-3 rounded-full border border-white/10 mb-20 items-center">
          <AppText
            variant="caption"
            color="secondary"
            className="mb-1 uppercase tracking-widest"
          >
            Active Task
          </AppText>
          <AppText variant="h6">🎯 API Integration</AppText>
        </View>

        {/* Test Friction Button (Simulation) */}
        <Pressable onPress={triggerFriction} className="mb-6 opacity-50">
          <AppText variant="caption" color="secondary" className="underline">
            Simulate Opening Instagram
          </AppText>
        </Pressable>

        <Pressable
          onPress={handleEndSession}
          className="bg-red-500/10 px-8 py-4 rounded-full border border-red-500/30 active:scale-95 transition-transform"
        >
          <AppText className="text-red-400 font-bold tracking-wide">
            END SESSION EARLY
          </AppText>
        </Pressable>
      </Animated.View>

      {/* Friction Modal with Roast */}
      <Modal visible={showFriction} transparent animationType="fade">
        <BlurView
          intensity={95}
          tint="dark"
          className="flex-1 items-center justify-center p-6"
        >
          <Animated.View
            entering={ZoomIn}
            className="bg-[#1A1A1A] w-full p-8 rounded-[32px] border-2 border-red-500/50 items-center"
          >
            <AppText className="text-6xl mb-6">😠</AppText>
            <AppText variant="h2" className="text-center mb-2 text-red-500">
              Wait.
            </AppText>

            {/* Roasting Text */}
            <AppText className="text-center mb-8 text-xl font-bold px-4 leading-8">
              "{ROASTS[roastIndex]}"
            </AppText>

            <AppText
              variant="caption"
              color="secondary"
              className="mb-4 uppercase tracking-widest"
            >
              Cognitive Challenge
            </AppText>
            <AppText variant="h1" className="mb-8 text-5xl font-mono">
              12 x 4 = ?
            </AppText>

            <TextInput
              keyboardType="number-pad"
              className="bg-white/5 w-full p-4 rounded-xl text-center text-white text-2xl font-bold border border-white/10 mb-6"
              placeholder="Answer"
              placeholderTextColor={COLORS.textTertiary}
              value={challengeAnswer}
              onChangeText={setChallengeAnswer}
              autoFocus
            />

            <Pressable
              onPress={() => setShowFriction(false)}
              className="bg-white w-full py-4 rounded-xl items-center mb-4"
            >
              <AppText className="text-black font-bold">
                I'm going back to work
              </AppText>
            </Pressable>
          </Animated.View>
        </BlurView>
      </Modal>
    </View>
  );
}
