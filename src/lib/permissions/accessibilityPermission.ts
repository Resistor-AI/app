import * as Haptics from "expo-haptics";
import { Platform, Linking } from "react-native";
import { PermissionCallbacks } from "@/src/types/Onboarding/PermissionCallbacks";

export async function requestAccessibilityAccess(cb: PermissionCallbacks) {
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

  cb.showModal(
    "Enable Accessibility",
    description,
    "🛡️",
    async () => {
      cb.hideModal();
      if (Platform.OS === "android") {
        await Linking.sendIntent("android.settings.ACCESSIBILITY_SETTINGS");
      } else {
        await Linking.openSettings();
      }
    },
    "Allow Resistor AI to actively shield your attention:",
  );
}
