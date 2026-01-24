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
