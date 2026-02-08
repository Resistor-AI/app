import Animated, { useAnimatedProps, interpolateColor } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { HoldRingProps } from "@/src/types/Block/components";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function HoldRing({ progress, size, strokeWidth }: HoldRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProps = useAnimatedProps(() => {
    const offset = circumference * (1 - progress.value);
    return { strokeDashoffset: offset };
  });

  const animatedBgProps = useAnimatedProps(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      ["rgba(255,255,255,0.06)", "rgba(255,255,255,0.15)"],
    );
    return { stroke: color };
  });

  return (
    <Svg
      width={size}
      height={size}
      style={{ transform: [{ rotate: "-90deg" }] }}
    >
      <AnimatedCircle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        fill="transparent"
        animatedProps={animatedBgProps}
      />
      <AnimatedCircle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#FFFFFF"
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeLinecap="round"
        animatedProps={animatedProps}
      />
    </Svg>
  );
}
