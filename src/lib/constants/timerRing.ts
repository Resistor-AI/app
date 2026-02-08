import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Ring dimensions for the timer
export const RING_SIZE = SCREEN_WIDTH * 0.72;
export const STROKE_WIDTH = 6;
export const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
