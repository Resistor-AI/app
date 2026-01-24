import { ReactNode } from "react";
import { ViewStyle } from "react-native";

export interface OnboardingTemplateProps {
  header?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  style?: ViewStyle;
}
