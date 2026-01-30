import { useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { View, Platform, SectionList, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInUp, FadeIn } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { AppText } from "@/src/components/atoms/text";
import { OnboardingHeader, OnboardingButton, OnboardingStepper } from "./components";
import { SelectableAppItem } from "./components/SelectableAppItem";
import { useInstalledApps } from "@/src/hooks/useInstalledApps";
import InstalledApps from "../../../modules/installed-apps";
import { useOnboardingStore } from "@/src/store/onboardingStore";

export default function AppSelectionScreen() {
  const router = useRouter();
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(new Set());
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

    // console.log("Blocking apps saved:", selectedArray);
    completeOnboarding();
    router.replace("/(app)/(protected)");
  };

  return (
    <View className="flex-1 bg-background pt-14">
      <StatusBar style="light" />
      <View className="px-7"><OnboardingStepper totalSteps={5} currentStep={4} /></View>

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
              <SectionList
                sections={categorizedApps || []} // Types will align with the new useInstalledApps return
                keyExtractor={(item) => item.packageName}
                renderItem={({ item }) => (
                  <SelectableAppItem
                    app={item}
                    isSelected={selectedPackages.has(item.packageName)}
                    onToggle={toggleApp}
                  />
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <View className="bg-background py-2 mb-2">
                    <AppText
                      variant="h4"
                      className="text-white/50 uppercase text-xs tracking-wider font-bold"
                    >
                      {title}
                    </AppText>
                  </View>
                )}
                stickySectionHeadersEnabled={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                // Performance optimizations
                initialNumToRender={15}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={Platform.OS === 'android'} // Crucial for large lists on Android
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