import { View, TextInput, Pressable, Keyboard } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { AppText } from "@/src/components/atoms/text";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { COLORS } from "@/src/constants/colors";
import Animated, { FadeInUp, Layout } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import { MOCK_SCHEDULE } from "@/src/data/TasksScreen";
import { EnergyChunk } from "@/src/types/Brain/TasksScreen";

export default function TasksScreen() {
  const { top } = useSafeAreaInsets();
  const [brainDump, setBrainDump] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [schedule, setSchedule] = useState<EnergyChunk[]>([]);

  const handleGenerate = async () => {
    if (!brainDump.trim()) return;
    Keyboard.dismiss();
    setIsGenerating(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => { setSchedule(MOCK_SCHEDULE); setIsGenerating(false); setBrainDump(""); }, 1500);
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" />
      <FlashList
        data={schedule}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: top + 20, paddingHorizontal: 24, paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <AppText variant="h2" className="mb-2">The Brain 🧠</AppText>
            <AppText color="secondary" className="mb-8">Dump your thoughts. AI will schedule them.</AppText>
            <BlurView intensity={10} tint="dark" className="rounded-3xl border border-white/10 overflow-hidden mb-6">
              <TextInput
                multiline placeholder="e.g. Fix the bug, call mom, and finish the report..."
                placeholderTextColor={COLORS.textTertiary} value={brainDump} onChangeText={setBrainDump}
                className="p-5 text-lg text-white font-outfit-medium min-h-[120px]" textAlignVertical="top"
              />
              <View className="p-4 bg-white/5 border-t border-white/5 flex-row justify-end">
                <Pressable
                  onPress={handleGenerate} disabled={!brainDump.trim() || isGenerating}
                  className={`bg-electricBlue px-6 py-3 rounded-full ${!brainDump.trim() || isGenerating ? "opacity-50" : ""}`}
                >
                  <AppText className="font-bold text-background">
                    {isGenerating ? "Analyzing..." : "Generate Schedule ✨"}
                  </AppText>
                </Pressable>
              </View>
            </BlurView>
            {schedule.length > 0 && <AppText variant="h5" className="mb-4">Your Energy Schedule</AppText>}
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInUp.delay(index * 100).springify()} layout={Layout.springify()}
            className="bg-surface border border-white/10 rounded-2xl p-4 flex-row items-center justify-between mb-4"
          >
            <View className="flex-row items-center gap-4">
              <View className={`w-1 h-12 rounded-full ${item.type === "Deep Work" ? "bg-amber" : "bg-successGreen"}`} />
              <View>
                <AppText variant="h6">{item.title}</AppText>
                <AppText variant="caption" color="secondary" className="mt-1">{item.type}</AppText>
              </View>
            </View>
            <View className="bg-white/5 px-3 py-1 rounded-lg">
              <AppText variant="caption" className="font-mono">{item.duration}</AppText>
            </View>
          </Animated.View>
        )}
      />
    </View>
  );
}
