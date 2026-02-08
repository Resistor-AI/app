import { View, Pressable, Linking } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import { ShieldAlert, Bell, ChevronRight, RefreshCw } from "lucide-react-native";
import { COLORS } from "@/src/constants/colors";
import { PermissionBannerProps } from "@/src/types/Dashboard/PermissionBanner";

const PERMISSION_CONFIG = {
  accessibility: {
    icon: ShieldAlert,
    label: "App Blocking",
    onPress: () => Linking.sendIntent("android.settings.ACCESSIBILITY_SETTINGS"),
  },
  notifications: {
    icon: Bell,
    label: "Notifications",
    onPress: () => Linking.openSettings(),
  },
} as const;

function PermissionChip({ permKey }: { permKey: keyof typeof PERMISSION_CONFIG }) {
  const { icon: Icon, label, onPress } = PERMISSION_CONFIG[permKey];

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-2 bg-amber-500/10 border border-amber-500/15 rounded-2xl px-3.5 py-2.5"
    >
      <Icon size={14} color={COLORS.amber} />
      <AppText variant="caption" className="text-amber-200 font-medium">
        {label}
      </AppText>
      <ChevronRight size={12} color={COLORS.amber} />
    </Pressable>
  );
}

function RestartChip() {
  return (
    <Pressable
      onPress={() => Linking.sendIntent("android.settings.ACCESSIBILITY_SETTINGS")}
      className="flex-row items-center gap-2 bg-red-500/10 border border-red-500/15 rounded-2xl px-3.5 py-2.5"
    >
      <RefreshCw size={14} color="#ef4444" />
      <AppText variant="caption" className="text-red-300 font-medium">
        Shield stopped — toggle off & on
      </AppText>
      <ChevronRight size={12} color="#ef4444" />
    </Pressable>
  );
}

export function PermissionBanner({ permissions }: PermissionBannerProps) {
  if (!permissions) return null;

  const needsRestart = permissions.accessibility && !permissions.accessibilityRunning;

  const missing = (Object.keys(PERMISSION_CONFIG) as (keyof typeof PERMISSION_CONFIG)[])
    .filter((key) => !permissions[key]);

  if (missing.length === 0 && !needsRestart) return null;

  return (
    <View className="px-6 -mt-2 mb-4">
      {needsRestart ? (
        <AppText variant="caption" color="secondary" className="mb-2">
          Shield needs a restart to work
        </AppText>
      ) : (
        <AppText variant="caption" color="secondary" className="mb-2">
          Enable to protect your focus
        </AppText>
      )}
      <View className="flex-row flex-wrap gap-2">
        {needsRestart && <RestartChip />}
        {missing.map((key) => (
          <PermissionChip key={key} permKey={key} />
        ))}
      </View>
    </View>
  );
}
