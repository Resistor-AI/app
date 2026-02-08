import { View } from "react-native";
import { BlurView } from "expo-blur";
import { AppText } from "@/src/components/atoms/text";
import { StatusBadgeProps } from "@/src/types/Focus/TimerRing";

export function StatusBadge({ theme, priority, isBreak }: StatusBadgeProps) {
  const StatusIcon = theme.Icon;
  const shouldFillIcon = priority === "urgent" || priority === "high" || isBreak;

  return (
    <View className="items-center mb-8">
      <View
        className="overflow-hidden rounded-full"
        style={{ borderWidth: 1, borderColor: `${theme.primary}30` }}
      >
        <BlurView intensity={40} tint="dark">
          <View
            className="flex-row items-center gap-2 px-5 py-2.5"
            style={{ backgroundColor: theme.soft }}
          >
            <StatusIcon
              size={18}
              color={theme.primary}
              fill={shouldFillIcon ? theme.primary : "transparent"}
            />
            <AppText
              variant="label"
              className="font-bold tracking-[2px] uppercase"
              style={{ color: theme.primary }}
            >
              {theme.label}
            </AppText>
          </View>
        </BlurView>
      </View>
    </View>
  );
}
