/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter_400Regular", "System"],
        medium: ["Inter_500Medium", "System"],
        semibold: ["Inter_600SemiBold", "System"],
        bold: ["Inter_700Bold", "System"],
        mono: ["JetBrainsMono_400Regular", "monospace"],
        outfit: ["Outfit_400Regular", "System"],
        "outfit-medium": ["Outfit_500Medium", "System"],
        "outfit-semibold": ["Outfit_600SemiBold", "System"],
        "outfit-bold": ["Outfit_700Bold", "System"],
        "outfit-extrabold": ["Outfit_800ExtraBold", "System"],
      },
      letterSpacing: {
        tighter: "-0.8px",
        tight: "-0.4px",
      },
      colors: {
        // THE VOID (Backgrounds)
        background: "#050505", // OLED-optimized Obsidian (Not pure black)
        surface: "#121212", // Card/Sheet background
        surfaceHighlight: "#1E1E1E", // Hover/Press state

        // THE ENERGY (Brand Colors)
        neonRed: "#FF453A", // The Shield / Friction / Stop
        electricBlue: "#0A84FF", // The Brain / AI / Active
        deepPurple: "#5E5CE6", // Secondary Gradients
        successGreen: "#30D158", // Pulse / Completion
        amber: "#F59E0B", // Warning / Attention
        amberLight: "#FBBF24", // Amber accent

        // THE TEXT (Typography)
        textPrimary: "#FFFFFF",
        textSecondary: "#A1A1AA", // Zinc-400
        textTertiary: "#52525B", // Zinc-600
      },
    },
  },
  plugins: [],
};
