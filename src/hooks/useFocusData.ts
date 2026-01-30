import { useQuery } from "@tanstack/react-query";
import InstalledApps from "@/modules/installed-apps";
import { AppState } from "react-native";
import { useEffect } from "react";

export const useFocusData = () => {
  const query = useQuery({
    queryKey: ["focusData"],
    queryFn: async () => {
      const permissions = await InstalledApps.checkPermissions();
      const settings = await InstalledApps.getSettings();
      const blockedApps = await InstalledApps.getBlockedApps();
      return { permissions, settings, blockedApps };
    },
    refetchOnMount: true,
  });

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") query.refetch();
    });
    return () => sub.remove();
  }, [query]);

  return query;
};
