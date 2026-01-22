import React from "react";
import { Text as RNText } from "react-native";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Typography variants mapped to Tailwind classes
 * Uses sizes and fonts from tailwind.config.js
 */
const variantClasses = {
  display: "text-5xl font-outfit-extrabold tracking-tighter leading-none",
  h1: "text-4xl font-outfit-bold",
  h2: "text-3xl font-outfit-bold",
  h3: "text-2xl font-outfit-semibold",
  h4: "text-xl font-outfit-semibold",
  h5: "text-lg font-outfit-medium",
  h6: "text-base font-outfit-medium",
  body: "text-base font-sans leading-relaxed",
  "body-sm": "text-sm font-sans leading-normal",
  "body-lg": "text-lg font-sans leading-relaxed",
  caption: "text-xs font-sans leading-tight",
  label: "text-sm font-medium",
  overline: "text-xs font-semibold uppercase tracking-widest",
  button: "text-base font-semibold text-center",
} as const;

/**
 * Color variants mapped to Tailwind classes
 * Uses colors from tailwind.config.js
 */
const colorClasses = {
  primary: "text-textPrimary",
  secondary: "text-textSecondary",
  tertiary: "text-textTertiary",
  inverse: "text-background",
  accent: "text-deepPurple",
  error: "text-neonRed",
  success: "text-successGreen",
  warning: "text-yellow-500",
  blue: "text-electricBlue",
} as const;

export type TextVariant = keyof typeof variantClasses;
export type TextColor = keyof typeof colorClasses;

export interface TextProps extends React.ComponentProps<typeof RNText> {
  variant?: TextVariant;
  color?: TextColor;
  center?: boolean;
  className?: string;
}

/**
 * AppText - Reusable text component using Tailwind CSS classes.
 */
export const AppText = ({
  variant = "body",
  color = "primary",
  center,
  className,
  children,
  ...rest
}: TextProps) => {
  const mergedClassName = twMerge(
    clsx(
      variantClasses[variant],
      colorClasses[color],
      center && "text-center",
      className,
    ),
  );

  return (
    <RNText {...rest} className={mergedClassName}>
      {children}
    </RNText>
  );
};

AppText.displayName = "AppText";
