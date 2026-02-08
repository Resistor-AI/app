import { View } from "react-native";
import { BlurView } from "expo-blur";
import { twMerge } from "tailwind-merge";
import { GlassCardProps } from "@/src/types/components/molecules";

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
