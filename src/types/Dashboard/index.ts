export interface StatsCardProps {
  user: {
    focusSaved: string;
    screenTime: string;
    streak: number;
  };
}

export interface Session {
  id: number;
  title: string;
  focus: string;
  saved: string;
  date: string;
}

export interface PastSessionsListProps {
  sessions: Session[];
}

import { FocusSettings } from "@/modules/installed-apps";

export interface PriorityQueueData {
  id?: string;
  status?: string;
  color?: string;
  title?: string;
  count?: number | string;
  subtitle?: string;
  description?: string;
  duration?: string;
  [key: string]: any;
}

export interface PriorityQueueProps {
  settings?: FocusSettings;
  data?: PriorityQueueData[];
}

export interface ActiveCardProps {
  isActive?: boolean;
  timeLeft: string;
  progress: number;
}

export interface ItemCardProps {
  item: PriorityQueueData;
}
