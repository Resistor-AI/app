export interface SessionInfoCardProps {
  taskName: string;
  currentBlock: number;
  totalBlocks: number;
  totalTimeMinutes: number;
}

export interface AmbientBackgroundProps {
  isBreak?: boolean;
}

export interface FloatingControlBarProps {
  onEnd: () => void;
}
