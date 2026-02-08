export interface EnhancedFrictionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

export interface MathChallenge {
  question: string;
  answer: number;
}

export interface ChallengeSectionProps {
  challenge: MathChallenge;
  challengeAnswer: string;
  isAnswerCorrect: boolean;
  onAnswerChange: (text: string) => void;
}

export interface FrictionModalButtonsProps {
  isAnswerCorrect: boolean;
  onBackToFocus: () => void;
  onExit: () => void;
}
