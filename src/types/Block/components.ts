import { FrictionStep, FrictionContext } from "./index";
import {
  MemoryChallenge,
  ChallengePhase,
  ChallengeColor,
  WordRecallChallenge,
  ColorSequenceChallenge,
  GridPatternChallenge,
} from "./challenges";
import { SharedValue } from "react-native-reanimated";

export interface FrictionHeaderProps {
  currentStep: FrictionStep;
  onReturnToFocus: () => void;
}

export interface ReflectiveStepProps {
  context: FrictionContext;
  onComplete: () => void;
}

export interface StatementDisplayProps {
  targetText: string;
  typedText: string;
}

export interface ChallengeStepProps {
  onComplete: () => void;
}

export interface WordRecallChallengeProps {
  challenge: WordRecallChallenge;
  phase: ChallengePhase;
  onSuccess: () => void;
  onFail: () => void;
}

export interface ColorSequenceChallengeProps {
  challenge: ColorSequenceChallenge;
  phase: ChallengePhase;
  palette: ChallengeColor[];
  onSuccess: () => void;
  onFail: () => void;
}

export interface GridPatternChallengeProps {
  challenge: GridPatternChallenge;
  phase: ChallengePhase;
  onSuccess: () => void;
  onFail: () => void;
}

export interface JustificationStepProps {
  appName: string;
  mode?: "block" | "end_session";
  onComplete: () => void;
}

export interface HoldButtonStepProps {
  onComplete: () => void;
}

export interface HoldRingProps {
  progress: SharedValue<number>;
  size: number;
  strokeWidth: number;
}

export interface AccessGrantedStepProps {
  context: FrictionContext;
  onUnlock: () => void;
}
