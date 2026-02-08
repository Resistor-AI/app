export interface RollingTextProps {
  prefix?: string;
  words?: string[];
  accentColor?: string;
}

export interface AuthButtonsProps {
  onGoogleSignIn: () => void;
  onAppleSignIn: () => void;
  isLoading?: boolean;
  error?: { message: string } | null;
}
