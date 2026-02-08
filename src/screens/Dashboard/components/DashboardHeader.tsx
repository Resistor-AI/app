import { View } from "react-native";
import { useEffect, useState, memo } from "react";
import Animated from "react-native-reanimated";
import { useOnboardingStore } from "@/src/store/onboardingStore";
import { AppText } from "@/src/components/atoms/text";
import { usePulseAnimation } from "@/src/hooks/animations/usePulseAnimation";
import { useStaggeredEntry } from "@/src/hooks/animations/useStaggeredEntry";

export const DashboardHeader = memo(function DashboardHeader() {
  const { name } = useOnboardingStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Pulsing indicator animation
  const { animatedStyle: pulseStyle } = usePulseAnimation({
    isActive: true,
    duration: 2000,
    minOpacity: 0.5,
    maxOpacity: 1,
  });

  // Entry animation for the single row
  const { animatedStyle: rowStyle } = useStaggeredEntry({
    index: 0,
    staggerDelay: 100,
    duration: 500,
    translateY: 10,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentDate.getHours();
    if (hour < 5) return "Good Night";
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 22) return "Good Evening";
    return "Good Night";
  };

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
    <Animated.View style={rowStyle} className="px-6 pt-8 pb-5 flex-row items-center gap-4">
      <AppText numberOfLines={1} className="flex-1 text-xl text-white font-semibold tracking-tight">
        {getGreeting()},{" "}
        <AppText className="text-zinc-500 text-xl font-semibold">
          {name || "Guest"}.
        </AppText>
      </AppText>

      <View className="flex-row items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 shrink-0">
        <Animated.View
          style={pulseStyle}
          className="h-1.5 w-1.5 rounded-full bg-electricBlue shadow-[0_0_8px_rgba(59,130,246,0.8)]"
        />
        <AppText className="text-zinc-400 text-[11px] font-bold tracking-widest uppercase font-mono">
          {formattedDate} • {formattedTime}
        </AppText>
      </View>
    </Animated.View>
  );
});
