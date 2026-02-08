import { memo } from "react";
import { View } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import { StepBadgeProps, StepBadgeVariant } from "@/src/types/common";

const VARIANT_COLORS: Record<StepBadgeVariant, string> = {
  blue: "#3b82f6",
  amber: "#f59e0b",
  green: "#22c55e",
  red: "#ef4444",
  purple: "#a855f7",
  white: "#ffffff",
};

export const StepBadge = memo(function StepBadge({
  icon,
  label,
  variant = "blue",
  className,
}: StepBadgeProps) {
  const color = VARIANT_COLORS[variant];

  return (
    <View className={`items-center ${className ?? ""}`}>
      <View
        className="rounded-full px-4 py-2 flex-row items-center gap-2"
        style={{
          backgroundColor: `${color}15`,
          borderWidth: 1,
          borderColor: `${color}33`,
        }}
      >
        {icon}
        <AppText
          variant="label"
          content={label}
          className="uppercase tracking-wider"
          style={{ color }}
        />
      </View>
    </View>
  );
});
