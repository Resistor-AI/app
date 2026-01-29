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
