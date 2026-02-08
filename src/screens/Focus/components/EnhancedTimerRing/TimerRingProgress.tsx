import Animated from "react-native-reanimated";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import {
  RING_SIZE,
  STROKE_WIDTH,
  RADIUS,
  CIRCUMFERENCE,
} from "./TimerRingConstants";
import { TimerRingProgressProps } from "@/src/types/Focus/TimerRing";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function TimerRingProgress({
  theme,
  ringContainerStyle,
  glowStyle,
  progressStrokeStyle,
  indicatorStyle,
}: TimerRingProgressProps) {
  return (
    <>
      {/* Outer glow effect */}
      <Animated.View
        style={[
          glowStyle,
          {
            position: "absolute",
            width: RING_SIZE * 0.9,
            height: RING_SIZE * 0.9,
            borderRadius: RING_SIZE,
            backgroundColor: theme.glow,
          },
        ]}
      />

      {/* Ring Container */}
      <Animated.View style={[ringContainerStyle, { position: "absolute" }]}>
        <Svg width={RING_SIZE} height={RING_SIZE}>
          <Defs>
            <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={theme.primary} />
              <Stop offset="100%" stopColor={theme.secondary} />
            </LinearGradient>
          </Defs>

          {/* Track Ring */}
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
          />

          {/* Progress Ring */}
          <AnimatedCircle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            stroke="url(#progressGradient)"
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animatedProps={progressStrokeStyle}
            rotation="-90"
            origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
          />
        </Svg>

        {/* Progress Indicator Dot */}
        <Animated.View
          style={[
            indicatorStyle,
            {
              position: "absolute",
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: theme.primary,
              shadowColor: theme.primary,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 8,
              elevation: 8,
              borderWidth: 3,
              borderColor: "#ffffff",
            },
          ]}
        />
      </Animated.View>
    </>
  );
}
