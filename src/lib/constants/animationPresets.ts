import { Easing } from "react-native-reanimated";

export const ANIMATION_PRESETS = {
  timing: {
    fast: { duration: 150, easing: Easing.out(Easing.ease) },
    normal: { duration: 300, easing: Easing.inOut(Easing.ease) },
    slow: { duration: 600, easing: Easing.inOut(Easing.ease) },
  },
  spring: {
    bouncy: { damping: 8, stiffness: 100, mass: 0.5 },
    gentle: { damping: 15, stiffness: 100, mass: 1 },
    snappy: { damping: 12, stiffness: 150, mass: 0.8 },
  },
  stagger: { fast: 50, normal: 100, slow: 150 },
} as const;
