import { StatsCardProps } from "./index";

export interface ExtendedStatsProps extends StatsCardProps {
  realBlockedCount: number;
  blockedApps: string[];
  distractionsBlocked?: number;
}

export interface BlockedAppIconProps {
  packageName: string;
  index: number;
}

export interface StatsBottomRowProps {
  realBlockedCount: number;
  displayApps: string[];
  distractionsBlocked: number;
  streak: number;
  animatedStyle: object;
}
