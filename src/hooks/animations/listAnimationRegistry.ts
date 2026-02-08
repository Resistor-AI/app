import { useEffect, useRef, useCallback } from "react";

const animatedItemsRegistry = new Map<string, Set<string | number>>();

export function getRegistry(listId: string): Set<string | number> {
  if (!animatedItemsRegistry.has(listId)) {
    animatedItemsRegistry.set(listId, new Set());
  }
  return animatedItemsRegistry.get(listId)!;
}

export function clearListAnimationRegistry(listId: string): void {
  animatedItemsRegistry.delete(listId);
}

export function useListAnimationRegistry(listId: string) {
  const listIdRef = useRef(listId);

  useEffect(() => {
    listIdRef.current = listId;
    return () => { clearListAnimationRegistry(listIdRef.current); };
  }, [listId]);

  const clear = useCallback(() => {
    clearListAnimationRegistry(listId);
  }, [listId]);

  return { clear };
}
