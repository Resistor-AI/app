import { requireNativeModule } from "expo";

/**
 * App categories based on Android ApplicationInfo.category
 */
export type AppCategory =
  | "Game"
  | "Audio"
  | "Video"
  | "Image"
  | "Social"
  | "News"
  | "Maps"
  | "Productivity"
  | "Unknown";

/**
 * App info returned by getAppList()
 */
export interface AppInfo {
  /** Display name of the app */
  label: string;
  /** Android package name (e.g., "com.example.app") */
  packageName: string;
  /** Category of the app */
  category: AppCategory;
}

/**
 * Native module interface
 */
interface InstalledAppsModuleType {
  /**
   * Get list of installed user apps (excludes system apps and non-launchable apps)
   * @returns Promise resolving to array of AppInfo objects
   */
  getAppList(): Promise<AppInfo[]>;

  /**
   * Get Base64 encoded PNG icon for an app
   * @param packageName - The package name of the app
   * @returns Promise resolving to Base64 string or null if not found
   */
  getAppIcon(packageName: string): Promise<string | null>;

  /**
   * Set the list of apps to block
   * @param packageNames - Array of package names to block
   */
  setBlockedApps(packageNames: string[]): void;

  /**
   * Set the Working Hours (e.g., 9:00 AM to 5:00 PM today)
   * @param startTime - Unix timestamp (ms) for start
   * @param endTime - Unix timestamp (ms) for end
   */
  setSchedule(startTime: number, endTime: number): void;

  /**
   * Snooze a blocked app for a duration (The Reward)
   * @param packageName - The package name to snooze
   * @param durationMinutes - Duration in minutes
   */
  snoozeApp(packageName: string, durationMinutes: number): void;

  /**
   * Get the currently blocked apps list
   * @returns Array of blocked package names
   */
  /**
   * Check if permissions are granted
   * @returns Promise resolving to permission status
   */
  checkPermissions(): Promise<{
    accessibility: boolean;
    notifications: boolean;
  }>;

  getBlockedApps(): string[];

  /**
   * Get current focus settings
   */
  getSettings(): Promise<{
    scheduleStart: number;
    scheduleEnd: number;
    blockedAppsCount: number;
    blockedApps: string[];
    isSessionActive: boolean;
  }>;
}

// Require the native module
const InstalledAppsModule =
  requireNativeModule<InstalledAppsModuleType>("InstalledApps");

export default InstalledAppsModule;
