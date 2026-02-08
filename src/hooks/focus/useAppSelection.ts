import { useState, useMemo, useCallback, useEffect } from "react";
import { getBlockedApps } from "@/modules/installed-apps";
import { useInstalledApps } from "@/src/hooks/useInstalledApps";
import * as Haptics from "expo-haptics";

export function useAppSelection() {
  const { data: categorizedApps, isLoading: isLoadingApps } = useInstalledApps();
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const blockedApps = getBlockedApps();
    if (blockedApps && blockedApps.length > 0) {
      setSelectedPackages(new Set(blockedApps));
    }
  }, []);

  const allApps = useMemo(() => {
    if (!categorizedApps) return [];
    return categorizedApps.flatMap((section) => section.data);
  }, [categorizedApps]);

  const defaultBlockedApps = useMemo(() => {
    const blocked = getBlockedApps() || [];
    return allApps.filter((app) => blocked.includes(app.packageName));
  }, [allApps]);

  const availableApps = useMemo(() => {
    const blocked = getBlockedApps() || [];
    return allApps.filter((app) => !blocked.includes(app.packageName));
  }, [allApps]);

  const toggleApp = useCallback((packageName: string) => {
    Haptics.selectionAsync();
    setSelectedPackages((prev) => {
      const next = new Set(prev);
      if (next.has(packageName)) next.delete(packageName);
      else next.add(packageName);
      return next;
    });
  }, []);

  const selectAllApps = useCallback(() => {
    Haptics.selectionAsync();
    setSelectedPackages(new Set(allApps.map((app) => app.packageName)));
  }, [allApps]);

  const deselectAllApps = useCallback(() => {
    Haptics.selectionAsync();
    const blocked = getBlockedApps() || [];
    setSelectedPackages(new Set(blocked));
  }, []);

  return {
    isLoadingApps, defaultBlockedApps, availableApps,
    selectedPackages, toggleApp, selectAllApps, deselectAllApps,
  };
}
