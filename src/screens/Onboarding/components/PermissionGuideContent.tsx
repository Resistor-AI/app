import { View, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { AppText } from "@/src/components/atoms/text";
import { OnboardingButton } from "./OnboardingButton";
import { PermissionGuideContentProps } from "@/src/types/Onboarding/PermissionsScreen";

export function PermissionGuideContent({
  title, subtitle, description, onClose, onAction,
  actionLabel = "Open Settings", icon = "⚙️",
}: PermissionGuideContentProps) {
  return (
    <BlurView intensity={90} tint="dark">
      <View
        style={{
          padding: 24, paddingBottom: 40,
          alignItems: "center", backgroundColor: "rgba(24,24,27,0.4)",
        }}
      >
        <View style={{ width: "100%", alignItems: "center", marginBottom: 24 }}>
          <AppText style={{ fontSize: 36, marginBottom: 12 }}>{icon}</AppText>
          <AppText variant="h3" center style={{ marginBottom: 8 }}>{title}</AppText>
          {subtitle && (
            <AppText variant="body" color="secondary" center style={{ marginBottom: 16 }}>
              {subtitle}
            </AppText>
          )}
          {Array.isArray(description) ? (
            <View style={{ alignSelf: "center", maxWidth: "90%" }}>
              {description.map((item, index) => (
                <View key={index} style={{ flexDirection: "row", marginBottom: 8 }}>
                  <AppText style={{ marginRight: 8 }}>•</AppText>
                  <AppText variant="body" color="secondary">{item}</AppText>
                </View>
              ))}
            </View>
          ) : (
            <AppText variant="body" color="secondary" center>{description}</AppText>
          )}
        </View>
        <View style={{ width: "100%", gap: 16 }}>
          <OnboardingButton label={actionLabel} variant="purple" showArrow={false} onPress={onAction} />
          <Pressable onPress={onClose} className="items-center py-6">
            <AppText>Cancel</AppText>
          </Pressable>
        </View>
      </View>
    </BlurView>
  );
}
