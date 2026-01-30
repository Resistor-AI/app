import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { View, Pressable } from "react-native";
import { CheckCircle2, Shield } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";

import { PastSessionsListProps, Session } from "@/src/types/Dashboard";

interface ExtendedPastSessionsListProps extends PastSessionsListProps {
  header?: React.ReactNode;
}

export function PastSessionsList({
  sessions,
  header,
}: ExtendedPastSessionsListProps) {
  const renderItem: ListRenderItem<Session> = ({ item }) => (
    <View className="px-6 mb-3">
      <View className="w-full bg-zinc-900 border border-zinc-800/50 p-4 rounded-2xl flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          <View className="h-10 w-10 rounded-full bg-zinc-800 items-center justify-center border border-zinc-700/50">
            <CheckCircle2 size={16} color="#71717a" />
          </View>

          <View>
            <AppText className="text-zinc-200 font-semibold text-sm tracking-tight">
              {item.title}
            </AppText>
            <View className="flex-row items-center gap-3 mt-0.5">
              <AppText className="text-zinc-500 text-[10px] font-medium">
                {item.date}
              </AppText>
              <View className="flex-row items-center gap-1">
                <Shield size={10} color="#10b981" />
                <AppText className="text-emerald-500 text-[10px] font-bold">
                  +{item.saved}
                </AppText>
              </View>
            </View>
          </View>
        </View>

        <View className="bg-zinc-800/50 px-3 py-1.5 rounded-md">
          <AppText className="text-zinc-400 text-xs font-mono">
            {item.focus}
          </AppText>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 w-full">
      <FlashList
        data={sessions}
        renderItem={renderItem}
        // @ts-ignore
        estimatedItemSize={50}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="px-6 py-10 items-center justify-center opacity-50">
            <View className="w-16 h-16 bg-zinc-900 rounded-full items-center justify-center mb-4 border border-zinc-800">
              <Shield size={24} color="#71717a" />
            </View>
            <AppText className="text-zinc-400 font-medium text-sm">
              No sessions yet
            </AppText>
            <AppText className="text-zinc-600 text-xs mt-1 text-center">
              Complete your first focus session{"\n"}to start building your
              streak.
            </AppText>
          </View>
        }
        ListHeaderComponent={
          <View>
            {header}
            <View className="px-6 flex-row justify-between items-end mb-4 pl-1">
              <AppText className="text-zinc-500 text-xs font-bold uppercase tracking-widest pl-4">
                Past Sessions
              </AppText>
              <Pressable>
                <AppText className="text-blue-500 text-xs font-medium">
                  View All
                </AppText>
              </Pressable>
            </View>
          </View>
        }
      />
    </View>
  );
}
