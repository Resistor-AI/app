import React from "react";
import { Text as RNText, TextStyle, StyleSheet } from "react-native";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Typography variants
 */
const variants = {
  display: {
    fontSize: 48,
    fontWeight: "800",
    letterSpacing: -1,
    lineHeight: 52,
  },
  h1: { fontSize: 36, fontWeight: "700" },
  h2: { fontSize: 30, fontWeight: "700" },
  h3: { fontSize: 24, fontWeight: "600" },
  h4: { fontSize: 20, fontWeight: "600" },
  h5: { fontSize: 18, fontWeight: "500" },
  h6: { fontSize: 16, fontWeight: "500" },
  body: { fontSize: 16, lineHeight: 24 },
  "body-sm": { fontSize: 14, lineHeight: 20 },
  "body-lg": { fontSize: 18, lineHeight: 28 },
  caption: { fontSize: 13, lineHeight: 18 },
  label: { fontSize: 14, fontWeight: "500" },
  overline: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  button: { fontSize: 16, fontWeight: "600", textAlign: "center" },
} as const;

const colors = {
  primary: "#ffffff",
  secondary: "#9ca3af",
  tertiary: "#6b7280",
  muted: "#4b5563",
  inverse: "#000000",
  accent: "#c084fc",
  error: "#ef4444",
  success: "#22c55e",
  warning: "#f59e0b",
  color: "#000000",
} as const;

export type TextVariant = keyof typeof variants;
export type TextColor = keyof typeof colors;

export interface TextProps extends React.ComponentProps<typeof RNText> {
  variant?: TextVariant;
  color?: TextColor;
  center?: boolean;
  className?: string;
}

/**
 * AppText - Reusable text component.
 */
export const AppText = ({
  variant = "body",
  color = "primary",
  center,
  className,
  style,
  children,
  ...rest
}: TextProps) => {
  // Merge utility classes
  const mergedClassName = twMerge(
    clsx(
      center && "text-center", // NativeWind handles text-center
      className,
    ),
  );

  // Calculate explicit styles from props (variants/colors)
  // We apply these as inline styles which will merge with CSS-generated styles
  const baseStyle = variants[variant] || variants.body;
  const colorStyle: TextStyle = { color: colors[color] };
  const alignmentStyle: TextStyle = center ? { textAlign: "center" } : {};

  return (
    <RNText
      {...rest}
      // Pass the class string for NativeWind to process
      className={mergedClassName}
      // Pass our explicit styles (variant/color)
      // These will be merged with the styles generated from className
      style={StyleSheet.flatten([baseStyle, colorStyle, alignmentStyle, style])}
    >
      {children}
    </RNText>
  );
};

AppText.displayName = "AppText";
