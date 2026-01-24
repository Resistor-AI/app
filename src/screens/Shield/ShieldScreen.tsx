import { View, Pressable, Modal, TextInput } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { COLORS } from "@/src/constants";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, ZoomIn, FadeOut } from "react-native-reanimated";
import { GUARDED_APPS } from "@/src/data/ShieldScreen";

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
    <View
      className="flex-1 bg-background px-6"
      style={{ paddingTop: top + 20 }}
    >
      {/* Main Screen Content */}
      <StatusBar style="light" />
      <AppText variant="h2" className="mb-2">
        The Shield 🛡️
      </AppText>
      <AppText color="secondary" className="mb-8">
        Active defense against doomscrolling.
      </AppText>

      {/* Friction Toggle Card */}
      <View className="bg-surface border border-white/10 rounded-3xl p-6 mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <AppText variant="h4" className="text-white">
              Friction Engine
            </AppText>
            <AppText variant="caption" color="secondary" className="mt-1">
              Interrupts bad habits
            </AppText>
          </View>
          <Pressable onPress={() => setFrictionEnabled(!frictionEnabled)}>
            <View
              className={`w-14 h-8 rounded-full justify-center px-1 ${frictionEnabled ? "bg-successGreen" : "bg-white/10"}`}
            >
              <View
                className={`size-6 rounded-full bg-white shadow-sm ${frictionEnabled ? "self-end" : "self-start"}`}
              />
            </View>
          </Pressable>
        </View>

        {frictionEnabled && (
          <Animated.View
            entering={FadeIn}
            className="bg-white/5 rounded-xl p-4 mt-2"
          >
            <AppText className="text-successGreen">● Active Protection</AppText>
          </Animated.View>
        )}
      </View>

      {/* Blocked Apps List */}
      <AppText variant="h5" className="mb-4">
        Guarded Apps
      </AppText>
      <View className="flex-row gap-4 mb-8">
        {GUARDED_APPS.map((app) => (
          <View
            key={app}
            className="bg-white/5 px-4 py-3 rounded-xl border border-white/10"
          >
            <AppText>{app}</AppText>
          </View>
        ))}
      </View>

      <Pressable
        onPress={handleTestFriction}
        className="bg-deepPurple py-4 rounded-full items-center active:opacity-80"
      >
        <AppText className="font-bold text-white">
          Test Friction Challenge ⚡️
        </AppText>
      </Pressable>

      {/* Challenge Modal */}
      <Modal visible={showChallenge} transparent animationType="fade">
        <BlurView
          intensity={90}
          tint="dark"
          className="flex-1 items-center justify-center p-6"
        >
          <Animated.View
            entering={ZoomIn}
            className="bg-[#1A1A1A] w-full p-8 rounded-[32px] border border-white/10 items-center"
          >
            <AppText className="text-4xl mb-4">🛑</AppText>
            <AppText variant="h3" className="text-center mb-2">
              Wait a second.
            </AppText>
            <AppText color="secondary" className="text-center mb-8">
              Solve this to unlock distractions.
            </AppText>

            <AppText variant="h1" className="mb-8 text-5xl font-mono">
              7 + 7 = ?
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
              onPress={verifyChallenge}
              className="bg-white w-full py-4 rounded-xl items-center mb-4"
            >
              <AppText className="text-black font-bold">Unlock</AppText>
            </Pressable>

            <Pressable onPress={() => setShowChallenge(false)} className="py-2">
              <AppText color="secondary">I'll get back to work</AppText>
            </Pressable>
          </Animated.View>
        </BlurView>
      </Modal>
    </View>
  );
}
