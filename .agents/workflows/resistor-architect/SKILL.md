---
name: resistor-mobile-architect
description: Scaffold Resistor AI mobile app structure using Pragmatic Atomic Design with Colocation. Enforce 120-line logic limit. Screen-specific components live inside the screen folder.
---

# Goal

Build a scalable Expo app. Global UI goes in `src/components`. Screen-specific UI is colocated in `src/screens`. `app/` routes are thin wrappers.

# 1. The Directory Structure (Strict)

Use `src/screens/` for full-page views. Colocate specific components.

```text
/
├── app/                     # ROUTES ONLY (The Router)
│   ├── index.tsx            # Imports <HomeScreen />
│   └── (onboarding)/
│       └── toxicity.tsx     # Imports <ToxicityScreen />
│
├── src/
│   ├── components/          # GLOBAL REUSABLE UI (Used in 2+ screens)
│   │   ├── atoms/           # Base (GlassPanel, NeonText, HapticButton)
│   │   ├── molecules/       # Interactive (SettingRow, StatCard)
│   │   └── organisms/       # Complex Global (e.g., GlobalNavBar)
│   │
│   ├── screens/             # PAGE VIEWS (The Assemblers)
│   │   ├── Home/
│   │   │   ├── HomeScreen.tsx
│   │   │   └── components/  # LOCAL COMPONENTS (Specific to Home)
│   │   │       └── PulseChart.tsx
│   │   │
│   │   ├── Onboarding/
│   │   │   ├── ToxicityScreen.tsx
│   │   │   ├── FrictionScreen.tsx
│   │   │   └── components/  # LOCAL COMPONENTS (Specific to Onboarding)
│   │   │       └── AppGrid.tsx
│   │
│   └── lib/                 # LOGIC (haptics.ts, theme.ts)
```
