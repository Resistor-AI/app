import { View } from "react-native";
import Animated from "react-native-reanimated";
import { AppText } from "@/src/components/atoms/text";
import { TimeDisplayProps } from "@/src/types/Focus/TimerRing";

export function TimeDisplay({ minutes, seconds, colonStyle, theme }: TimeDisplayProps) {
  return (
    <View className="flex-row items-center">
      <AppText
        className="text-[72px] font-extrabold text-white tracking-tight"
        style={{ fontVariant: ["tabular-nums"], includeFontPadding: false }}
      >
        {String(minutes).padStart(2, "0")}
      </AppText>

      <Animated.View style={colonStyle}>
        <AppText
          className="text-[58px] font-extrabold mx-0.5 -mt-0.5"
          style={{ color: theme.primary }}
        >
          :
        </AppText>
      </Animated.View>

      <AppText
        className="text-[72px] font-extrabold text-white tracking-tight"
        style={{ fontVariant: ["tabular-nums"], includeFontPadding: false }}
      >
        {String(seconds).padStart(2, "0")}
      </AppText>
    </View>
  );
}
