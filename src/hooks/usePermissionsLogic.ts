import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  PermissionKey,
  PermissionStates,
  ModalConfig,
} from "@/src/types/Onboarding/PermissionsScreen";
import { useNativePermissions } from "@/src/hooks/useNativePermissions";
import { requestNotificationPermission } from "@/src/lib/permissions/notificationPermission";
import { requestAccessibilityAccess } from "@/src/lib/permissions/accessibilityPermission";

export function usePermissionsLogic() {
  const router = useRouter();
  const { data: nativePermissions } = useNativePermissions();
  const [permissionStates, setPermissionStates] = useState<PermissionStates>({
    notifications: "pending",
    accessibility: "pending",
  });
  const [isRequesting, setIsRequesting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    title: "", description: "", icon: "⚙️", onAction: () => {}, actionLabel: "Open Settings",
  });

  useEffect(() => {
    if (nativePermissions) {
      setPermissionStates((prev) => ({
        ...prev,
        notifications: nativePermissions.notifications ? "granted" : "pending",
        accessibility: nativePermissions.accessibility ? "granted" : "pending",
      }));
    }
  }, [nativePermissions]);

  const showModal = (
    title: string, description: string | string[], icon: string,
    onAction: () => void, subtitle?: string, actionLabel = "Open Settings",
  ) => {
    setModalConfig({ title, description, icon, onAction, subtitle, actionLabel });
    setModalVisible(true);
  };

  const callbacks = {
    setNotificationState: (state: "granted" | "denied") =>
      setPermissionStates((prev) => ({ ...prev, notifications: state })),
    setAccessibilityState: (state: "granted" | "denied") =>
      setPermissionStates((prev) => ({ ...prev, accessibility: state })),
    showModal,
    hideModal: () => setModalVisible(false),
  };

  const handlePermissionPress = useCallback(
    async (key: PermissionKey) => {
      if (isRequesting) return;
      setIsRequesting(true);
      try {
        if (key === "notifications") await requestNotificationPermission(callbacks);
        else if (key === "accessibility") await requestAccessibilityAccess(callbacks);
      } finally {
        setIsRequesting(false);
      }
    },
    [isRequesting],
  );

  const handleContinue = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push("/(app)/(public)/(onboarding)/app-selection");
  };

  const canContinue =
    permissionStates.notifications !== "pending" ||
    permissionStates.accessibility !== "pending";

  return {
    permissionStates, isRequesting, modalVisible, modalConfig,
    setModalVisible, handlePermissionPress, handleContinue, canContinue,
  };
}
