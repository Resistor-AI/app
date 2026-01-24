import { useRouter } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import {
  View,
  useWindowDimensions,
  Pressable,
  Platform,
  Linking,
  Alert,
} from "react-native";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInUp, ZoomIn } from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { COLORS, PERMISSIONS, PermissionStatus } from "@/src/constants";
import {
  OnboardingHeader,
  OnboardingButton,
  OnboardingSubtext,
  OnboardingStepper,
} from "./components";
import { PermissionKey, PermissionStates } from "@/src/types/PermissionsScreen";

export default function PermissionsScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();

  const [permissionStates, setPermissionStates] = useState<PermissionStates>({
    notifications: "pending",
    usage: "pending",
  });
  const [isRequesting, setIsRequesting] = useState(false);

  // Check initial notification permission status
  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionStates((prev) => ({
      ...prev,
      notifications: status === "granted" ? "granted" : "pending",
    }));
  };

  const requestNotificationPermission = async () => {
    setIsRequesting(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      if (existingStatus === "granted") {
        setPermissionStates((prev) => ({ ...prev, notifications: "granted" }));
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
        return;
      }

      if (existingStatus === "denied") {
        Alert.alert(
          "Notifications Disabled",
          "Please enable notifications in Settings to receive focus reminders.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }

      const { status } = await Notifications.requestPermissionsAsync();

      if (status === "granted") {
        setPermissionStates((prev) => ({ ...prev, notifications: "granted" }));
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
      } else {
        setPermissionStates((prev) => ({ ...prev, notifications: "denied" }));
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    } finally {
      setIsRequesting(false);
    }
  };

  const requestUsageAccess = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      "Enable Screen Time",
      Platform.OS === "ios"
        ? "To help block distracting apps, please enable Screen Time in Settings > Screen Time."
        : "To help block distracting apps, please enable Usage Access in Settings > Apps > Special access > Usage access.",
      [
        { text: "Later", style: "cancel" },
        {
          text: "Open Settings",
          onPress: async () => {
            await Linking.openSettings();
            setPermissionStates((prev) => ({ ...prev, usage: "granted" }));
          },
        },
      ],
    );
  };

  const handlePermissionPress = useCallback(
    async (key: PermissionKey) => {
      if (isRequesting) return;

      switch (key) {
        case "notifications":
          await requestNotificationPermission();
          break;
        case "usage":
          await requestUsageAccess();
          break;
      }
    },
    [isRequesting],
  );

  const handleContinue = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push("/(app)/(public)/(auth)");
  };

  const getPermissionIcon = (key: PermissionKey): string => {
    const status = permissionStates[key];
    if (status === "granted") return "✓";
    if (status === "denied") return "✕";
    return "→";
  };

  const getPermissionIconBg = (key: PermissionKey): string => {
    const status = permissionStates[key];
    if (status === "granted") return COLORS.deepPurple || "#5E5CE6";
    if (status === "denied") return "#FF4444";
    return `${COLORS.deepPurple || "#5E5CE6"}80`;
  };

  const canContinue =
    permissionStates.notifications !== "pending" ||
    permissionStates.usage !== "pending";

  return (
    <View className="flex-1 bg-background pt-14">
      <StatusBar style="light" />

      {/* Top Section */}
      <View className="px-7">
        <OnboardingStepper totalSteps={4} currentStep={3} />
      </View>

      <View className="flex-1 px-7 pb-10 justify-between mt-6">
        <View>
          <Animated.View entering={FadeIn.delay(200).duration(800)}>
            <OnboardingHeader
              className="-mb-8"
              title="Give Us"
              subtitle="The Shield."
              accentColor="deepPurple"
            />

            <OnboardingSubtext className="mt-4">
              Tap each permission to enable. These help Resistor protect your
              focus.
            </OnboardingSubtext>
          </Animated.View>

          <View className="gap-4 mt-12">
            {PERMISSIONS.map((perm, index) => (
              <Animated.View
                key={perm.key}
                entering={ZoomIn.delay(800 + index * 100)
                  .duration(400)
                  .springify()}
              >
                <Pressable
                  onPress={() =>
                    handlePermissionPress(perm.key as PermissionKey)
                  }
                  disabled={
                    isRequesting ||
                    permissionStates[perm.key as PermissionKey] === "granted"
                  }
                >
                  <BlurView
                    intensity={50}
                    tint="dark"
                    className="rounded-3xl overflow-hidden border border-white/15"
                    style={{
                      opacity:
                        permissionStates[perm.key as PermissionKey] ===
                        "granted"
                          ? 0.7
                          : 1,
                    }}
                  >
                    <View className="flex-row items-center p-5 gap-4">
                      <View
                        className="size-16 rounded-2xl items-center justify-center"
                        style={{ backgroundColor: `${COLORS.deepPurple}30` }}
                      >
                        <AppText className="text-4xl mt-1">{perm.icon}</AppText>
                      </View>

                      <View className="flex-1">
                        <AppText variant="h5">{perm.title}</AppText>
                        <AppText
                          variant="body-sm"
                          color="secondary"
                          className="mt-1"
                        >
                          {perm.desc}
                        </AppText>
                      </View>

                      <View
                        className="size-8 rounded-full items-center justify-center"
                        style={{
                          backgroundColor: getPermissionIconBg(
                            perm.key as PermissionKey,
                          ),
                        }}
                      >
                        <AppText className="text-base text-white">
                          {getPermissionIcon(perm.key as PermissionKey)}
                        </AppText>
                      </View>
                    </View>
                  </BlurView>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </View>

        <Animated.View
          entering={FadeInUp.delay(1200).duration(600).springify()}
          className="gap-5"
        >
          <OnboardingButton
            label={canContinue ? "Continue" : "Enable Permissions"}
            variant="purple"
            onPress={handleContinue}
          />
        </Animated.View>
      </View>
    </View>
  );
}
