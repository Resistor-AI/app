import { View } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import { ActiveCardProps } from "@/src/types/Dashboard";

export const ActiveCard = ({
  isActive,
  timeLeft,
  progress,
}: ActiveCardProps) => {
  return (
    <View className="mr-4 w-[200px] bg-zinc-900 rounded-[28px] p-6 justify-between h-52 border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.05)] relative overflow-hidden">
      {/* Background Glow */}
      <View className="absolute bottom-[-50%] right-[-50%] w-[150px] h-[150px] bg-yellow-500/10 rounded-full blur-[50px]" />

      {/* Top: Tag + Pulse */}
      <View className="flex-row justify-between items-center">
        <View
          className={`${
            isActive
              ? "bg-yellow-500/10 border-yellow-500/10"
              : "bg-zinc-800 border-zinc-700"
          } px-2.5 py-1.5 rounded-lg border`}
        >
          <AppText
            className={`${
              isActive ? "text-yellow-500" : "text-zinc-500"
            } text-[9px] font-black uppercase tracking-wider`}
          >
            {isActive ? "Deep Work" : "Offline"}
          </AppText>
        </View>
        {isActive && (
          <View className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
        )}
      </View>

      {/* Middle: Content */}
      <View>
        <AppText className="text-white text-xl font-bold leading-6 tracking-tight mb-1">
          {isActive ? "Focus\nMode" : "No Active\nSession"}
        </AppText>
        <AppText className="text-zinc-500 text-xs font-medium">
          {isActive ? "Blocking Distractions" : "Schedule a session to start"}
        </AppText>
      </View>

      {/* Bottom: Timer */}
      <View className="flex-row justify-between items-end">
        <AppText className="text-zinc-600 text-[10px] font-bold uppercase mb-1.5">
          {isActive ? "Time Left" : "Status"}
        </AppText>
        <AppText
          className={`text-3xl ${
            isActive ? "text-white" : "text-zinc-600"
          } font-bold tracking-tighter`}
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {timeLeft}
        </AppText>
      </View>

      {isActive && (
        <View className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800">
          <View
            className="h-full bg-yellow-500"
            style={{ width: `${progress}%` }}
          />
        </View>
      )}
    </View>
  );
};
