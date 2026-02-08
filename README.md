# Resistor AI: The AI Productivity for Sustainable Focus while eliminating distraction, and preventing burnout

> [!NOTE]
> **Built for the Comet AI Evaluation Hackathon**

**Resistor AI** is an AI-powered productivity app designed to bridge the gap between planning and doing. It leverages AI to solve the "productivity paradox" by instantly analyzing your raw task list ("brain dump") and intelligently triaging it into a concrete roadmap of timed "Energy Chunks."

## 🚀 Key Features

- **Smart Scheduling ("The Brain")**: Instantly analyzes your raw task list and arranges them into a focused timeline with specific "Deep Work" and "Light Admin" sessions.
- **Friction Engine ("The Shield")**: Actively guards your focus by generating dynamic, context-aware "cognitive friction"—such as AI-generated puzzles—making doomscrolling difficult.
- **Regenerative Breaks ("The Heart")**: Enforces smart recovery breaks tailored to your energy needs to prevent biological burnout.

## 🏗 Architecture

This project follows **Pragmatic Atomic Design with Colocation** to ensure scalability and maintainability. Components are organized into atoms, molecules, and organisms, with screen-specific logic colocated for clarity.

## 🛠 Tech Stack

- **Language**: TypeScript
- **LLM**: [Gemini](https://gemini.com/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Database**: [Supabase](https://supabase.com/)
- **Framework**: [Expo](https://expo.dev) / React Native
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction)
- **AI Evaluation**: [Opik](https://www.comet.com/site/products/opik/) for tracing and evaluation

## ⚡️ Get Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start the app**

   ```bash
   npx expo start
   ```

   In the output, you'll find options to open the app in a:
   - [development build](https://docs.expo.dev/develop/development-builds/introduction/)
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## 📚 Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
