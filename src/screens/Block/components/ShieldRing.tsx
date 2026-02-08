import { View, Image } from "react-native";
import Animated from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { Shield } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import { COLORS } from "@/src/constants/colors";
import { usePulseAnimation } from "@/src/hooks/animations/usePulseAnimation";

const RING = 180;
const STROKE = 4;
const R = (RING - STROKE) / 2;

export function ShieldRing({ icon, appName }: { icon?: string | null; appName?: string }) {
  const { animatedStyle: pulseStyle } = usePulseAnimation({
    isActive: true, duration: 3000, minOpacity: 0.15, maxOpacity: 0.4,
  });

  return (
    <View className="items-center mb-8">
      {/* Glow behind ring */}
      <Animated.View
        pointerEvents="none"
        style={[
          pulseStyle,
          {
            position: "absolute", top: 10, width: 160, height: 160,
            borderRadius: 80, backgroundColor: COLORS.deepPurple,
          },
        ]}
      />

      {/* Ring + icon */}
      <View style={{ width: RING, height: RING }} className="items-center justify-center">
        <Svg width={RING} height={RING} style={{ position: "absolute" }}>
          <Circle
            cx={RING / 2} cy={RING / 2} r={R}
            stroke={`${COLORS.deepPurple}30`} strokeWidth={STROKE} fill="transparent"
          />
        </Svg>

        {/* App icon inside ring */}
        {icon ? (
          <Image
            source={{ uri: `data:image/png;base64,${icon}` }}
            className="size-16 rounded-2xl" resizeMode="contain"
          />
        ) : (
          <View className="size-16 rounded-2xl bg-zinc-800 items-center justify-center">
            <AppText className="text-3xl">📱</AppText>
          </View>
        )}

        {/* Shield badge */}
        <View
          className="absolute -bottom-0.5 size-9 rounded-full items-center justify-center border-[3px] border-background"
          style={{ backgroundColor: COLORS.deepPurple }}
        >
          <Shield size={15} color="#fff" />
        </View>
      </View>

      {/* App name + status */}
      <AppText variant="h2" className="text-white text-center mt-5 mb-1">
        {appName ?? "This app"}
      </AppText>
      <AppText variant="body-sm" color="tertiary">
        blocked by your shield
      </AppText>
    </View>
  );
}
