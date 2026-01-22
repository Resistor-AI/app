import React from "react";
import { Pressable, ActivityIndicator } from "react-native";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AppText } from "./text";

/**
 * Button variant styles
 */
const variants = {
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

/**
 * Button size styles
 */
const sizes = {
  sm: {
    container: "px-3 py-2 rounded-lg",
    text: "text-sm",
  },
  md: {
    container: "px-4 py-3 rounded-xl",
    text: "text-base",
  },
  lg: {
    container: "px-6 py-4 rounded-xl",
    text: "text-lg",
  },
  icon: {
    container: "p-3 rounded-full",
    text: "",
  },
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export interface ButtonProps extends Omit<
  React.ComponentProps<typeof Pressable>,
  "children"
> {
  /** Button style variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Button label */
  children?: React.ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Additional container classes */
  className?: string;
  /** Additional text classes */
  textClassName?: string;
  /** Left icon element */
  leftIcon?: React.ReactNode;
  /** Right icon element */
  rightIcon?: React.ReactNode;
}

/**
 * Button atom with variants and sizes.
 */
function ButtonComponent({
  variant = "primary",
  size = "md",
  children,
  loading = false,
  disabled = false,
  className,
  textClassName,
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const containerClassName = twMerge(
    clsx(
      "flex-row items-center justify-center",
      variants[variant].container,
      sizes[size].container,
      isDisabled && "opacity-50",
      className,
    ),
  );

  const labelClassName = twMerge(
    clsx(variants[variant].text, sizes[size].text, textClassName),
  );

  return (
    <Pressable {...props} disabled={isDisabled} className={containerClassName}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "primary" || variant === "destructive" ? "#fff" : "#000"
          }
        />
      ) : (
        <>
          {leftIcon}
          {typeof children === "string" ? (
            <AppText className={labelClassName}>{children}</AppText>
          ) : (
            children
          )}
          {rightIcon}
        </>
      )}
    </Pressable>
  );
}

ButtonComponent.displayName = "Button";

export const Button = ButtonComponent;
