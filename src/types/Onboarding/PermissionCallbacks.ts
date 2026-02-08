export interface PermissionCallbacks {
  setNotificationState: (state: "granted" | "denied") => void;
  setAccessibilityState: (state: "granted" | "denied") => void;
  showModal: (
    title: string,
    description: string | string[],
    icon: string,
    onAction: () => void,
    subtitle?: string,
    actionLabel?: string,
  ) => void;
  hideModal: () => void;
}
