import React from "react";

export interface StatsCardProps {
  user: {
    focusSaved: string;
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

export interface FloatingActionButtonProps {
  onPress: () => void;
  hapticFeedback?: boolean;
}

export interface ExtendedPastSessionsListProps extends PastSessionsListProps {
  header?: React.ReactNode;
}
