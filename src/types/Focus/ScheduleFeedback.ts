export type FeedbackRating = 1 | 2 | 3 | 4 | 5;

export interface ScheduleFeedbackInput {
  traceId: string;
  rating: FeedbackRating;
  comment?: string;
}

export interface ScheduleFeedbackResponse {
  success: boolean;
  error?: string;
}

export interface ScheduleFeedbackCardProps {
  traceId: string | null;
}

export interface StarRatingProps {
  rating: FeedbackRating | 0;
  onRate: (rating: FeedbackRating) => void;
  disabled?: boolean;
}
