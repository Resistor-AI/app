import { View } from "react-native";
import { useOnboardingStore } from "@/src/store/onboardingStore";
import { AppText } from "@/src/components/atoms/text";

export function DashboardHeader() {
  const { name } = useOnboardingStore();

  
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
  }).toUpperCase();

  return (
    <View className="px-6 pt-6 pb-6">
      <View className="flex-row items-center gap-2 mb-4">
        <View className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]" />
        <AppText className="text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase">
          {dateStr}
        </AppText>
      </View>

      <View>
        <AppText className="text-3xl text-white font-semibold tracking-tight leading-9">
          Good afternoon,{" "}
          <AppText className="text-zinc-500 text-3xl font-semibold">
            {name || "User"}.
          </AppText>
        </AppText>
      </View>
    </View>
  );
}
