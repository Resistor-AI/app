import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { View, Pressable } from "react-native";
import { memo, useCallback } from "react";
import Animated from "react-native-reanimated";
import { CheckCircle2, Shield } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import {
  useListItemAnimation,
  useListAnimationRegistry,
  useStaggeredEntry,
  useFloatingAnimation,
} from "@/src/hooks/animations";

import { PastSessionsListProps, Session } from "@/src/types/Dashboard";

const LIST_ID = "past-sessions-list";

interface ExtendedPastSessionsListProps extends PastSessionsListProps {
  header?: React.ReactNode;
}

// Memoized list item with FlashList-safe animation
const SessionItem = memo(function SessionItem({ item }: { item: Session }) {
  // Use list item animation that tracks by item ID to prevent re-animation on recycle
  const { animatedStyle } = useListItemAnimation({
    listId: LIST_ID,
    itemId: item.id,
    type: "fadeSlide",
    duration: 250,
  });

  return (
    <Animated.View style={animatedStyle} className="px-6 mb-3">
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
    </Animated.View>
  );
});

// Empty state with animations
const EmptyState = memo(function EmptyState() {
  const { animatedStyle: containerStyle } = useStaggeredEntry({
    index: 0,
    duration: 600,
    translateY: 20,
  });

  const { animatedStyle: floatingStyle } = useFloatingAnimation({
    distance: 8,
    duration: 3000,
    isActive: true,
  });

  const { animatedStyle: titleStyle } = useStaggeredEntry({
    index: 1,
    staggerDelay: 100,
    duration: 400,
    translateY: 10,
  });

  const { animatedStyle: subtitleStyle } = useStaggeredEntry({
    index: 2,
    staggerDelay: 100,
    duration: 400,
    translateY: 10,
  });

  return (
    <Animated.View
      style={containerStyle}
      className="px-6 py-10 items-center justify-center opacity-50"
    >
      <Animated.View
        style={floatingStyle}
        className="size-16 bg-zinc-900 rounded-full items-center justify-center mb-4 border border-zinc-800"
      >
        <Shield size={24} color="#71717a" />
      </Animated.View>

      <Animated.View style={titleStyle}>
        <AppText variant="body" color="primary" content="No sessions yet" />
      </Animated.View>

      <Animated.View style={subtitleStyle}>
        <AppText
          variant="body-sm"
          color="secondary"
          className="text-center mt-1"
          content={`Complete your first focus session\nto start building your streak.`}
        />
      </Animated.View>
    </Animated.View>
  );
});

// List header with animation
const ListHeader = memo(function ListHeader({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { animatedStyle } = useStaggeredEntry({
    index: 3,
    staggerDelay: 100,
    duration: 400,
    translateY: 10,
  });

  return (
    <View>
      {children}
      <Animated.View
        style={animatedStyle}
        className="px-6 flex-row justify-between items-end mb-4"
      >
        <AppText content="Past Sessions" variant="overline" />
        <Pressable>
          <AppText content="View All" variant="overline" color="blue" />
        </Pressable>
      </Animated.View>
    </View>
  );
});

export const PastSessionsList = memo(function PastSessionsList({
  sessions,
  header,
}: ExtendedPastSessionsListProps) {
  // Manage animation registry lifecycle
  useListAnimationRegistry(LIST_ID);

  const renderItem: ListRenderItem<Session> = useCallback(
    ({ item }) => <SessionItem item={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Session) => String(item.id), []);

  return (
    <View className="flex-1 w-full">
      <FlashList
        data={sessions}
        renderItem={renderItem}
        // @ts-ignore
        estimatedItemSize={80}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState />}
        ListHeaderComponent={<ListHeader>{header}</ListHeader>}
      />
    </View>
  );
});
