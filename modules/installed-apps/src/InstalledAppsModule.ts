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
   * Get the currently blocked apps list
   * @returns Array of blocked package names
   */
  getBlockedApps(): string[];
}

// Require the native module
const InstalledAppsModule =
  requireNativeModule<InstalledAppsModuleType>("InstalledApps");

export default InstalledAppsModule;
