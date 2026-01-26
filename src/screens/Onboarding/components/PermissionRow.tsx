import { View, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import Animated, { ZoomIn } from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { COLORS } from "@/src/constants";
import { PermissionKey } from "@/src/types/PermissionsScreen";

interface PermissionRowProps {
  title: string;
  desc: string;
  icon: string;
  permissionKey: PermissionKey;
  status: "granted" | "denied" | "pending";
  index: number;
  onPress: (key: PermissionKey) => void;
  disabled: boolean;
}

export function PermissionRow({
  title,
  desc,
  icon,
  permissionKey,
  status,
  index,
  onPress,
  disabled,
}: PermissionRowProps) {
  const getIcon = () => {
    if (status === "granted") return "✓";
    if (status === "denied") return "✕";
    return "→";
  };

  const getIconBg = () => {
    if (status === "granted") return COLORS.deepPurple || "#5E5CE6";
    if (status === "denied") return "#FF4444";
    return `${COLORS.deepPurple || "#5E5CE6"}80`;
  };

  return (
    <Animated.View
      entering={ZoomIn.delay(800 + index * 100)
        .duration(400)
        .springify()}
    >
      <Pressable onPress={() => onPress(permissionKey)} disabled={disabled}>
        <BlurView
          intensity={50}
          tint="dark"
          className="rounded-3xl overflow-hidden border border-white/15"
          style={{ opacity: status === "granted" ? 0.7 : 1 }}
        >
          <View className="flex-row items-center p-4 gap-4">
            <View
              className="size-12 rounded-2xl items-center justify-center"
              style={{ backgroundColor: `${COLORS.deepPurple}30` }}
            >
              <AppText className="text-2xl mt-1">{icon}</AppText>
            </View>

            <View className="flex-1">
              <AppText variant="h5">{title}</AppText>
              <AppText variant="body-sm" color="secondary" className="mt-1">
                {desc}
              </AppText>
            </View>

            <View
              className="size-8 rounded-full items-center justify-center"
              style={{ backgroundColor: getIconBg() }}
            >
              <AppText className="text-base text-white">{getIcon()}</AppText>
            </View>
          </View>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
}
