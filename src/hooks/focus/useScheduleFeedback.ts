import { useState, useCallback } from "react";
import { supabase } from "@/src/lib/supabase/client";
import { FeedbackRating } from "@/src/types/Focus/ScheduleFeedback";

export function useScheduleFeedback(traceId: string | null) {
  const [rating, setRating] = useState<FeedbackRating | 0>(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitFeedback = useCallback(async () => {
    if (!traceId || rating === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke(
        "log-schedule-feedback",
        { body: { traceId, rating, comment: comment.trim() || undefined } },
      );
      if (!error) setIsSubmitted(true);
    } catch {
      // Silently fail — feedback is non-critical
    } finally {
      setIsSubmitting(false);
    }
  }, [traceId, rating, comment, isSubmitting]);

  return {
    rating,
    setRating,
    comment,
    setComment,
    isSubmitting,
    isSubmitted,
    submitFeedback,
  };
}
