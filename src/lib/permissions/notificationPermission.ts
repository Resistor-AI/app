import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";
import { Linking } from "react-native";
import { PermissionCallbacks } from "@/src/types/Onboarding/PermissionCallbacks";
import { NOTIFICATION_BULLET_POINTS } from "@/src/constants/data";

export async function requestNotificationPermission(cb: PermissionCallbacks) {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  const { status: existingStatus, canAskAgain } =
    await Notifications.getPermissionsAsync();

  if (existingStatus === "granted") {
    cb.setNotificationState("granted");
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    return;
  }

  const isBlocked = existingStatus === "denied" && !canAskAgain;

  cb.showModal(
    isBlocked ? "Notifications Disabled" : "Enable Notifications",
    NOTIFICATION_BULLET_POINTS,
    "🔔",
    async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      cb.setNotificationState(status === "granted" ? "granted" : "denied");
      if (status === "granted") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        cb.hideModal();
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        cb.showModal(
          "Notifications Disabled", NOTIFICATION_BULLET_POINTS, "🔔",
          () => { Linking.openSettings(); cb.hideModal(); },
          "Please enable notifications in settings to continue:",
          "Open Settings",
        );
      }
    },
    "Allow Resistor AI to send you critical updates that preserve your focus flow:",
    "Turn On",
  );
}
