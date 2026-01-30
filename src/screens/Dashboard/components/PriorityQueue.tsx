import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Hourglass } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import { PRIORITY_QUEUE_DATA } from "@/src/data/DashboardScreen";

export function PriorityQueue() {
  const renderItem = ({ item }: { item: any }) => {
    // ACTIVE CARD DESIGN
    if (item.status === "active") {
      return (
        <View className="mr-4 w-[200px] bg-zinc-900 rounded-[28px] p-6 justify-between h-52 border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.05)] relative overflow-hidden">
          {/* Background Glow */}
          <View className="absolute bottom-[-50%] right-[-50%] w-[150px] h-[150px] bg-yellow-500/10 rounded-full blur-[50px]" />

          {/* Top: Tag + Pulse */}
          <View className="flex-row justify-between items-center">
            <View className="bg-yellow-500/10 px-2.5 py-1.5 rounded-lg border border-yellow-500/10">
              <AppText className="text-yellow-500 text-[9px] font-black uppercase tracking-wider">
                {item.title}
              </AppText>
            </View>
            <View className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
          </View>

          {/* Middle: Content */}
          <View>
            <AppText className="text-white text-xl font-bold leading-6 tracking-tight mb-1">
              {item.subtitle}
            </AppText>
            <AppText className="text-zinc-500 text-xs font-medium">
              {item.description}
            </AppText>
          </View>

          {/* Bottom: Timer */}
          <View className="flex-row justify-between items-end">
            <AppText className="text-zinc-600 text-[10px] font-bold uppercase mb-1.5">
              Time Left
            </AppText>
            <AppText
              className="text-3xl text-white font-bold tracking-tighter"
              style={{ fontVariant: ["tabular-nums"] }}
            >
              24:15
            </AppText>
          </View>

          {/* Bottom Progress Line */}
          <View className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800">
            <View className="w-[45%] h-full bg-yellow-500" />
          </View>
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
          <View className="s-1.5 rounded-full bg-green-500 animate-pulse" />
          <AppText
            content="Live"
            className="text-green-500 text-[10px] font-bold uppercase"
          />
        </View>
      </View>

      <FlashList
        data={PRIORITY_QUEUE_DATA}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
      />
    </View>
  );
}
