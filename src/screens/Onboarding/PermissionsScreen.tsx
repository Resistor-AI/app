import { useRouter } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import { View, useWindowDimensions, Platform, Linking } from "react-native";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { PERMISSIONS } from "@/src/constants";
import {
  OnboardingHeader,
  OnboardingButton,
  OnboardingSubtext,
  OnboardingStepper,
  PermissionGuideModal,
} from "./components";
import { PermissionKey, PermissionStates } from "@/src/types/PermissionsScreen";
import { PermissionRow } from "./components/PermissionRow";

export default function PermissionsScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();

  const [permissionStates, setPermissionStates] = useState<PermissionStates>({
    notifications: "pending",
    accessibility: "pending",
  });
  const [isRequesting, setIsRequesting] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    subtitle?: string;
    description: string | string[];
    icon: string;
    onAction: () => void;
    actionLabel?: string;
  }>({
    title: "",
    description: "",
    icon: "⚙️",
    onAction: () => {},
    actionLabel: "Open Settings",
  });

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

  const showModal = (
    title: string,
    description: string | string[],
    icon: string,
    onAction: () => void,
    subtitle?: string,
    actionLabel: string = "Open Settings",
  ) => {
    setModalConfig({
      title,
      description,
      icon,
      onAction,
      subtitle,
      actionLabel,
    });
    setModalVisible(true);
  };

  const requestNotificationPermission = async () => {
    setIsRequesting(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const { status: existingStatus, canAskAgain } =
        await Notifications.getPermissionsAsync();

      if (existingStatus === "granted") {
        setPermissionStates((prev) => ({ ...prev, notifications: "granted" }));
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
        return;
      }

      // Soft Ask: Always show modal first to explain why
      const isBlocked = existingStatus === "denied" && !canAskAgain;

      showModal(
        isBlocked ? "Notifications Disabled" : "Enable Notifications",
        [
          "Remind you to maintain your focus streaks",
          "Alert you when the Shield blocks apps",
          "Keep you accountable to your daily goals",
        ],
        "🔔",
        async () => {
          const { status } = await Notifications.requestPermissionsAsync();
          setPermissionStates((prev) => ({
            ...prev,
            notifications: status === "granted" ? "granted" : "denied",
          }));

          if (status === "granted") {
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success,
            );
            setModalVisible(false);
          } else {
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Error,
            );
            // If permission denied (or blocked), guide user to Settings
            showModal(
              "Notifications Disabled",
              [
                "Remind you to maintain your focus streaks",
                "Alert you when the Shield blocks apps",
                "Keep you accountable to your daily goals",
              ],
              "🔔",
              () => {
                Linking.openSettings();
                setModalVisible(false);
              },
              "Please enable notifications in settings to continue:",
              "Open Settings",
            );
          }
        },
        "Allow Resistor AI to send you critical updates that preserve your focus flow:",
        "Turn On",
      );
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    } finally {
      setIsRequesting(false);
    }
  };
  const requestAccessibilityAccess = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const description =
      Platform.OS === "ios"
        ? [
            "Detects when you open distracting apps",
            "Blocks them immediately to protect focus",
            "Strictly used for focus protection per App Store policies",
          ]
        : [
            "Detect exactly when distracting apps are opened",
            "Instantly block them to keep you on track",
            "We do NOT collect or share your personal data",
          ];

    showModal(
      "Enable Accessibility",
      description,
      "🛡️",
      async () => {
        setModalVisible(false);
        if (Platform.OS === "android") {
          await Linking.sendIntent("android.settings.ACCESSIBILITY_SETTINGS");
        } else {
          await Linking.openSettings();
        }
        setPermissionStates((prev) => ({ ...prev, accessibility: "granted" }));
      },
      "Allow Resistor AI to actively shield your attention:",
    );
  };

  const handlePermissionPress = useCallback(
    async (key: PermissionKey) => {
      if (isRequesting) return;

      switch (key) {
        case "notifications":
          await requestNotificationPermission();
          break;
        case "accessibility":
          await requestAccessibilityAccess();
          break;
      }
    },
    [isRequesting],
  );

  const handleContinue = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Navigate to App Selection instead of Auth
    router.push("/(app)/(public)/(onboarding)/app-selection");
  };

  const canContinue =
    permissionStates.notifications !== "pending" ||
    permissionStates.accessibility !== "pending";

  return (
    <View className="flex-1 bg-background pt-14">
      <StatusBar style="light" />

      {/* Top Section */}
      <View className="px-7">
        <OnboardingStepper totalSteps={5} currentStep={3} />
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
              <PermissionRow
                key={perm.key}
                title={perm.title}
                desc={perm.desc}
                icon={perm.icon}
                permissionKey={perm.key as PermissionKey}
                status={permissionStates[perm.key as PermissionKey]}
                index={index}
                onPress={handlePermissionPress}
                disabled={
                  isRequesting ||
                  permissionStates[perm.key as PermissionKey] === "granted"
                }
              />
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

      <PermissionGuideModal
        visible={modalVisible}
        title={modalConfig.title}
        subtitle={modalConfig.subtitle}
        description={modalConfig.description}
        icon={modalConfig.icon}
        onAction={modalConfig.onAction}
        actionLabel={modalConfig.actionLabel}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
