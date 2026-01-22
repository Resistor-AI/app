# Resistor AI - Screens Guide

## Overview

Based on the four pillars (Brain, Shield, Heart, Squad), the app requires **~20 screens** organized into 6 navigation groups.

---

## 1. Onboarding Flow (5 screens)

| Screen                | Purpose                                  |
| --------------------- | ---------------------------------------- |
| `WelcomeScreen`       | Hero intro, "Reclaim Your Focus"         |
| `ProblemScreen`       | Pain point: "Your Focus is Under Attack" |
| `PillarsScreen`       | Introduce the 4 pillars                  |
| `PermissionsScreen`   | Request notifications, usage access      |
| `SetupCompleteScreen` | Success state, CTA to start              |

---

## 2. Main Tabs (4 screens)

| Tab        | Screen            | Purpose                             |
| ---------- | ----------------- | ----------------------------------- |
| **Home**   | `DashboardScreen` | Daily focus score, quick actions    |
| **Brain**  | `TasksScreen`     | AI-scheduled task list              |
| **Shield** | `ShieldScreen`    | Blocked apps, friction settings     |
| **Squad**  | `SquadScreen`     | Accountability partners, team stats |

---

## 3. Brain Pillar (3 screens)

| Screen             | Purpose                        |
| ------------------ | ------------------------------ |
| `TasksScreen`      | View/manage AI-scheduled tasks |
| `AddTaskScreen`    | Dump tasks for AI to organize  |
| `TaskDetailScreen` | Edit task, set priority/effort |

---

## 4. Shield Pillar (3 screens)

| Screen                    | Purpose                             |
| ------------------------- | ----------------------------------- |
| `ShieldScreen`            | Toggle blocking, view blocked apps  |
| `AppSelectorScreen`       | Choose apps to block                |
| `FrictionChallengeScreen` | Puzzle/reflection before unblocking |

---

## 5. Heart Pillar (2 screens)

| Screen               | Purpose                          |
| -------------------- | -------------------------------- |
| `FocusSessionScreen` | Active timer, intensity tracking |
| `BreakScreen`        | Smart break prompts, rest timer  |

---

## 6. Squad Pillar (2 screens)

| Screen             | Purpose                             |
| ------------------ | ----------------------------------- |
| `SquadScreen`      | Partners list, collective deep work |
| `AddPartnerScreen` | Invite accountability partner       |

---

## 7. Settings & Profile (3 screens)

| Screen               | Purpose                        |
| -------------------- | ------------------------------ |
| `SettingsScreen`     | App preferences, notifications |
| `ProfileScreen`      | User stats, streak data        |
| `SubscriptionScreen` | Premium features, billing      |

---

## Directory Structure

```
src/screens/
├── Onboarding/
│   ├── WelcomeScreen.tsx
│   ├── ProblemScreen.tsx
│   ├── PillarsScreen.tsx
│   ├── PermissionsScreen.tsx
│   └── SetupCompleteScreen.tsx
│
├── Dashboard/
│   └── DashboardScreen.tsx
│
├── Brain/
│   ├── TasksScreen.tsx
│   ├── AddTaskScreen.tsx
│   └── TaskDetailScreen.tsx
│
├── Shield/
│   ├── ShieldScreen.tsx
│   ├── AppSelectorScreen.tsx
│   └── FrictionChallengeScreen.tsx
│
├── Heart/
│   ├── FocusSessionScreen.tsx
│   └── BreakScreen.tsx
│
├── Squad/
│   ├── SquadScreen.tsx
│   └── AddPartnerScreen.tsx
│
└── Settings/
    ├── SettingsScreen.tsx
    ├── ProfileScreen.tsx
    └── SubscriptionScreen.tsx
```

---

## Recommended Build Order

1. **Phase 1: Core Loop**
   - `DashboardScreen` → `FocusSessionScreen` → `BreakScreen`

2. **Phase 2: Brain**
   - `TasksScreen` → `AddTaskScreen` → `TaskDetailScreen`

3. **Phase 3: Shield**
   - `ShieldScreen` → `AppSelectorScreen` → `FrictionChallengeScreen`

4. **Phase 4: Squad**
   - `SquadScreen` → `AddPartnerScreen`

5. **Phase 5: Onboarding & Polish**
   - All onboarding screens → Settings/Profile
