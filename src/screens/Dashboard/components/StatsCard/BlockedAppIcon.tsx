import { memo } from "react";
import { Image } from "react-native";
import Animated from "react-native-reanimated";
import { useAppIcon } from "@/src/hooks/useInstalledApps";
import { useStaggeredEntry } from "@/src/hooks/animations/useStaggeredEntry";
import { BlockedAppIconProps } from "@/src/types/Dashboard/StatsCard";

export const BlockedAppIcon = memo(function BlockedAppIcon({
  packageName, index,
}: BlockedAppIconProps) {
  const { data: icon } = useAppIcon(packageName);

  const { animatedStyle } = useStaggeredEntry({
    index,
    staggerDelay: 50,
    duration: 300,
    translateY: 5,
    initialScale: 0.8,
  });

  if (!icon) return null;

  return (
    <Animated.View
      style={[animatedStyle, { zIndex: 5 - index }]}
      className={`size-5 rounded-full border border-[#18181b] overflow-hidden bg-zinc-800 items-center justify-center ${index > 0 ? "-ml-2" : ""}`}
    >
      <Image
        source={{ uri: `data:image/png;base64,${icon}` }}
        className="w-full h-full"
        resizeMode="contain"
      />
    </Animated.View>
  );
});
