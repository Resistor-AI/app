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
import { SelectableAppItem } from "./components/SelectableAppItem";
import { useInstalledApps } from "@/src/hooks/useInstalledApps";
import InstalledApps, { AppInfo } from "../../../modules/installed-apps";
import { useOnboardingStore } from "@/src/store/onboardingStore";

type ListItem =
  | { type: "header"; title: string }
  | { type: "app"; data: AppInfo };

export default function AppSelectionScreen() {
  const router = useRouter();
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(
    new Set(),
  );
  const { data: categorizedApps, isLoading, isError } = useInstalledApps();

  const toggleApp = useCallback((packageName: string) => {
    Haptics.selectionAsync();
    setSelectedPackages((prev) => {
      const next = new Set(prev);
      if (next.has(packageName)) next.delete(packageName);
      else next.add(packageName);
      return next;
    });
  }, []);

  const { completeOnboarding } = useOnboardingStore();

  const handleContinue = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Just save the list for now. The session starts on the next screen/timer screen.
    const selectedArray = Array.from(selectedPackages);
    InstalledApps.setBlockedApps(selectedArray);

    completeOnboarding();
    console.log("Onboarding marked complete, navigating to protected...");

    // Verify router is ready
    if (router.canGoBack() || true) {
      // simple check
      router.replace("/(app)/(protected)");
    }
  };

  const flatData = useMemo(() => {
    if (!categorizedApps) return [];
    const result: ListItem[] = [];
    categorizedApps.forEach((section) => {
      result.push({ type: "header", title: section.title });
      section.data.forEach((app) => {
        result.push({ type: "app", data: app });
      });
    });
    return result;
  }, [categorizedApps]);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === "header") {
        return (
          <View className="bg-background py-2 mb-2 mt-4">
            <AppText
              variant="h4"
              className="text-white/50 uppercase text-xs tracking-wider font-bold"
            >
              {item.title}
            </AppText>
          </View>
        );
      }
      return (
        <SelectableAppItem
          app={item.data}
          isSelected={selectedPackages.has(item.data.packageName)}
          onToggle={toggleApp}
        />
      );
    },
    [selectedPackages, toggleApp],
  );

  return (
    <View className="flex-1 bg-background pt-14">
      <StatusBar style="light" />
      <View className="px-7">
        <OnboardingStepper totalSteps={6} currentStep={5} />
      </View>

      <View className="flex-1 px-7 pb-10 mt-6">
        <OnboardingHeader
          title={"Select\nDistractions"}
          subtitle="What steals your focus?"
          accentColor="amberLight"
        />

        {Platform.OS === "ios" ? (
          <Animated.View
            entering={FadeIn.delay(400)}
            className="flex-1 justify-center items-center mt-10"
          >
            <AppText>iOS Placeholder</AppText>
          </Animated.View>
        ) : (
          <View className="flex-1 mt-6 mb-4">
            {isLoading ? (
              <View className="mt-20 items-center justify-center">
                <ActivityIndicator size="large" color="#FFB800" />
                <AppText className="text-center mt-4 text-white/50">
                  Scanning apps...
                </AppText>
              </View>
            ) : isError ? (
              <AppText className="text-center mt-10 text-red-400">
                Failed to load apps.
              </AppText>
            ) : (
              <FlashList
                data={flatData}
                renderItem={renderItem}
                getItemType={(item) => item.type}
                // @ts-ignore
                estimatedItemSize={150}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                extraData={selectedPackages}
              />
            )}
          </View>
        )}

        <Animated.View entering={FadeInUp.delay(600).springify()}>
          <OnboardingButton
            label={`Continue (${selectedPackages.size})`}
            variant="amber"
            onPress={handleContinue}
          />
        </Animated.View>
      </View>
    </View>
  );
}
