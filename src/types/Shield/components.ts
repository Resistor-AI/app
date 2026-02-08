export interface ChallengeModalProps {
  visible: boolean;
  answer: string;
  onChangeAnswer: (text: string) => void;
  onVerify: () => void;
  onClose: () => void;
}
