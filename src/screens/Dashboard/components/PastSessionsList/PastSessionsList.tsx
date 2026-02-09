import React from "react";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { View, Pressable } from "react-native";
import { memo, useCallback } from "react";
import Animated from "react-native-reanimated";
import { Shield } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import { useListAnimationRegistry } from "@/src/hooks/animations/useListItemAnimation";
import { useStaggeredEntry } from "@/src/hooks/animations/useStaggeredEntry";
import { useFloatingAnimation } from "@/src/hooks/animations/useFloatingAnimation";
import { Session, ExtendedPastSessionsListProps } from "@/src/types/Dashboard";
import { SessionItem, LIST_ID } from "./SessionItem";

const ListHeader = memo(function ListHeader({ children }: { children?: React.ReactNode }) {
  const { animatedStyle } = useStaggeredEntry({ index: 3, staggerDelay: 100, duration: 400, translateY: 10 });

  return (
    <View>
      {children}
      <Animated.View style={animatedStyle} className="px-6 flex-row justify-between items-end mb-4">
        <AppText content="Past Sessions" variant="overline" />
        <Pressable>
          <AppText content="View All" variant="overline" color="blue" />
        </Pressable>
      </Animated.View>
    </View>
  );
});

const EmptyState = memo(function EmptyState() {
  const { animatedStyle: containerStyle } = useStaggeredEntry({ index: 0, duration: 600, translateY: 20 });
  const { animatedStyle: floatingStyle } = useFloatingAnimation({ distance: 8, duration: 3000, isActive: true });
  const { animatedStyle: titleStyle } = useStaggeredEntry({ index: 1, staggerDelay: 100, duration: 400, translateY: 10 });
  const { animatedStyle: subtitleStyle } = useStaggeredEntry({ index: 2, staggerDelay: 100, duration: 400, translateY: 10 });

  return (
    <Animated.View style={containerStyle} className="px-6 py-10 items-center justify-center opacity-50">
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
          variant="body-sm" color="secondary" className="text-center mt-1"
          content={`Complete your first focus session\nto start building your streak.`}
        />
      </Animated.View>
    </Animated.View>
  );
});

export const PastSessionsList = memo(function PastSessionsList({
  sessions, header,
}: ExtendedPastSessionsListProps) {
  useListAnimationRegistry(LIST_ID);

  const renderItem: ListRenderItem<Session> = useCallback(
    ({ item }) => <SessionItem item={item} />, [],
  );
  const keyExtractor = useCallback((item: Session) => String(item.id), []);

  return (
    <View className="flex-1 w-full">
      <FlashList
        data={sessions}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState />}
        ListHeaderComponent={<ListHeader>{header}</ListHeader>}
      />
    </View>
  );
});
