/**
 * Installed Apps Module
 *
 * A local Expo module for managing installed apps and enforcing app blocking
 * on Android devices for the Focus App.
 *
 * @example
 * ```typescript
 * import InstalledApps, { AppInfo } from 'installed-apps';
 *
 * // Get all user-installed apps
 * const apps: AppInfo[] = await InstalledApps.getAppList();
 *
 * // Get icon for a specific app
 * const iconBase64 = await InstalledApps.getAppIcon('com.example.app');
 *
 * // Block specific apps
 * InstalledApps.setBlockedApps(['com.instagram.android', 'com.twitter.android']);
 * ```
 */

export { default, AppInfo, AppCategory } from "./src/InstalledAppsModule";
import InstalledAppsModule from "./src/InstalledAppsModule";

export function setBlockedApps(apps: string[]): void {
  return InstalledAppsModule.setBlockedApps(apps);
}

export function setSchedule(startTime: number, endTime: number): void {
  return InstalledAppsModule.setSchedule(startTime, endTime);
}

export function snoozeApp(packageName: string, durationMinutes: number): void {
  return InstalledAppsModule.snoozeApp(packageName, durationMinutes);
}

export function getBlockedApps(): string[] {
  return InstalledAppsModule.getBlockedApps();
}

export interface PermissionStatus {
  accessibility: boolean;
  notifications: boolean;
}

export interface FocusSettings {
  scheduleStart: number;
  scheduleEnd: number;
  blockedAppsCount: number;
  blockedApps: string[];
  isSessionActive: boolean;
}

export function getSettings(): Promise<FocusSettings> {
  return InstalledAppsModule.getSettings();
}

export function checkPermissions(): Promise<PermissionStatus> {
  return InstalledAppsModule.checkPermissions();
}
