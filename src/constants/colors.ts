/**
 * Brand Colors - Single source of truth
 * These match the values in tailwind.config.js
 */
export const COLORS = {
  // THE VOID (Backgrounds)
  background: "#050505",
  surface: "#121212",
  surfaceHighlight: "#1E1E1E",

  // THE ENERGY (Brand Colors)
  neonRed: "#FF453A",
  electricBlue: "#0A84FF",
  deepPurple: "#BF5AF2",
  successGreen: "#30D158",
  amber: "#F59E0B",
  amberLight: "#FBBF24",

  // THE TEXT (Typography)
  textPrimary: "#FFFFFF",
  textSecondary: "#A1A1AA",
  textTertiary: "#52525B",
} as const;

export type ColorName = keyof typeof COLORS;
