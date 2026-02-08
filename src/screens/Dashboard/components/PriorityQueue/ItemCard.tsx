import { View } from "react-native";
import { memo } from "react";
import Animated from "react-native-reanimated";
import { Hourglass } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import { useStaggeredEntry } from "@/src/hooks/animations/useStaggeredEntry";
import { ExtendedItemCardProps } from "@/src/types/Dashboard/PriorityQueue";

export const ItemCard = memo(function ItemCard({
  item,
  index = 0,
}: ExtendedItemCardProps) {
  // Entry animation with stagger
  const { animatedStyle } = useStaggeredEntry({
    index: index + 1, // Offset to come after ActiveCard
    staggerDelay: 100,
    duration: 400,
    translateY: 15,
    initialScale: 0.95,
  });

  return (
    <Animated.View
      style={animatedStyle}
      className="mr-4 w-[180px] bg-zinc-900 rounded-[28px] p-6 justify-between h-52 border border-zinc-800/80 opacity-60"
    >
      {/* Top: Tag + Count */}
      <View className="flex-row justify-between items-center">
        <View className="bg-zinc-800 px-2.5 py-1.5 rounded-lg border border-zinc-700/50">
          <AppText className="text-zinc-400 text-[9px] font-black uppercase tracking-wider">
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
    </Animated.View>
  );
});
