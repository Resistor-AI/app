import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, useWindowDimensions } from "react-native";
import { OnboardingTemplateProps } from "@/src/types/OnboardingTemplate";

export function OnboardingTemplate({
  header,
  content,
  footer,
  style,
}: OnboardingTemplateProps) {
  const { height } = useWindowDimensions();

  return (
    <View className="flex-1 bg-background px-7" style={style}>
      <StatusBar style="light" />

      {/* Main Content Area */}
      <View className="flex-1 justify-center gap-y-5">
        {header}
        {content}
      </View>

      {/* Footer Area */}
      {footer && (
        <View
          className="gap-5"
          style={{ paddingBottom: height * 0.05 }} // Consistent bottom padding
        >
          {footer}
        </View>
      )}
    </View>
  );
}
