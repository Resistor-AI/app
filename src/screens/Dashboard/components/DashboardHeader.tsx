import { View, ViewStyle } from "react-native";
import { useEffect, useState } from "react";
import { useOnboardingStore } from "@/src/store/onboardingStore";
import { AppText } from "@/src/components/atoms/text";

export function DashboardHeader() {
  const { name } = useOnboardingStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Update every minute (or 30s to be safe)
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  // Greeting Logic
  const getGreeting = () => {
    const hour = currentDate.getHours();
    if (hour < 5) return "Good Night"; // Or "Late Night"
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 22) return "Good Evening";
    return "Good Night";
  };

  // Date Format: "Tue, Jan 30 • 2:45 PM"
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <View className="px-6 pt-8 pb-6">
      <View className="flex-row items-center justify-between mb-2">
        {/* Date & Time pill */}
        <View className="flex-row items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
          <View className="h-1.5 w-1.5 rounded-full bg-electricBlue shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
          <AppText className="text-zinc-400 text-[11px] font-bold tracking-widest uppercase font-mono">
            {formattedDate} • {formattedTime}
          </AppText>
        </View>
      </View>

      <View>
        <AppText className="text-3xl text-white font-semibold tracking-tight leading-10">
          {getGreeting()},{" "}
          <AppText className="text-zinc-500 text-3xl font-semibold">
            {name || "Guest"}.
          </AppText>
        </AppText>
      </View>
    </View>
  );
}
