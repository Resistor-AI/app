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
        bold: ["Inter_700Bold", "System"],
        mono: ["JetBrainsMono_400Regular", "monospace"],
      },
      letterSpacing: {
        tighter: "-0.8px", // Use for H1 "Reclaim Your Brain"
        tight: "-0.4px", // Use for H2/H3
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

        // THE TEXT (Typography)
        textPrimary: "#FFFFFF",
        textSecondary: "#A1A1AA", // Zinc-400
        textTertiary: "#52525B", // Zinc-600
      },
    },
  },
  plugins: [],
};
