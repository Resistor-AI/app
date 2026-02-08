import { AppInfo as NativeAppInfo } from "@/modules/installed-apps";

export interface AppSelectionStepProps {
  isLoading: boolean;
  defaultBlockedApps: NativeAppInfo[];
  availableApps: NativeAppInfo[];
  selectedPackages: Set<string>;
  onToggleApp: (packageName: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  durationText: string;
}

export interface AppItemProps {
  app: NativeAppInfo;
  isSelected: boolean;
  onToggle: (packageName: string) => void;
}

export interface AppSelectionHeaderProps {
  selectedCount: number;
  totalCount: number;
  durationText: string;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export type ListItem =
  | { type: "header"; title: string }
  | { type: "app"; data: NativeAppInfo; isSelected: boolean };
