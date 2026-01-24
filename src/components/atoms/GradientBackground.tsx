import { LinearGradient } from "expo-linear-gradient";
import { ViewProps } from "react-native";
import { COLORS } from "@/src/constants";

export function GradientBackground({ children, style, ...props }: ViewProps) {
  return (
    <LinearGradient
      colors={["#0F0F0F", "#050505"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ flex: 1 }, style]}
      {...props}
    >
      {children}
    </LinearGradient>
  );
}
