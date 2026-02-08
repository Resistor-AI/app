export interface PermissionBannerProps {
  permissions: {
    accessibility: boolean;
    accessibilityRunning: boolean;
    notifications: boolean;
  } | undefined;
}
