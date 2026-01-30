import { useEffect, useState } from "react";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Hourglass, Coffee } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import { PRIORITY_QUEUE_DATA } from "@/src/data/DashboardScreen";
import { FocusSettings } from "@/modules/installed-apps";

interface PriorityQueueProps {
  settings?: FocusSettings;
  data?: any[];
}

export function PriorityQueue({ settings, data }: PriorityQueueProps) {
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const [progress, setProgress] = useState(0);

  // Use passed data or fallback to default, handling empty array explicitly
  const queueData = data !== undefined ? data : PRIORITY_QUEUE_DATA;

  useEffect(() => {
    if (!settings?.isSessionActive) {
      setTimeLeft("OFFLINE");
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const end = settings.scheduleEnd;
      const start = settings.scheduleStart;
      const remaining = end - now;
      const totalDuration = end - start;

      if (remaining <= 0) {
        setTimeLeft("FINISHED");
        setProgress(100);
        clearInterval(interval);
      } else {
        const h = Math.floor(remaining / 3600000);
        const m = Math.floor((remaining % 3600000) / 60000);
        const s = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(
          `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`,
        );
        setProgress(((now - start) / totalDuration) * 100);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settings]);

  const isActive = settings?.isSessionActive;

  // Empty State Card
  if (queueData.length === 0) {
    return (
      <View className="mb-10 w-full px-6">
        <View className="flex-row items-center justify-between mb-4 pl-1">
          <AppText
            content="Priority Queue"
            className="text-zinc-500 text-xs font-bold uppercase tracking-widest pl-4"
          />
        </View>
        <View className="w-full h-52 items-center justify-center opacity-50">
          <View className="w-16 h-16 bg-zinc-900 rounded-full items-center justify-center mb-4 border border-zinc-800">
            <Coffee size={24} color="#71717a" />
          </View>
          <AppText className="text-zinc-400 font-medium text-sm">
            All Caught Up
          </AppText>
          <AppText className="text-zinc-600 text-xs mt-1 text-center">
            No active sessions queued.{"\n"}Enjoy your free time!
          </AppText>
        </View>
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => {
    // ACTIVE CARD DESIGN
    if (item.status === "active") {
      return (
        <View className="mr-4 w-[200px] bg-zinc-900 rounded-[28px] p-6 justify-between h-52 border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.05)] relative overflow-hidden">
          {/* Background Glow */}
          <View className="absolute bottom-[-50%] right-[-50%] w-[150px] h-[150px] bg-yellow-500/10 rounded-full blur-[50px]" />

          {/* Top: Tag + Pulse */}
          <View className="flex-row justify-between items-center">
            <View
              className={`${isActive ? "bg-yellow-500/10 border-yellow-500/10" : "bg-zinc-800 border-zinc-700"} px-2.5 py-1.5 rounded-lg border`}
            >
              <AppText
                className={`${isActive ? "text-yellow-500" : "text-zinc-500"} text-[9px] font-black uppercase tracking-wider`}
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
              {isActive
                ? "Blocking Distractions"
                : "Schedule a session to start"}
            </AppText>
          </View>

          {/* Bottom: Timer */}
          <View className="flex-row justify-between items-end">
            <AppText className="text-zinc-600 text-[10px] font-bold uppercase mb-1.5">
              {isActive ? "Time Left" : "Status"}
            </AppText>
            <AppText
              className={`text-3xl ${isActive ? "text-white" : "text-zinc-600"} font-bold tracking-tighter`}
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
    }

    // QUEUED / NEXT CARD DESIGN
    const isBlue = item.color === "blue";
    const borderColor = isBlue ? "border-blue-500/10" : "border-zinc-800/80";
    const tagBg = isBlue ? "bg-blue-500/10" : "bg-zinc-800";
    const tagText = isBlue ? "text-blue-500" : "text-zinc-400";

    return (
      <View
        className={`mr-4 w-[180px] bg-zinc-900 rounded-[28px] p-6 justify-between h-52 border ${borderColor} opacity-60`}
      >
        {/* Top: Tag + Count */}
        <View className="flex-row justify-between items-center">
          <View
            className={`${tagBg} px-2.5 py-1.5 rounded-lg border ${isBlue ? "border-blue-500/10" : "border-zinc-700/50"}`}
          >
            <AppText
              className={`${tagText} text-[9px] font-black uppercase tracking-wider`}
            >
              {item.title}
            </AppText>
          </View>
          {item.count && (
            <AppText className="text-zinc-500 text-[10px] font-bold">
              {item.count}
            </AppText>
          )}
        </View>

        {/* Middle: Content */}
        <View>
          <AppText className="text-white text-lg font-bold leading-6 tracking-tight mb-1">
            {item.subtitle}
          </AppText>
          <AppText className="text-zinc-500 text-xs font-medium">
            {item.description}
          </AppText>
        </View>

        {/* Bottom: Duration */}
        <View className="flex-row items-center gap-2">
          <Hourglass size={14} color="#71717a" />
          <AppText className="text-zinc-400 text-sm font-bold">
            {item.duration}
          </AppText>
        </View>
      </View>
    );
  };

  return (
    <View className="mb-10 w-full">
      <View className="px-6 flex-row items-center justify-between mb-4 pl-1">
        <AppText
          content="Priority Queue"
          className="text-zinc-500 text-xs font-bold uppercase tracking-widest pl-4"
        />
        <View className="flex-row items-center gap-2">
          {isActive && (
            <>
              <View className="s-1.5 rounded-full bg-green-500 animate-pulse" />
              <AppText
                content="Live"
                className="text-green-500 text-[10px] font-bold uppercase"
              />
            </>
          )}
        </View>
      </View>

      <FlashList
        data={queueData}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
      />
    </View>
  );
}
