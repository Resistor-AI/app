import { requireNativeModule } from "expo";

interface AppInfo {
  label: string;
  packageName: string;
  icon?: string; // Base64 string
}

// It loads the native module object from the JSI or requires it from the bridge.
const InstalledApps = requireNativeModule("InstalledApps");

export async function getApps(): Promise<AppInfo[]> {
  return await InstalledApps.getApps();
}
