import { useRouter } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import {
  View,
  useWindowDimensions,
  Pressable,
  Platform,
  Linking,
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
  PermissionGuideModal,
} from "./components";
import { PermissionKey, PermissionStates } from "@/src/types/PermissionsScreen";

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
