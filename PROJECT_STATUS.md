# Resistor AI - Project Status Report

> Generated: February 6, 2026
> Purpose: Handoff document for AI feature integration (brain dump analysis, smart scheduling, regenerative breaks, distraction puzzles)

---

## 1. Project Structure

**Framework:** Expo 54 + React Native 0.81 + TypeScript 5.9
**Architecture:** Pragmatic Atomic Design with Colocation

```
src/
├── components/          # Global reusable UI (used in 2+ screens)
│   ├── atoms/           # Button, AppText, StepBadge, FloatingActionButton, GradientBackground, AchievementIcon, IconSymbol
│   ├── molecules/       # GlassCard, FeatureCard, AnimatedCollapsible, ThemedText/View, ParallaxScrollView, ExternalLink
│   ├── organisms/       # OnboardingLayout (+ OnboardingBackground, OnboardingFooter)
│   └── animations/      # AnimatedProgressBar
│
├── screens/             # Feature screens (each with colocated ./components/)
│   ├── Auth/            # Login/signup
│   ├── Onboarding/      # 6-step onboarding flow
│   ├── Dashboard/       # Main hub (stats, priority queue, past sessions)
│   ├── Focus/           # Session setup (4-step wizard) — most complex screen
│   ├── Heart/           # Active focus session timer + break screen
│   ├── Brain/           # Brain dump / task analysis
│   ├── Shield/          # App blocking / friction engine
│   ├── Squad/           # Accountability (placeholder)
│   └── BlockScreen.tsx  # Fullscreen overlay when blocked app detected
│
├── types/               # ALL type definitions (no .types.ts files elsewhere)
│   ├── Focus/           # 8 files: index, TimerRing, SessionSetup, AppSelectionStep, AISessionPlanningStep, EnhancedFrictionModal, components
│   ├── Dashboard/       # 4 files: index, ActiveCard, PriorityQueue, StatsCard
│   ├── Onboarding/      # 4 files: components, AppSelectionScreen, PermissionsScreen, PermissionCallbacks
│   ├── Auth/            # components.ts
│   ├── Shield/          # components.ts
│   ├── Brain/           # TasksScreen.ts
│   ├── components/      # atoms.ts, molecules.ts (global component props)
│   ├── common/          # index.ts (shared types)
│   ├── animations.ts    # Animation hook option types
│   ├── store.ts         # Zustand store types
│   └── hooks.ts         # Hook utility types
│
├── store/               # Zustand stores (persisted to MMKV)
│   ├── authStore.ts
│   ├── onboardingStore.ts
│   ├── focusSessionStore.ts
│   └── storage.tsx      # MMKV encrypted storage config
│
├── hooks/               # Custom hooks
│   ├── focus/           # useSessionSetup, useTimeSelection, useAppSelection, useScheduleGeneration, useTimePicker, useSessionNavigation, useSessionBackHandler, useFocusTimer, useTimerAnimations
│   ├── dashboard/       # useQueueData, useQueueTimer, useQueueNavigation
│   ├── animations/      # useScalePress, useProgressAnimation, usePulseAnimation, useFloatingAnimation, useStaggeredEntry, useListItemAnimation, useAnimationConfig
│   ├── usePermissionsLogic.ts
│   ├── useInstalledApps.ts
│   ├── useNativePermissions.ts
│   ├── useFocusData.ts
│   ├── useColorScheme.ts
│   └── useThemeColor.ts
│
├── lib/                 # Utilities
│   ├── focus/           # generatePomodoroSchedule, blockFinder, focusBlockUtils, formatters, mathChallenge, milestones
│   ├── permissions/     # accessibilityPermission, notificationPermission
│   ├── constants/       # timerRing dimensions, animationPresets
│   └── theme.ts
│
├── constants/           # App constants
│   ├── colors.ts        # Brand color palette (COLORS object)
│   └── data.ts          # PILLARS, PERMISSIONS, USER_ROLES, ROLES, ROLLING_WORDS, NOTIFICATION_BULLET_POINTS
│
├── data/                # Mock/fixture data for development
│   ├── DashboardScreen.ts  # USER, PAST_SESSIONS, PRIORITY_QUEUE_DATA
│   ├── TasksScreen.ts      # MOCK_SCHEDULE (brain dump results)
│   ├── FocusSessionScreen.ts
│   └── ShieldScreen.ts
│
├── queries/             # React Query hooks
│   ├── useBalance.ts    # (broken - missing walletService)
│   ├── useTransactions.ts # (broken - missing walletService)
│   └── keys.ts          # Query key constants
│
├── services/            # Empty - no services implemented yet
│
└── tw/                  # Tailwind/NativeWind config
```

---

## 2. Screens Implemented

### Onboarding Flow (6 screens) — All Complete

| Step | Screen | Path | Status | Description |
|------|--------|------|--------|-------------|
| 1 | WelcomeScreen | `screens/Onboarding/WelcomeScreen.tsx` | Complete | Intro narrative "Just 5 More Minutes" |
| 2 | ProblemScreen | `screens/Onboarding/ProblemScreen.tsx` | Complete | Problem validation "You're not broken" |
| 3 | PillarsScreen | `screens/Onboarding/PillarsScreen.tsx` | Complete | 4 pillars: Brain, Shield, Heart, Squad |
| 4 | PermissionsScreen | `screens/Onboarding/PermissionsScreen.tsx` | Complete | Request accessibility + notifications |
| 5 | UserDetailsScreen | `screens/Onboarding/UserDetailsScreen.tsx` | Complete | Collect name + role |
| 6 | SetupCompleteScreen | `screens/Onboarding/SetupCompleteScreen.tsx` | Complete | Celebratory animation |

### Auth (1 screen) — Complete (Mock)

| Screen | Path | Status | Description |
|--------|------|--------|-------------|
| AuthScreen | `screens/Auth/AuthScreen.tsx` | Complete (mock) | Google/Apple sign-in buttons. Calls `login()` with hardcoded demo emails. No real OAuth. |

### Main App Screens

| Screen | Path | Status | Description | Key Notes |
|--------|------|--------|-------------|-----------|
| DashboardScreen | `screens/Dashboard/DashboardScreen.tsx` | Complete | Main hub: stats card, priority queue, past sessions list, FAB to start session | Has DEV cancel button (lines 58-68, marked for removal) |
| SessionSetupScreen | `screens/Focus/SessionSetupScreen.tsx` | Complete | 4-step wizard: Time → Apps → Brain Dump → AI Schedule | Brain dump is text input only, schedule is Pomodoro-based (no AI) |
| FocusSessionScreen | `screens/Heart/FocusSessionScreen.tsx` | Complete | Active timer with EnhancedTimerRing, floating controls, friction modal | Most polished screen. Timer ring is ~12 sub-components |
| BreakScreen | `screens/Heart/BreakScreen.tsx` | **Partial** | Shows hardcoded "10:00" timer. No real countdown logic | **Needs: real timer, break activity content, regenerative break types** |
| TasksScreen | `screens/Brain/TasksScreen.tsx` | Complete (mock) | Brain dump text input + mock AI schedule generation (1.5s fake delay) | **Uses MOCK_SCHEDULE data, no real AI integration** |
| ShieldScreen | `screens/Shield/ShieldScreen.tsx` | Complete | Friction toggle, guarded apps list, test challenge button | Challenge modal uses math puzzles from `mathChallenge.ts` |
| SquadScreen | `screens/Squad/SquadScreen.tsx` | **Skeleton** | Title + subtitle only, 20 lines | No functionality at all |
| BlockScreen | `screens/BlockScreen.tsx` | Complete | Fullscreen block overlay for blocked apps, prevents back navigation | Emergency unlock is placeholder `alert()` |

---

## 3. Components Inventory

### Global Atoms (9 components — all complete)

| Component | File | Purpose |
|-----------|------|---------|
| Button | `atoms/button.tsx` | Pressable with variants (primary/secondary/outline/ghost/destructive), sizes, loading state |
| AppText | `atoms/text.tsx` | Typography with 14 variants (display, h1-h6, body, caption, etc.) + 9 color options |
| StepBadge | `atoms/StepBadge.tsx` | Colored badge with icon + label |
| FloatingActionButton | `atoms/FloatingActionButton.tsx` | FAB with haptics, positioned bottom-right |
| GradientBackground | `atoms/GradientBackground.tsx` | Dark theme gradient wrapper |
| AchievementIcon | `atoms/AchievementIcon.tsx` | Animated circular badge with gradient colors |
| IconSymbol | `atoms/icon-symbol.tsx` | SF Symbols → MaterialIcons mapping (platform-specific) |
| Collapsible | `atoms/collapsible.tsx` | Basic expand/collapse with chevron |

### Global Molecules (10 components — all complete)

| Component | File | Purpose |
|-----------|------|---------|
| GlassCard | `molecules/GlassCard.tsx` | Glass-morphism card with BlurView |
| FeatureCard | `molecules/FeatureCard.tsx` | Feature showcase card with badge, meta |
| FeatureCardMeta | `molecules/FeatureCardMeta.tsx` | Meta tag list for FeatureCard |
| AnimatedCollapsible | `molecules/AnimatedCollapsible.tsx` | Advanced collapsible with Reanimated height animation |
| ThemedText | `molecules/themed-text.tsx` | Light/dark aware text |
| ThemedView | `molecules/themed-view.tsx` | Light/dark aware view |
| HapticTab | `molecules/haptic-tab.tsx` | Tab button with haptic feedback |
| ExternalLink | `molecules/external-link.tsx` | In-app browser link |
| ParallaxScrollView | `molecules/parallax-scroll-view.tsx` | Parallax header scroll |
| HelloWave | `molecules/hello-wave.tsx` | Animated wave emoji (prototype) |

### Global Organisms (3 components — all complete)

| Component | File | Purpose |
|-----------|------|---------|
| OnboardingLayout | `organisms/OnboardingLayout/OnboardingLayout.tsx` | Onboarding screen wrapper |
| OnboardingBackground | `organisms/OnboardingLayout/OnboardingBackground.tsx` | Gradient + floating orb |
| OnboardingFooter | `organisms/OnboardingLayout/OnboardingFooter.tsx` | Step dots + CTA button |

### Screen-Local Components

**Dashboard** (16 files across PriorityQueue/, PastSessionsList/, StatsCard/, DashboardHeader) — All complete

**Focus** (~30 files) — All complete. Includes:
- EnhancedTimerRing/ (12 files) — Full animated SVG timer ring
- AISessionPlanningStep/ (6 files) — Schedule display with expandable cards
- AppSelectionStep/ (3 files) — App blocking picker
- EnhancedFrictionModal/ (3 files) — Exit challenge with math puzzles
- TimeSelectionStep, BrainDumpStep, TimePicker, SessionSetupHeader/Footer, StepAnimator, etc.

**Onboarding** (10 files) — All complete

**Auth** (2 files: RollingText, AuthButtons) — Complete

**Shield** (1 file: ChallengeModal) — Complete

---

## 4. Native Modules & Dependencies

### Custom Native Module

| Module | Path | Purpose | Platform |
|--------|------|---------|----------|
| `installed-apps` | `modules/installed-apps/` | App detection, blocking, focus session management | Android (Nitro) |

**API:**
```typescript
getAppList(): Promise<AppInfo[]>           // List installed apps
getAppIcon(packageName: string): Promise<string>  // Base64 app icon
setBlockedApps(apps: string[]): void       // Set apps to block
getBlockedApps(): string[]                 // Get blocked list
setSchedule(startTime, endTime): void      // Set focus schedule
snoozeApp(pkg, minutes): void              // Temporary unblock
getSettings(): Promise<FocusSettings>      // Get focus settings
checkPermissions(): Promise<PermissionStatus>  // Check system perms
```

### Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `expo` | ~54.0.32 | Framework |
| `expo-router` | ~6.0.22 | File-based routing |
| `react-native-reanimated` | ~4.1.6 | Animations (heavily used) |
| `react-native-gesture-handler` | ~2.28.0 | Gestures |
| `zustand` | ^5.0.10 | State management |
| `react-native-mmkv` | ^4.1.2 | Encrypted persistent storage |
| `@tanstack/react-query` | ^5.90.20 | Server state / data fetching |
| `nativewind` | ^4.2.1 | Tailwind CSS for RN |
| `@shopify/flash-list` | 2.0.2 | High-performance lists |
| `expo-blur` | ~15.0.8 | Blur/glass effects |
| `expo-linear-gradient` | ~15.0.8 | Gradients |
| `expo-haptics` | ~15.0.8 | Haptic feedback |
| `expo-notifications` | ~0.32.16 | Push notifications |
| `expo-local-authentication` | ~17.0.8 | Biometric auth |
| `expo-secure-store` | ~15.0.8 | Secure credential storage |
| `lucide-react-native` | ^0.563.0 | Icons |
| `react-native-draggable-flatlist` | ^4.0.3 | Drag-to-reorder schedule |
| `react-native-nitro-modules` | ^0.33.2 | Native module framework |
| `react-native-svg` | (transitive) | SVG rendering (timer ring) |

### NOT Installed (Relevant Gaps)

- No AI/LLM SDK (no OpenAI, Anthropic, Google AI, etc.)
- No Supabase client (`@supabase/supabase-js`)
- No analytics SDK
- No crash reporting

---

## 5. State Management

**Library:** Zustand v5 with MMKV persistence

### Stores

| Store | File | State | Actions |
|-------|------|-------|---------|
| **authStore** | `store/authStore.ts` | `isAuthenticated`, `user` (email, id) | `login(userData?)`, `logout()` |
| **onboardingStore** | `store/onboardingStore.ts` | `name`, `description`, `hasCompletedOnboarding` | `setName()`, `setDescription()`, `completeOnboarding()`, `resetOnboarding()` |
| **focusSessionStore** | `store/focusSessionStore.ts` | `activeSchedule` (GeneratedSchedule \| null) | `setActiveSchedule()`, `clearActiveSchedule()`, `getCurrentBlock()`, `getUpcomingBlocks()` |

### Storage Config
- **Engine:** MMKV with encryption
- **Keys:** `auth-storage`, `onboarding-storage`, `focus-session-storage`
- **Warning:** Encryption key is hardcoded in `storage.tsx` ("resistor-ai-secure-key")

### Key Types (from `src/types/store.ts`)
```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: { email?: string; id?: string } | null;
  login: (userData?) => void;
  logout: () => void;
}

interface OnboardingState {
  name: string;
  description: string;
  hasCompletedOnboarding: boolean;
  // + setters
}

interface FocusSessionState {
  activeSchedule: GeneratedSchedule | null;
  // + setters + computed selectors
}
```

---

## 6. Backend/API Integration

### Supabase: NOT SET UP
- No `@supabase/supabase-js` dependency
- No Supabase client configuration
- No `.env` file with Supabase credentials
- Mentioned in README as planned but not implemented

### API Calls: NONE FUNCTIONAL
- React Query is configured (2-min cache, retry 2)
- `src/queries/` has `useBalance.ts` and `useTransactions.ts` referencing a missing `walletService` — these are broken
- No actual API endpoints are called anywhere

### Authentication: MOCK ONLY
- Google/Apple buttons exist but call `login({ email: "demo@example.com" })`
- No OAuth providers configured
- No JWT/session management
- Auth state is just a boolean in Zustand

### AI Integration: NONE
- No LLM SDK installed
- Schedule generation is a deterministic Pomodoro algorithm (`generatePomodoroSchedule.ts`)
- Brain dump screen has a 1.5-second fake delay before showing `MOCK_SCHEDULE` data
- No API calls to any AI service

### Edge Functions / Serverless: NONE
- No `supabase/functions/` directory
- No server-side code

---

## 7. Navigation

**Library:** Expo Router v6 (file-based routing)

### Route Map

```
app/
├── _layout.tsx              # Root: QueryClient + Theme
├── RootNav.tsx              # Font loading + splash
│
└── (app)/
    ├── _layout.tsx          # Auth/onboarding guard → redirects
    │
    ├── (protected)/         # Requires auth + onboarding
    │   ├── _layout.tsx      # Stack navigator (header hidden)
    │   ├── index.tsx        # → DashboardScreen
    │   ├── brain.tsx        # → TasksScreen
    │   ├── shield.tsx       # → ShieldScreen
    │   ├── squad.tsx        # → SquadScreen
    │   ├── focus.tsx        # → FocusSessionScreen
    │   ├── focus-setup.tsx  # → SessionSetupScreen
    │   └── break.tsx        # → BreakScreen
    │
    └── (public)/
        ├── _layout.tsx      # Routes to auth or onboarding
        │
        ├── (auth)/
        │   ├── _layout.tsx  # Stack with slide animation
        │   └── index.tsx    # → AuthScreen
        │
        └── (onboarding)/
            ├── _layout.tsx  # Stack with slide, gesture disabled
            ├── index.tsx        # → WelcomeScreen
            ├── problem.tsx      # → ProblemScreen
            ├── pillars.tsx      # → PillarsScreen
            ├── permissions.tsx  # → PermissionsScreen
            ├── user-details.tsx # → UserDetailsScreen
            └── complete.tsx     # → SetupCompleteScreen
```

### Routing Guards
```typescript
// (app)/_layout.tsx
const isReady = isAuthenticated && hasCompletedOnboarding;
// → Redirects to (protected) if ready, (public) if not
```

---

## 8. Key Files to Note

### Types
- **All types:** `src/types/` (27 files, ~1000 lines total)
- **Core domain types:** `src/types/Focus/index.ts` — `ScheduleBlock`, `GeneratedSchedule`, `ParsedTask`, `TaskPriority`
- **Store types:** `src/types/store.ts` — `AuthState`, `OnboardingState`, `FocusSessionState`
- **Component props:** `src/types/components/atoms.ts` and `molecules.ts`

### Schedule Generation (Current — No AI)
- **File:** `src/lib/focus/generatePomodoroSchedule.ts` (69 lines)
- **Logic:** Standard Pomodoro — 25min focus / 5min short break / 15min long break after 4 cycles
- **Input:** `(startTime, totalMinutes, hasTasks)` → `{ schedule: ScheduleBlock[], totalFocus, totalBreak }`
- **No task prioritization, no energy-based scheduling, no AI**

### Friction/Challenge System
- **Math puzzles:** `src/lib/focus/mathChallenge.ts` — generates `a × b` challenges
- **UI:** `src/screens/Focus/components/EnhancedFrictionModal/` — 3 files

### Mock Data
- `src/data/DashboardScreen.ts` — hardcoded user stats, past sessions, priority queue
- `src/data/TasksScreen.ts` — `MOCK_SCHEDULE` array returned from fake "AI" brain dump
- `src/data/ShieldScreen.ts` — placeholder data
- `src/data/FocusSessionScreen.ts` — placeholder data

### Native Module
- `modules/installed-apps/` — Android app detection + blocking via Accessibility Service

---

## 9. What's Missing for AI Features

### Brain Dump Analysis
**Current state:** `BrainDumpStep.tsx` is a `TextInput` that captures text. `TasksScreen.tsx` also has a text input. Neither sends data anywhere — brain dump text is passed to `useScheduleGeneration` which calls `generatePomodoroSchedule()` (a static Pomodoro algorithm).

**Gaps:**
- No NLP/AI processing of brain dump text
- No task extraction from natural language
- No priority inference
- No time estimation per task
- Need: API endpoint or Edge Function that takes raw text → returns `ParsedTask[]`
- Type already exists: `ParsedTask { id, title, estimatedMinutes, priority, originalText, notes }`

### Smart Scheduling
**Current state:** `generatePomodoroSchedule.ts` creates a fixed 25/5 Pomodoro pattern. No awareness of task content, energy levels, or priorities.

**Gaps:**
- No energy-curve-aware scheduling (e.g., hard tasks in peak hours)
- No task-to-block assignment (blocks are generic "Focus Block 1, 2, 3...")
- No priority-based ordering
- No user preference learning
- Need: Replace `generatePomodoroSchedule()` with AI-powered schedule generator
- Types exist: `ScheduleBlock`, `GeneratedSchedule`, `ScheduleSummary` (has `suggestion: string` field)

### Regenerative Breaks
**Current state:** `BreakScreen.tsx` is a 45-line placeholder with hardcoded "10:00" text. No countdown, no break activities.

**Gaps:**
- No timer countdown logic
- No break activity content (breathing exercises, stretching, micro-meditations)
- No break type differentiation (`short_break` vs `regenerative_break` types exist but unused)
- No activity recommendations based on session intensity
- Need: Break activity content system, timer, activity selection

### Distraction Puzzles / Friction Gate
**Current state:** `EnhancedFrictionModal` shows a math multiplication challenge (`a × b`). `ShieldScreen` has a test challenge modal. `mathChallenge.ts` generates simple multiplication.

**Gaps:**
- Only one puzzle type (multiplication)
- No difficulty scaling based on session importance
- No variety (word puzzles, memory challenges, typing challenges)
- No progressive difficulty within a session
- Need: Puzzle system with multiple types, difficulty levels, and progression

### Blocked Apps Management
**Current state:** Native `installed-apps` module handles app detection and blocking. `AppSelectionStep` in Focus setup lets users pick apps. `BlockScreen.tsx` is the overlay shown when blocked app is detected.

**Gaps:**
- No AI-suggested apps to block (based on usage patterns)
- Emergency unlock is placeholder `alert()`
- No usage analytics/tracking
- No smart blocking rules (time-based, context-based)
- BlockScreen could be more engaging (show progress, motivation)

### Backend Infrastructure (Required for All AI Features)
**Gaps:**
- No Supabase client setup
- No authentication backend (currently mock)
- No API service layer
- No Edge Functions for AI processing
- No user data persistence to database
- No session history storage (currently mock data)
- No `.env` configuration for API keys

### Recommended Integration Points

| Feature | Where to Hook In | Existing Code to Modify |
|---------|-----------------|------------------------|
| Brain dump → AI | `useScheduleGeneration.ts` → replace `generatePomodoroSchedule()` call with API call | Keep `GeneratedSchedule` type, replace generation logic |
| Smart schedule | `src/lib/focus/generatePomodoroSchedule.ts` → replace entirely or wrap with AI layer | Input types exist, output types exist |
| Break activities | `screens/Heart/BreakScreen.tsx` → build out from skeleton | `ScheduleBlockType` already has `"regenerative_break"` |
| More puzzles | `src/lib/focus/mathChallenge.ts` → expand with puzzle registry | `MathChallenge` type needs generalizing to `Challenge` |
| Supabase setup | Create `src/lib/supabase.ts` client | React Query already configured for async data |
| Auth backend | `store/authStore.ts` → replace mock `login()` with Supabase auth | `AuthState` type needs expanding |
| Session persistence | `store/focusSessionStore.ts` → sync to Supabase | Store already has `activeSchedule` state |

---

## 10. Summary

### What's Built (Frontend Complete)
- Full onboarding flow (6 screens)
- Auth screen (UI only, mock backend)
- Dashboard with stats, priority queue, past sessions
- 4-step focus session setup wizard (time → apps → brain dump → schedule)
- Polished focus timer with animated SVG ring (~12 sub-components)
- Friction modal with math challenge to prevent session exit
- App blocking overlay (BlockScreen)
- Shield settings screen
- Brain dump text input with mock schedule output
- Android native module for app detection/blocking
- 27 animation hooks for smooth UX
- Full type system (27 type files)

### What's NOT Built (Backend / AI)
- No Supabase database or client
- No real authentication (OAuth, JWT)
- No AI/LLM integration of any kind
- No API service layer
- No Edge Functions
- Schedule generation is static Pomodoro (no AI)
- Brain dump text is not analyzed
- Break screen is a placeholder
- Squad screen is empty
- Only one puzzle type (multiplication)
- No session history persistence
- No user analytics

### Tech Stack Summary
```
Frontend:    Expo 54 + React Native 0.81 + TypeScript 5.9
Routing:     Expo Router v6 (file-based)
State:       Zustand v5 + React Query v5
Storage:     MMKV (encrypted)
Styling:     NativeWind (Tailwind CSS) + Reanimated v4
Lists:       @shopify/flash-list
Native:      Custom Nitro module (Android app blocking)
Backend:     NONE (everything is client-side mock data)
AI:          NONE (Pomodoro algorithm only)
```
