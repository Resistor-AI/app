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

interface PermissionGuideModalProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  description: string | string[];
  onClose: () => void;
  onAction: () => void;
  actionLabel?: string;
  icon?: string;
}

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
  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        {/* Backdrop */}
        <Pressable
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          onPress={onClose}
        >
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}
          />
        </Pressable>

        {/* Bottom Sheet - Glassmorphism */}
        <Animated.View
          entering={SlideInDown.duration(300)}
          exiting={SlideOutDown.duration(300)}
          style={{
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            overflow: "hidden", // Required for BlurView to respect border radius
            borderTopWidth: 1,
            borderTopColor: "rgba(255,255,255,0.2)",
            backgroundColor: "transparent",
            // Shadow for depth
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 10,
          }}
        >
          <BlurView
            intensity={90}
            tint="dark"
            style={{
              padding: 24,
              paddingBottom: 40,
              alignItems: "center",
              backgroundColor: "rgba(20, 20, 20, 0.4)", // Slight tint for better text contrast
            }}
          >
            <View
              style={{ width: "100%", alignItems: "center", marginBottom: 32 }}
            >
              <AppText style={{ fontSize: 48, marginBottom: 16 }}>
                {icon}
              </AppText>
              <AppText variant="h3" center style={{ marginBottom: 12 }}>
                {title}
              </AppText>

              {subtitle && (
                <AppText
                  variant="body"
                  color="secondary"
                  center
                  style={{ marginBottom: 20 }}
                >
                  {subtitle}
                </AppText>
              )}

              {Array.isArray(description) ? (
                <View
                  style={{
                    alignSelf: "center",
                    width: "auto",
                    maxWidth: "90%",
                  }}
                >
                  {description.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        marginBottom: 12,
                        paddingRight: 8,
                      }}
                    >
                      <AppText
                        style={{
                          marginRight: 12,
                          fontSize: 16,
                          lineHeight: 22,
                        }}
                      >
                        •
                      </AppText>
                      <AppText
                        variant="body"
                        color="secondary"
                        style={{ lineHeight: 22, flexShrink: 1 }}
                      >
                        {item}
                      </AppText>
                    </View>
                  ))}
                </View>
              ) : (
                <AppText
                  variant="body"
                  color="secondary"
                  center
                  style={{ lineHeight: 24 }}
                >
                  {description}
                </AppText>
              )}
            </View>

            <View style={{ width: "100%", gap: 16 }}>
              <OnboardingButton
                label={actionLabel}
                variant="purple"
                showArrow={false}
                onPress={onAction}
                style={{ marginTop: 0 }}
              />

              <Pressable
                onPress={onClose}
                style={{ alignItems: "center", paddingVertical: 12 }}
              >
                <AppText variant="body" style={{ color: "white" }}>
                  Cancel
                </AppText>
              </Pressable>
            </View>
          </BlurView>
        </Animated.View>
      </View>
    </Modal>
  );
}
