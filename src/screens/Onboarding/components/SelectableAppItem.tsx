import React, { memo } from "react";
import { View, Switch, Image } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { COLORS } from "@/src/constants";
import { useAppIcon } from "@/src/hooks/useInstalledApps";
import { SelectableAppItemProps } from "@/src/types/Onboarding/AppSelectionScreen";

export const SelectableAppItem = memo(
  ({ app, isSelected, onToggle }: SelectableAppItemProps) => {
    const { data: icon } = useAppIcon(app.packageName);

    return (
      <Animated.View entering={FadeIn}>
        <View className="flex-row items-center p-4 rounded-xl border mb-3 bg-white/5 border-white/10 pl-4">
          {icon ? (
            <Image
              source={{ uri: `data:image/png;base64,${icon}` }}
              className="size-10 rounded-lg"
              fadeDuration={300}
            />
          ) : (
            <View className="w-10 h-10 rounded-lg bg-white/10 items-center justify-center">
              <AppText className="text-xl uppercase">
                {app.label.charAt(0)}
              </AppText>
            </View>
          )}

          <AppText variant="body" className="flex-1 ml-3">
            {app.label}
          </AppText>

          <Switch
            value={isSelected}
            onValueChange={() => onToggle(app.packageName)}
            trackColor={{ false: "#3e3e3e", true: COLORS.amber }}
            thumbColor={"#fff"}
          />
        </View>
      </Animated.View>
    );
  },
);
