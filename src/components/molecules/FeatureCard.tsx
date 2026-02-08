import { View } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import Animated, { FadeIn } from "react-native-reanimated";
import { FeatureCardProps } from "@/src/types/components/molecules";
import { FeatureCardMeta } from "./FeatureCardMeta";

export function FeatureCard({
  icon,
  badge,
  title,
  subtitle,
  meta,
  delay = 0,
}: FeatureCardProps) {
  return (
    <Animated.View
      entering={FadeIn.delay(delay).duration(600)}
      style={{
        backgroundColor: "rgba(255,255,255,0.85)",
        borderRadius: 24,
        padding: 20,
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.5)",
      }}
    >
      {/* Header with badge and arrow */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        {badge && (
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.06)",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 14,
            }}
          >
            <AppText style={{ fontSize: 12, fontWeight: "600", color: "#333" }}>
              {badge}
            </AppText>
          </View>
        )}
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: "rgba(0,0,0,0.04)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppText style={{ fontSize: 14, color: "#666" }}>↗</AppText>
        </View>
      </View>

      {/* Title */}
      <AppText
        style={{
          fontSize: 22,
          fontWeight: "600",
          color: "#1a1a1a",
          lineHeight: 28,
          marginBottom: 8,
        }}
      >
        {title}
      </AppText>

      {/* Subtitle */}
      {subtitle && (
        <AppText
          style={{
            fontSize: 15,
            color: "#666",
            lineHeight: 22,
          }}
        >
          {subtitle}
        </AppText>
      )}

      {meta && meta.length > 0 && <FeatureCardMeta items={meta} />}
    </Animated.View>
  );
}
