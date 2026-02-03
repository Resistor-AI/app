import { memo } from "react";
import { Pressable } from "react-native";
import { Plus } from "lucide-react-native";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as Haptics from "expo-haptics";
import { FloatingActionButtonProps } from "@/src/types/Dashboard";

/**
 * Floating Action Button for primary actions.
 * Positioned at bottom-right corner.
 */
export const FloatingActionButton = memo(function FloatingActionButton({
  onPress,
  icon,
  className,
  iconSize = 24,
  iconColor = "#ffffff",
  hapticFeedback = true,
}: FloatingActionButtonProps) {
  const handlePress = () => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  const containerClassName = twMerge(
    clsx(
      "absolute bottom-6 right-6",
      "size-14 rounded-full",
      "bg-electricBlue",
      "items-center justify-center",
      "shadow-lg shadow-electricBlue/30",
      className
    )
  );

  return (
    <Pressable
      onPress={handlePress}
      className={containerClassName}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
      })}
    >
      {icon ?? <Plus size={iconSize} color={iconColor} strokeWidth={2.5} />}
    </Pressable>
  );
});
