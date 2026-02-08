import { View, Modal, Pressable } from "react-native";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from "react-native-reanimated";
import { PermissionGuideModalProps } from "@/src/types/Onboarding/PermissionsScreen";
import { PermissionGuideContent } from "./PermissionGuideContent";

export function PermissionGuideModal({
  visible, title, subtitle, description, onClose, onAction,
  actionLabel = "Open Settings", icon = "⚙️",
}: PermissionGuideModalProps) {
  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      {!visible ? null : (
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Pressable
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
            onPress={onClose}
          >
            <Animated.View
              entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)}
              style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}
            />
          </Pressable>
          <Animated.View
            entering={SlideInDown.duration(300)} exiting={SlideOutDown.duration(300)}
            style={{
              borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: "hidden",
              backgroundColor: "transparent", shadowColor: "#000",
              shadowOpacity: 0.3, shadowRadius: 10, elevation: 10,
            }}
          >
            <PermissionGuideContent
              title={title} subtitle={subtitle} description={description}
              onClose={onClose} onAction={onAction} actionLabel={actionLabel} icon={icon}
            />
          </Animated.View>
        </View>
      )}
    </Modal>
  );
}
