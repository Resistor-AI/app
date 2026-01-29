import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { View, Platform, ScrollView, Switch, Image, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { AppText } from "@/src/components/atoms/text";
import {
  OnboardingHeader,
  OnboardingButton,
  OnboardingStepper,
} from "./components";
import { COLORS } from "@/src/constants";
import InstalledApps, {
  AppInfo,
  AppCategory,
} from "../../../modules/installed-apps";

interface CategorizedApps {
  [key: string]: AppInfo[];
}

export default function AppSelectionScreen() {
  const router = useRouter();
  const [categorizedApps, setCategorizedApps] = useState<CategorizedApps>({});
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(
    new Set(),
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      const installedApps = await InstalledApps.getAppList();

      console.log(installedApps);

      // Group apps by category
      const grouped: CategorizedApps = {};
      installedApps.forEach((app) => {
        const category = app.category || "Unknown";
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(app);
      });

      setCategorizedApps(grouped);

      // Also fetch icons for displayed apps if needed, but for now we rely on the list
      // Note: If icon fetching is heavy, we might want to do it lazily or in batches
      // The current getAppList might not return icons directly if the native module doesn't include them in the list object
      // (Checking native module: getAppList returns label, packageName, category. getAppIcon is separate)
    } catch (error) {
      console.error("Failed to load apps", error);
      Alert.alert("Error", "Could not load installed apps.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleApp = (packageName: string) => {
    Haptics.selectionAsync();
    setSelectedPackages((prev) => {
      const next = new Set(prev);
      if (next.has(packageName)) {
        next.delete(packageName);
      } else {
        next.add(packageName);
      }
      return next;
    });
  };

  const handleContinue = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // TODO: Save selectedPackages to store/backend
    router.push("/(app)/(public)/(auth)");
  };

  const handleOpenSettings = async () => {
    // For iOS placeholder
    Alert.alert("Coming Soon", "We use the native Screen Time picker on iOS.");
  };

  return (
    <View className="flex-1 bg-background pt-14">
      <StatusBar style="light" />

      {/* Top Section */}
      <View className="px-7">
        <OnboardingStepper totalSteps={5} currentStep={4} />
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
            className="flex-1 justify-center items-center gap-4 mt-10"
          >
            <View className="bg-white/5 p-6 rounded-3xl border border-white/10 w-full items-center">
              <AppText variant="h3" className="mb-2">
                🍎 iOS Screen Time
              </AppText>
              <AppText color="secondary" className="text-center">
                On iPhone, we use the strict Apple Native Picker to ensure
                privacy. You will select your apps in the next step.
              </AppText>
            </View>
          </Animated.View>
        ) : (
          <ScrollView
            className="flex-1 mt-8 mb-4"
            showsVerticalScrollIndicator={false}
          >
            {isLoading ? (
              <AppText className="text-center mt-10">Loading apps...</AppText>
            ) : (
              <View className="gap-6 pb-20">
                {Object.entries(categorizedApps).map(([category, apps]) => (
                  <View key={category} className="gap-3">
                    <AppText
                      variant="h4"
                      className="mb-2 text-white/50 uppercase text-xs tracking-wider"
                    >
                      {category}
                    </AppText>

                    {apps.map((app) => {
                      const isSelected = selectedPackages.has(app.packageName);
                      // TODO: Fetch icon asynchronously if needed, for performance we skip base64 icon in list for now unless cached

                      return (
                        <Animated.View key={app.packageName} entering={FadeIn}>
                          <View
                            className={`flex-row items-center p-4 rounded-xl border ${
                              isSelected
                                ? "bg-amber-500/10 border-amber-500"
                                : "bg-white/5 border-white/10"
                            }`}
                          >
                            {/* Placeholder for icon - implementing getAppIcon in list would require async loading per item */}
                            <View className="w-10 h-10 rounded-lg bg-white/10 items-center justify-center">
                              <AppText className="text-xl">
                                {app.label.charAt(0)}
                              </AppText>
                            </View>

                            <View className="flex-1 ml-3">
                              <AppText variant="body">{app.label}</AppText>
                              <AppText
                                variant="caption"
                                className="text-white/40 text-xs"
                              >
                                {app.packageName}
                              </AppText>
                            </View>
                            <Switch
                              value={isSelected}
                              onValueChange={() => toggleApp(app.packageName)}
                              trackColor={{
                                false: "#3e3e3e",
                                true: COLORS.amber,
                              }}
                              thumbColor={"#fff"}
                            />
                          </View>
                        </Animated.View>
                      );
                    })}
                  </View>
                ))}

                {Object.keys(categorizedApps).length === 0 && (
                  <AppText className="text-center text-white/50">
                    No apps found.
                  </AppText>
                )}
              </View>
            )}
          </ScrollView>
        )}

        <Animated.View entering={FadeInUp.delay(600).springify()}>
          <OnboardingButton
            label="Continue"
            variant="amber"
            onPress={handleContinue}
          />
        </Animated.View>
      </View>
    </View>
  );
}
