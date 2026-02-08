import { useRouter } from "expo-router";
import { useState, useCallback, useMemo } from "react";
import { View, Platform, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInUp, FadeIn } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { FlashList } from "@shopify/flash-list";
import { AppText } from "@/src/components/atoms/text";
import { OnboardingHeader } from "./components/OnboardingHeader";
import { OnboardingButton } from "./components/OnboardingButton";
import { OnboardingStepper } from "./components/OnboardingStepper";
import { AppListItem } from "./components/AppListItem";
import { ListItem } from "@/src/types/Onboarding/AppSelectionScreen";
import { useInstalledApps } from "@/src/hooks/useInstalledApps";
import InstalledApps from "../../../modules/installed-apps";
import { useOnboardingStore } from "@/src/store/onboardingStore";

export default function AppSelectionScreen() {
  const router = useRouter();
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(new Set());
  const { data: categorizedApps, isLoading, isError } = useInstalledApps();
  const { completeOnboarding } = useOnboardingStore();

  const toggleApp = useCallback((packageName: string) => {
    Haptics.selectionAsync();
    setSelectedPackages((prev) => {
      const next = new Set(prev);
      if (next.has(packageName)) next.delete(packageName);
      else next.add(packageName);
      return next;
    });
  }, []);

  const handleContinue = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    InstalledApps.setBlockedApps(Array.from(selectedPackages));
    completeOnboarding();
    router.replace("/(app)/(protected)");
  };

  const flatData = useMemo(() => {
    if (!categorizedApps) return [];
    const result: ListItem[] = [];
    categorizedApps.forEach((section) => {
      result.push({ type: "header", title: section.title });
      section.data.forEach((app) => result.push({ type: "app", data: app }));
    });
    return result;
  }, [categorizedApps]);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => (
      <AppListItem item={item} selectedPackages={selectedPackages} onToggle={toggleApp} />
    ), [selectedPackages, toggleApp],
  );

  return (
    <View className="flex-1 bg-background pt-14">
      <StatusBar style="light" />
      <View className="px-7"><OnboardingStepper totalSteps={6} currentStep={5} /></View>
      <View className="flex-1 px-7 pb-10 mt-6">
        <OnboardingHeader title={"Select\nDistractions"} subtitle="What steals your focus?" accentColor="amberLight" />
        {Platform.OS === "ios" ? (
          <Animated.View entering={FadeIn.delay(400)} className="flex-1 justify-center items-center mt-10">
            <AppText>iOS Placeholder</AppText>
          </Animated.View>
        ) : (
          <View className="flex-1 mt-6 mb-4">
            {isLoading ? (
              <View className="mt-20 items-center justify-center">
                <ActivityIndicator size="large" color="#FFB800" />
                <AppText className="text-center mt-4 text-white/50">Scanning apps...</AppText>
              </View>
            ) : isError ? (
              <AppText className="text-center mt-10 text-red-400">Failed to load apps.</AppText>
            ) : (
              <FlashList
                data={flatData} renderItem={renderItem}
                getItemType={(item) => item.type}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                extraData={selectedPackages}
              />
            )}
          </View>
        )}
        <Animated.View entering={FadeInUp.delay(600).springify()}>
          <OnboardingButton label={`Continue (${selectedPackages.size})`} variant="amber" onPress={handleContinue} />
        </Animated.View>
      </View>
    </View>
  );
}
