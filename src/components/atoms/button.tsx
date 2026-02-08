import React from "react";
import { Pressable, ActivityIndicator } from "react-native";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AppText } from "./text";
import { BUTTON_VARIANTS, BUTTON_SIZES, ButtonProps } from "@/src/types/components/atoms";

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
      BUTTON_VARIANTS[variant].container,
      BUTTON_SIZES[size].container,
      isDisabled && "opacity-50",
      className,
    ),
  );
  const labelClassName = twMerge(
    clsx(BUTTON_VARIANTS[variant].text, BUTTON_SIZES[size].text, textClassName),
  );

  return (
    <Pressable {...props} disabled={isDisabled} className={containerClassName}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" || variant === "destructive" ? "#fff" : "#000"}
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
