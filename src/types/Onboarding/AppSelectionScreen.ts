import { AppInfo } from "@/modules/installed-apps";

export interface SelectableAppItemProps {
  app: AppInfo;
  isSelected: boolean;
  onToggle: (packageName: string) => void;
}
