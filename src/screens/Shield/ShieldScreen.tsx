import { View, Pressable } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn } from "react-native-reanimated";
import { GUARDED_APPS } from "@/src/data/ShieldScreen";
import { ChallengeModal } from "./components/ChallengeModal";

export default function ShieldScreen() {
  const { top } = useSafeAreaInsets();
  const [frictionEnabled, setFrictionEnabled] = useState(true);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeAnswer, setChallengeAnswer] = useState("");

  const handleTestFriction = () => {
    setChallengeAnswer("");
    setShowChallenge(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const verifyChallenge = () => {
    if (challengeAnswer === "14") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowChallenge(false);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <View className="flex-1 bg-background px-6" style={{ paddingTop: top + 20 }}>
      <StatusBar style="light" />
      <AppText variant="h2" className="mb-2">The Shield 🛡️</AppText>
      <AppText color="secondary" className="mb-8">Active defense against doomscrolling.</AppText>

      <View className="bg-surface border border-white/10 rounded-3xl p-6 mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <AppText variant="h4" className="text-white">Friction Engine</AppText>
            <AppText variant="caption" color="secondary" className="mt-1">Interrupts bad habits</AppText>
          </View>
          <Pressable onPress={() => setFrictionEnabled(!frictionEnabled)}>
            <View className={`w-14 h-8 rounded-full justify-center px-1 ${frictionEnabled ? "bg-successGreen" : "bg-white/10"}`}>
              <View className={`size-6 rounded-full bg-white shadow-sm ${frictionEnabled ? "self-end" : "self-start"}`} />
            </View>
          </Pressable>
        </View>
        {frictionEnabled && (
          <Animated.View entering={FadeIn} className="bg-white/5 rounded-xl p-4 mt-2">
            <AppText className="text-successGreen">● Active Protection</AppText>
          </Animated.View>
        )}
      </View>

      <AppText variant="h5" className="mb-4">Guarded Apps</AppText>
      <View className="flex-row gap-4 mb-8">
        {GUARDED_APPS.map((app) => (
          <View key={app} className="bg-white/5 px-4 py-3 rounded-xl border border-white/10">
            <AppText>{app}</AppText>
          </View>
        ))}
      </View>

      <Pressable onPress={handleTestFriction} className="bg-deepPurple py-4 rounded-full items-center active:opacity-80">
        <AppText className="font-bold text-white">Test Friction Challenge ⚡️</AppText>
      </Pressable>

      <ChallengeModal
        visible={showChallenge} answer={challengeAnswer}
        onChangeAnswer={setChallengeAnswer} onVerify={verifyChallenge}
        onClose={() => setShowChallenge(false)}
      />
    </View>
  );
}
