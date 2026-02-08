import { AppInfo } from "@/modules/installed-apps";

export interface SelectableAppItemProps {
  app: AppInfo;
  isSelected: boolean;
  onToggle: (packageName: string) => void;
}

export type ListItem =
  | { type: "header"; title: string }
  | { type: "app"; data: AppInfo };

export interface AppListItemProps {
  item: ListItem;
  selectedPackages: Set<string>;
  onToggle: (packageName: string) => void;
}
