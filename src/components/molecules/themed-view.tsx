import { View } from "react-native";

import { useThemeColor } from "@/src/hooks/useThemeColor";
import { ThemedViewProps } from "@/src/types/components/molecules";

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
