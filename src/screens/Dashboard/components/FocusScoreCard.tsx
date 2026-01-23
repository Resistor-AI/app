import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { AppText } from "@/src/components/atoms/text";
import { COLORS } from "@/src/constants";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface FocusScoreCardProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export const FocusScoreCard = ({
  score,
  size = 200,
  strokeWidth = 15,
}: FocusScoreCardProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withTiming(score / 100, {
      duration: 1500,
      easing: Easing.out(Easing.exp),
    });
  }, [score]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: "-90deg" }] }}
      >
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.surfaceHighlight}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <AnimatedCircle
          {...({
            cx: size / 2,
            cy: size / 2,
            r: radius,
            stroke: COLORS.successGreen,
            strokeWidth: strokeWidth,
            fill: "transparent",
            strokeDasharray: circumference,
            animatedProps: animatedProps,
            strokeLinecap: "round",
          } as any)}
        />
      </Svg>

      <View className="absolute items-center justify-center">
        <AppText variant="display" className="text-6xl">
          {Math.round(score)}
        </AppText>
        <AppText
          variant="caption"
          color="secondary"
          className="uppercase tracking-widest mt-1"
        >
          Focus Score
        </AppText>
      </View>
    </View>
  );
};
