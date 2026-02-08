import React from "react";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { View } from "react-native";
import { memo, useCallback } from "react";
import { useListAnimationRegistry } from "@/src/hooks/animations/useListItemAnimation";
import { Session, ExtendedPastSessionsListProps } from "@/src/types/Dashboard";
import { SessionItem, LIST_ID } from "./SessionItem";
import { EmptyState } from "./EmptyState";
import { ListHeader } from "./ListHeader";

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
