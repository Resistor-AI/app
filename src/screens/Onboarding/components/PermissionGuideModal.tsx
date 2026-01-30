import { View, Modal, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { OnboardingButton } from "./OnboardingButton";
import { PermissionGuideModalProps } from "@/src/types/Onboarding/PermissionsScreen";

export function PermissionGuideModal({
  visible,
  title,
  subtitle,
  description,
  onClose,
  onAction,
  actionLabel = "Open Settings",
  icon = "⚙️",
}: PermissionGuideModalProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      {!visible ? null : (
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          {/* Backdrop */}
          <Pressable
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
            onPress={onClose}
          >
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}
            />
          </Pressable>

          {/* Bottom Sheet */}
          <Animated.View
            entering={SlideInDown.duration(300)}
            exiting={SlideOutDown.duration(300)}
            style={{
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              overflow: "hidden",
              backgroundColor: "transparent",
              shadowColor: "#000",
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 10,
            }}
          >
            <BlurView intensity={90} tint="dark">
              <View
                style={{
                  padding: 24,
                  paddingBottom: 40,
                  alignItems: "center",
                  backgroundColor: "rgba(24,24,27,0.4)",
                }}
              >
                {/* Header */}
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    marginBottom: 24,
                  }}
                >
                  <AppText style={{ fontSize: 36, marginBottom: 12 }}>
                    {icon}
                  </AppText>

                  <AppText variant="h3" center style={{ marginBottom: 8 }}>
                    {title}
                  </AppText>

                  {subtitle && (
                    <AppText
                      variant="body"
                      color="secondary"
                      center
                      style={{ marginBottom: 16 }}
                    >
                      {subtitle}
                    </AppText>
                  )}

                  {Array.isArray(description) ? (
                    <View style={{ alignSelf: "center", maxWidth: "90%" }}>
                      {description.map((item, index) => (
                        <View
                          key={index}
                          style={{ flexDirection: "row", marginBottom: 8 }}
                        >
                          <AppText style={{ marginRight: 8 }}>•</AppText>
                          <AppText variant="body" color="secondary">
                            {item}
                          </AppText>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <AppText variant="body" color="secondary" center>
                      {description}
                    </AppText>
                  )}
                </View>

                {/* Actions */}
                <View style={{ width: "100%", gap: 16 }}>
                  <OnboardingButton
                    label={actionLabel}
                    variant="purple"
                    showArrow={false}
                    onPress={onAction}
                  />

                  <Pressable onPress={onClose} className="items-center py-6">
                    <AppText>Cancel</AppText>
                  </Pressable>
                </View>
              </View>
            </BlurView>
          </Animated.View>
        </View>
      )}
    </Modal>
  );
}
