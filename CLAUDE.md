# Resistor AI Mobile - Project Rules

## Goal

Build a scalable Expo app using **Pragmatic Atomic Design with Colocation**.

- Global UI → `src/components/`
- Screen-specific UI → colocated in `src/screens/[Screen]/components/`
- Routes (`app/`) → thin wrappers only
- Types → **always** in `src/types/[Feature]/` (global types folder)
- **NO barrel exports** (`index.ts`) — direct imports only
- **NO `.types.ts` files** — types live in global types folder only

---

## 1. The Three Golden Rules

### Rule 1: Line Limits

| Scope | Max Lines |
|-------|-----------|
| Functions | 20-30 (strict) |
| Components (`.tsx`) | 150-200 |
| Screens | 200 |
| Utility files | 150-200 |
| Type files (`src/types/`) | 100-150 |
| Route files (`app/`) | 10 |

If a file approaches its limit:

1. **Extract sub-components** into a folder structure
2. **Move types** to `src/types/[Feature]/`
3. **Extract logic** to hooks or utilities
4. **Split functions** — no single function should exceed 30 lines

### Rule 2: Types Never Live With Components

**NEVER** put `interface` or `type` definitions in the same file as components or logic. **NEVER** create `.types.ts` files next to components. All types go in `src/types/`.

```tsx
// ❌ WRONG: Types in component file
interface ButtonProps {
  label: string;
}
export function Button({ label }: ButtonProps) { ... }

// ❌ WRONG: Colocated .types.ts file
// Button.types.ts (next to Button.tsx) — FORBIDDEN

// ✅ CORRECT: Types in global types folder
// src/types/components/atoms.ts
export interface ButtonProps {
  label: string;
}

// Button.tsx
import { ButtonProps } from '@/src/types/components/atoms';
export function Button({ label }: ButtonProps) { ... }
```

### Rule 3: No Barrel Exports (No index.ts)

**NEVER** create `index.ts` files for re-exporting. Always use direct imports.

```tsx
// ❌ WRONG: Barrel export
// components/atoms/Button/index.ts
export { Button } from './Button';

// ✅ CORRECT: Direct import
import { Button } from '@/components/atoms/Button/Button';
```

---

## 2. Directory Structure

```text
/
├── app/                     # ROUTES ONLY (max 10 lines each)
│   ├── index.tsx
│   └── (onboarding)/
│       └── toxicity.tsx
│
├── src/
│   ├── components/          # GLOBAL REUSABLE UI (2+ screens)
│   │   ├── atoms/
│   │   │   ├── Button/
│   │   │   │   └── Button.tsx
│   │   │   └── GlassPanel/
│   │   │       └── GlassPanel.tsx
│   │   ├── molecules/
│   │   └── organisms/
│   │
│   ├── screens/
│   │   ├── Home/
│   │   │   ├── HomeScreen.tsx
│   │   │   └── components/
│   │   │       └── PulseChart/
│   │   │           ├── PulseChart.tsx
│   │   │           └── PulseChartBar.tsx
│   │   │
│   │   └── Onboarding/
│   │       ├── ToxicityScreen.tsx
│   │       └── components/
│   │
│   ├── types/               # ALL type definitions live here
│   │   ├── Focus/
│   │   │   ├── index.ts         # Core Focus types
│   │   │   ├── TimerRing.ts     # TimerRing-specific types
│   │   │   └── components.ts    # Focus screen component props
│   │   ├── Dashboard/
│   │   │   ├── index.ts
│   │   │   ├── ActiveCard.ts
│   │   │   └── PriorityQueue.ts
│   │   ├── Onboarding/
│   │   │   ├── components.ts
│   │   │   └── AppSelectionScreen.ts
│   │   ├── components/
│   │   │   ├── atoms.ts         # Global atom component props
│   │   │   └── molecules.ts     # Global molecule component props
│   │   ├── animations.ts
│   │   ├── store.ts
│   │   └── common/
│   │       └── index.ts
│   │
│   ├── lib/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── constants/
│   │
│   └── constants/
```

**Notice:** No `index.ts` barrel files. No `.types.ts` files anywhere.

---

## 3. The Folder Expansion Pattern

When ANY component approaches 100 lines, convert it to a folder:

### Before (Single File Approaching Limit)
```text
atoms/
└── Button.tsx        # 85 lines and growing...
```

### After (Folder Structure — NO index.ts)
```text
atoms/
└── Button/
    ├── Button.tsx         # Main component (<100 lines)
    └── ButtonIcon.tsx     # Sub-component (if needed)
```

Types go in `src/types/components/atoms.ts`, NOT next to the component.

### Import Pattern (Direct Paths)
```tsx
// ✅ CORRECT: Direct imports
import { Button } from '@/components/atoms/Button/Button';
import { ButtonProps } from '@/src/types/components/atoms';

// ❌ WRONG: Barrel import
import { Button } from '@/components/atoms/Button';

// ❌ WRONG: Colocated .types.ts
import { ButtonProps } from '@/components/atoms/Button/Button.types';
```

---

## 4. Type File Rules

### Where Types Live

ALL types live in `src/types/`. The folder structure mirrors features:

| Types For | Location |
|-----------|----------|
| Focus screen components | `src/types/Focus/components.ts` |
| Focus domain types | `src/types/Focus/index.ts` |
| Dashboard types | `src/types/Dashboard/index.ts` |
| Global atom props | `src/types/components/atoms.ts` |
| Global molecule props | `src/types/components/molecules.ts` |
| Animation types | `src/types/animations.ts` |
| Store types | `src/types/store.ts` |

### Max Lines for Type Files: 150

If a type file approaches 150 lines, split by subdomain into a new file within the same folder.

### What Goes in Type Files
```tsx
// src/types/components/atoms.ts
import { ReactNode } from 'react';
import { PressableProps } from 'react-native';

export interface ButtonProps extends PressableProps {
  label: string;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  isLoading?: boolean;
}

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
```

### Forbidden Type Patterns
- ❌ `.types.ts` files next to components
- ❌ Types/interfaces inside `.tsx` or `.ts` logic files
- ❌ `index.ts` barrel re-exports of types

---

## 5. Strict Line Limits

| File Type | Max Lines | If Exceeded |
|-----------|-----------|-------------|
| Route files (`app/`) | 10 | You're doing it wrong |
| Functions | 20-30 | Split into smaller functions |
| Component files (`.tsx`) | 150-200 | Extract to folder + sub-components |
| Screen files | 200 | Extract to `./components/` |
| Type files (`src/types/`) | 100-150 | Split by domain |
| Hook files | 150-200 | Split into smaller hooks |
| Utility files | 150-200 | Split into focused modules |

**Counting rules:**
- Imports count toward the limit
- Empty lines count
- Comments count
- Individual functions must stay under 30 lines — this is strict

---

## 6. Extraction Triggers

### Extract Sub-Components When:
- A section of JSX is 20+ lines
- Repeated patterns exist within the file
- A piece has clear responsibility boundaries

### Move Types to `src/types/` When:
- You have ANY `interface` or `type` definition
- You're importing types from elsewhere to extend them

### Extract to Hook When:
- State logic exceeds 15 lines
- `useEffect` logic is complex
- Logic could be reused

### Extract to Utility When:
- Pure functions exceed 10 lines
- Transformation/formatting logic
- Reusable calculations

---

## 7. Component Placement Rules

### Decision Tree
```
Is it used in 2+ screens?
├── YES → src/components/[atoms|molecules|organisms]/
└── NO → src/screens/[Screen]/components/
```

### Import Rules (Direct Paths Only)

| Location | Can Import From |
|----------|-----------------|
| `app/**` | `@/screens/[X]/[X]Screen` ONLY |
| `src/screens/[X]/` | `@/components/[level]/[Name]/[Name]`, `./components/[Name]`, `@/lib/**`, `@/src/types/**` |
| `src/components/atoms/` | `@/lib/**`, `@/src/types/**` |
| `src/components/molecules/` | `@/components/atoms/[Name]/[Name]`, `@/lib/**`, `@/src/types/**` |
| `src/components/organisms/` | `atoms/[Name]/[Name]`, `molecules/[Name]/[Name]`, `@/lib/**`, `@/src/types/**` |

### Forbidden
- ❌ `index.ts` files (barrel exports)
- ❌ `.types.ts` files (colocated type files)
- ❌ Importing from folder without specifying file
- ❌ Cross-screen imports
- ❌ Types in component files
- ❌ Files over their limit (see line limits table)
- ❌ Functions over 30 lines

---

## 8. Examples

### Screen with Types in Global Folder
```tsx
// src/types/Home/index.ts
export interface HomeScreenProps {
  initialTab?: string;
}

export interface DashboardData {
  score: number;
  streak: number;
  lastSync: Date;
}
```

```tsx
// HomeScreen.tsx
import { View } from 'react-native';
import { GlassPanel } from '@/components/atoms/GlassPanel/GlassPanel';
import { PulseChart } from './components/PulseChart/PulseChart';
import { useDashboard } from '@/lib/hooks/useDashboard';
import { HomeScreenProps } from '@/src/types/Home';

export default function HomeScreen({ initialTab }: HomeScreenProps) {
  const { data, isLoading } = useDashboard();

  if (isLoading) return <LoadingState />;

  return (
    <View>
      <GlassPanel>
        <PulseChart data={data} />
      </GlassPanel>
    </View>
  );
}
```

### Component with Types in Global Folder
```tsx
// src/types/components/molecules.ts
export interface StatCardProps {
  title: string;
  value: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}
```

```tsx
// components/molecules/StatCard/StatCard.tsx
import { View, Text } from 'react-native';
import { GlassPanel } from '@/components/atoms/GlassPanel/GlassPanel';
import { TrendIndicator } from './TrendIndicator';
import { StatCardProps } from '@/src/types/components/molecules';

export function StatCard({ title, value, trend, icon }: StatCardProps) {
  return (
    <GlassPanel>
      <View>
        <Text>{title}</Text>
        <Text>{value}</Text>
        {trend && <TrendIndicator direction={trend} />}
      </View>
    </GlassPanel>
  );
}
```

---

## 9. Quick Reference

```
✅ DO:
- Keep functions under 30 lines (strict)
- Keep components/screens under 150-200 lines
- Keep type files under 100-150 lines
- Put ALL types in src/types/[Feature]/
- Use folder structure for complex components
- Use direct imports (full path to file)
- Extract early, extract often

❌ DON'T:
- Create index.ts files (barrel exports)
- Create .types.ts files (colocated types)
- Import from folder path without file name
- Put interfaces/types in component files
- Write functions over 30 lines
- Duplicate components across screens
- Import across screen boundaries
```
