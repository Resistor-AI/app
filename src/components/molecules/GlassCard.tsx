import { View, ViewProps } from "react-native";
import { BlurView } from "expo-blur";
import { twMerge } from "tailwind-merge";

interface GlassCardProps extends ViewProps {
  intensity?: number;
  className?: string;
  variant?: "light" | "dark";
}

export function GlassCard({
  children,
  intensity = 20,
  className,
  variant = "dark",
  style,
  ...props
}: GlassCardProps) {
  return (
    <View
      className={twMerge(
        "overflow-hidden rounded-3xl border border-white/10 bg-white/5",
        className,
      )}
      style={style}
      {...props}
    >
      <BlurView
        intensity={intensity}
        tint={variant}
        style={{ flex: 1, padding: 16 }}
      >
        {children}
      </BlurView>
    </View>
  );
}
