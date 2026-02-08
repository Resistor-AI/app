import { PermissionStatus } from "@/src/types/common";

export type PermissionKey = "notifications" | "accessibility";
export type PermissionStates = Record<PermissionKey, PermissionStatus>;

export interface PermissionGuideModalProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  description: string | string[];
  onClose: () => void;
  onAction: () => void;
  actionLabel?: string;
  icon?: string;
}

export interface ModalConfig {
  title: string;
  subtitle?: string;
  description: string | string[];
  icon: string;
  onAction: () => void;
  actionLabel?: string;
}

export interface PermissionRowProps {
  title: string;
  desc: string;
  icon: string;
  permissionKey: PermissionKey;
  status: "granted" | "denied" | "pending";
  index: number;
  onPress: (key: PermissionKey) => void;
  disabled: boolean;
}

export type PermissionGuideContentProps = Omit<PermissionGuideModalProps, "visible">;
