import { PermissionStatus } from "@/src/constants";

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
