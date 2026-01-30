import { useState, useEffect, useCallback } from "react";
import { Platform, Linking } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import {
  PermissionKey,
  PermissionStates,
  ModalConfig,
} from "@/src/types/Onboarding/PermissionsScreen";

import { useNativePermissions } from "@/src/hooks/useNativePermissions";

export function usePermissionsLogic() {
  const router = useRouter();
  const { data: nativePermissions } = useNativePermissions();

  const [permissionStates, setPermissionStates] = useState<PermissionStates>({
    notifications: "pending",
    accessibility: "pending",
  });
  
  // Sync native permissions to local state
  useEffect(() => {
    if (nativePermissions) {
      setPermissionStates(prev => ({
        ...prev,
        notifications: nativePermissions.notifications ? "granted" : "pending",
        accessibility: nativePermissions.accessibility ? "granted" : "pending"
      }));
    }
  }, [nativePermissions]);

  const [isRequesting, setIsRequesting] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    title: "",
    description: "",
    icon: "⚙️",
    onAction: () => {},
    actionLabel: "Open Settings",
  });

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
        // The hook (useNativePermissions) will auto-refetch when app comes to foreground
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

  return {
    permissionStates,
    isRequesting,
    modalVisible,
    modalConfig,
    setModalVisible,
    handlePermissionPress,
    handleContinue,
    canContinue,
  };
}
