export interface SessionCompleteParams {
  taskName: string;
  durationMinutes: string;
  currentBlock: string;
  totalBlocks: string;
  distractionsBlocked: string;
  traceId?: string;
}

export interface CelebrationStatCardProps {
  emoji: string;
  value: string;
  label: string;
  delay: number;
}
