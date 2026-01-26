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

interface InstalledApp {
  label: string;
  packageName: string;
  icon?: string; // Base64 string
}

export default function AppSelectionScreen() {
  const router = useRouter();
  const [apps, setApps] = useState<InstalledApp[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(
    new Set(),
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    // Mock data for stability until native module is fixed
    const MOCK_APPS = [
      {
        label: "Instagram",
        packageName: "com.instagram.android",
        icon: undefined,
      },
      {
        label: "TikTok",
        packageName: "com.zhiliaoapp.musically",
        icon: undefined,
      },
      { label: "Twitter", packageName: "com.twitter.android", icon: undefined },
      {
        label: "Facebook",
        packageName: "com.facebook.katana",
        icon: undefined,
      },
      {
        label: "YouTube",
        packageName: "com.google.android.youtube",
        icon: undefined,
      },
    ];
    setApps(MOCK_APPS);
    setIsLoading(false);
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
              <View className="gap-3 pb-20">
                {apps.map((app) => {
                  const isSelected = selectedPackages.has(app.packageName);
                  return (
                    <Animated.View key={app.packageName} entering={FadeIn}>
                      <View
                        className={`flex-row items-center p-4 rounded-xl border ${
                          isSelected
                            ? "bg-amber-500/10 border-amber-500"
                            : "bg-white/5 border-white/10"
                        }`}
                      >
                        {app.icon && (
                          <Image
                            source={{
                              uri: `data:image/png;base64,${app.icon}`,
                            }}
                            style={{ width: 40, height: 40, borderRadius: 8 }}
                          />
                        )}
                        <View className="flex-1 ml-3">
                          <AppText variant="body">{app.label}</AppText>
                        </View>
                        <Switch
                          value={isSelected}
                          onValueChange={() => toggleApp(app.packageName)}
                          trackColor={{ false: "#3e3e3e", true: COLORS.amber }}
                          thumbColor={"#fff"}
                        />
                      </View>
                    </Animated.View>
                  );
                })}
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
