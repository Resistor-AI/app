export type SpringPreset = "bouncy" | "gentle" | "snappy";
export type AnimationType = "fade" | "slide" | "scale" | "fadeSlide";

export interface ScalePressOptions {
  minScale?: number;
  springPreset?: SpringPreset;
}

export interface StaggeredEntryOptions {
  index?: number;
  staggerDelay?: number;
  maxDelay?: number;
  duration?: number;
  useSpring?: boolean;
  springPreset?: SpringPreset;
  translateY?: number;
  initialScale?: number;
  trigger?: boolean;
  onComplete?: () => void;
}

export interface PulseAnimationOptions {
  minOpacity?: number;
  maxOpacity?: number;
  duration?: number;
  isActive?: boolean;
  useScale?: boolean;
  minScale?: number;
  maxScale?: number;
}

export interface FloatingAnimationOptions {
  distance?: number;
  duration?: number;
  isActive?: boolean;
  includeSway?: boolean;
  swayDistance?: number;
}

export interface ProgressAnimationOptions {
  progress: number;
  duration?: number;
  startColor?: string;
  endColor?: string;
  animateColor?: boolean;
}

export interface ListItemAnimationOptions {
  listId: string;
  itemId: string | number;
  isVisible?: boolean;
  type?: AnimationType;
  duration?: number;
}
