import React from "react";
import { Pressable, Text as RNText } from "react-native";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

// --- Button types ---

export const BUTTON_VARIANTS = {
  primary: {
    container: "bg-black active:bg-gray-800",
    text: "text-white font-semibold",
  },
  secondary: {
    container: "bg-gray-100 active:bg-gray-200",
    text: "text-black font-semibold",
  },
  outline: {
    container: "border border-gray-300 bg-transparent active:bg-gray-50",
    text: "text-black font-semibold",
  },
  ghost: {
    container: "bg-transparent active:bg-gray-100",
    text: "text-black font-medium",
  },
  destructive: {
    container: "bg-red-600 active:bg-red-700",
    text: "text-white font-semibold",
  },
} as const;

export const BUTTON_SIZES = {
  sm: { container: "px-3 py-2 rounded-lg", text: "text-sm" },
  md: { container: "px-4 py-3 rounded-xl", text: "text-base" },
  lg: { container: "px-6 py-4 rounded-xl", text: "text-lg" },
  icon: { container: "p-3 rounded-full", text: "" },
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;
export type ButtonSize = keyof typeof BUTTON_SIZES;

export interface ButtonProps extends Omit<
  React.ComponentProps<typeof Pressable>, "children"
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// --- Text types ---

export type TextVariant =
  | "display" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  | "body" | "body-sm" | "body-lg"
  | "caption" | "label" | "overline" | "button";

export type TextColor =
  | "primary" | "secondary" | "tertiary" | "inverse"
  | "accent" | "error" | "success" | "warning" | "blue";

export interface TextProps extends React.ComponentProps<typeof RNText> {
  content?: string;
  center?: boolean;
  color?: TextColor;
  className?: string;
  variant?: TextVariant;
}

// --- AchievementIcon types ---

export type IconVariant = "red" | "blue" | "purple" | "green" | "orange" | "pink";

export interface AchievementIconProps {
  icon: string;
  variant?: IconVariant;
  size?: "sm" | "md" | "lg";
  delay?: number;
}

// --- IconSymbol types ---

export type IconSymbolName = SymbolViewProps["name"];

export type IconMapping = Record<
  IconSymbolName,
  ComponentProps<typeof MaterialIcons>["name"]
>;

export interface IconSymbolProps {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}
