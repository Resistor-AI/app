import { View, TextInput, Pressable, ScrollView } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { COLORS } from "@/src/constants";
import Animated, {
  FadeIn,
  SlideInRight,
  Layout,
  FadeOut,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { GradientBackground } from "@/src/components/atoms/GradientBackground";
import { GlassCard } from "@/src/components/molecules/GlassCard";

const APPS_TO_BLOCK = ["Instagram", "TikTok", "X", "YouTube", "Snapchat"];

export default function SessionSetupScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [duration, setDuration] = useState(30);
  const [blockedApps, setBlockedApps] = useState<string[]>([]);
  const [brainDump, setBrainDump] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleApp = (app: string) => {
    Haptics.selectionAsync();
    if (blockedApps.includes(app)) {
      setBlockedApps(blockedApps.filter((a) => a !== app));
    } else {
      setBlockedApps([...blockedApps, app]);
    }
  };

  const nextStep = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep((s) => s + 1);
  };

  const handleGeneratePlan = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      nextStep();
    }, 1500);
  };

  const startSession = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace({
      pathname: "/(app)/(protected)/focus",
      params: { duration: duration.toString() },
    });
  };

  return (
    <GradientBackground>
      <StatusBar style="light" />
      <View style={{ height: top }} />

      {/* Header */}
      <View className="px-6 py-6 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="bg-white/10 p-2 rounded-full"
        >
          <AppText className="text-xl">✕</AppText>
        </Pressable>
        <AppText
          variant="caption"
          className="uppercase tracking-widest font-bold text-white/50"
        >
          Step {step} of 3
        </AppText>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
        {/* STEP 1: Time & Friction */}
        {step === 1 && (
          <Animated.View entering={SlideInRight} exiting={FadeOut}>
            <AppText variant="h1" className="text-4xl mb-4">
              Set your parameters.
            </AppText>
            <AppText color="secondary" className="mb-10 text-xl leading-8">
              How long do you want to stay in the zone?
            </AppText>

            {/* Duration Slider Mock */}
            <View className="flex-row justify-between mb-12 gap-3">
              {[15, 30, 45, 60].map((mins) => (
                <Pressable
                  key={mins}
                  onPress={() => setDuration(mins)}
                  className={`flex-1 aspect-square rounded-2xl items-center justify-center border-2 ${duration === mins ? "bg-electricBlue/20 border-electricBlue" : "bg-white/5 border-transparent"}`}
                >
                  <AppText
                    className={`text-2xl font-bold ${duration === mins ? "text-electricBlue" : "text-white"}`}
                  >
                    {mins}
                  </AppText>
                  <AppText className="text-xs uppercase text-white/50 mt-1">
                    Min
                  </AppText>
                </Pressable>
              ))}
            </View>

            <AppText variant="h4" className="mb-6">
              Block Distractions
            </AppText>
            <View className="flex-row flex-wrap gap-3">
              {APPS_TO_BLOCK.map((app) => (
                <Pressable
                  key={app}
                  onPress={() => toggleApp(app)}
                  className={`px-5 py-3 rounded-full border-2 ${blockedApps.includes(app) ? "bg-red-500/10 border-red-500" : "bg-white/5 border-transparent"}`}
                >
                  <AppText
                    className={`font-bold ${blockedApps.includes(app) ? "text-red-400" : "text-white/70"}`}
                  >
                    {app}
                  </AppText>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        )}

        {/* STEP 2: Brain Dump */}
        {step === 2 && (
          <Animated.View entering={SlideInRight} exiting={FadeOut}>
            <AppText variant="h1" className="text-4xl mb-4">
              Clear your mind.
            </AppText>
            <AppText color="secondary" className="mb-8 text-xl leading-8">
              Dump everything you need to do here. AI will organize it.
            </AppText>

            <GlassCard className="min-h-[300px] border-white/20">
              <TextInput
                multiline
                value={brainDump}
                onChangeText={setBrainDump}
                placeholder="Write here..."
                placeholderTextColor={COLORS.textTertiary}
                className="text-xl text-white font-outfit-medium h-full"
                textAlignVertical="top"
                autoFocus
              />
            </GlassCard>
          </Animated.View>
        )}

        {/* STEP 3: The Plan */}
        {step === 3 && (
          <Animated.View entering={SlideInRight}>
            <AppText variant="h1" className="text-4xl mb-4">
              Your Roadmap.
            </AppText>
            <AppText color="secondary" className="mb-10 text-xl leading-8">
              Optimized for {duration} mins of deep work.
            </AppText>

            <GlassCard
              className="items-center mb-8 border-successGreen/30 bg-successGreen/5"
              intensity={10}
            >
              <AppText className="text-successGreen font-bold tracking-widest uppercase mb-2 text-xs">
                Total Session Time
              </AppText>
              <AppText className="text-7xl font-mono text-white mb-2 font-bold tracking-tighter">
                {duration}:00
              </AppText>
              <View className="bg-successGreen/20 px-3 py-1 rounded-lg">
                <AppText className="text-successGreen font-bold text-xs">
                  +1 Regenerative Break
                </AppText>
              </View>
            </GlassCard>

            <AppText
              variant="h6"
              className="mb-4 uppercase tracking-widest text-white/50 text-xs"
            >
              Task Sequence
            </AppText>
            <View className="gap-3">
              <GlassCard
                className="flex-row items-center gap-4 p-4"
                intensity={5}
              >
                <View className="size-3 rounded-full bg-amber" />
                <AppText className="text-lg font-medium">
                  Deep Work Task 1
                </AppText>
              </GlassCard>
              <GlassCard
                className="flex-row items-center gap-4 p-4"
                intensity={5}
              >
                <View className="size-3 rounded-full bg-amber" />
                <AppText className="text-lg font-medium">
                  Deep Work Task 2
                </AppText>
              </GlassCard>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Footer Controls */}
      <View
        className="absolute bottom-0 w-full px-6 pt-6 bg-transparent"
        style={{ paddingBottom: bottom + 20 }}
      >
        {step === 1 && (
          <Pressable
            onPress={nextStep}
            className="bg-white py-5 rounded-3xl items-center shadow-lg active:scale-95 transition-transform"
          >
            <AppText className="text-black font-bold text-lg tracking-wide">
              Next: Brain Dump ›
            </AppText>
          </Pressable>
        )}
        {step === 2 && (
          <Pressable
            onPress={handleGeneratePlan}
            disabled={!brainDump.trim()}
            className={`bg-electricBlue py-5 rounded-3xl items-center shadow-lg active:scale-95 transition-transform ${!brainDump.trim() ? "opacity-50" : ""}`}
          >
            <AppText className="text-white font-bold text-lg tracking-wide">
              {isProcessing ? "Analyzing..." : "Generate Plan ✨"}
            </AppText>
          </Pressable>
        )}
        {step === 3 && (
          <Pressable
            onPress={startSession}
            className="bg-successGreen py-5 rounded-3xl items-center shadow-lg shadow-green-900/40 active:scale-95 transition-transform"
          >
            <AppText className="text-black font-bold text-lg tracking-wide">
              Start Session 🚀
            </AppText>
          </Pressable>
        )}
      </View>
    </GradientBackground>
  );
}
