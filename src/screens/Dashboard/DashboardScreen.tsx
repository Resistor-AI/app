import { View, Text, Pressable } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { PastSessionsList } from "./components/PastSessionsList/PastSessionsList";
import { FloatingActionButton } from "@/src/components/atoms/FloatingActionButton";

import { useFocusData } from "@/src/hooks/useFocusData";
import { useDashboardStats } from "@/src/hooks/dashboard/useDashboardStats";
import { DashboardHeader } from "./components/DashboardHeader";
import { PermissionBanner } from "./components/PermissionBanner";
import { StatsCard } from "./components/StatsCard/StatsCard";
import { PriorityQueue } from "./components/PriorityQueue/PriorityQueue";
import { AppText } from "@/src/components/atoms/text";
import { setSchedule } from "@/modules/installed-apps";
import { useFocusSessionStore } from "@/src/store/focusSessionStore";
import { useAuthStore } from "@/src/store/authStore";

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data, isLoading, refetch } = useFocusData();
  const { stats, pastSessions } = useDashboardStats();

  const clearActiveSchedule = useFocusSessionStore((s) => s.clearActiveSchedule);
  const logout = useAuthStore((s) => s.logout);

  // Sync native settings when screen regains focus
  useFocusEffect(useCallback(() => {
    refetch();
  }, [refetch]));

  const permissions = data?.permissions;
  const settings = data?.settings;

  const handleCreateSession = () => {
    router.push("/(app)/(protected)/focus-setup");
  };

  // DEV: Cancel session helper
  const handleDevCancelSession = () => {
    setSchedule(0, 0);
    clearActiveSchedule();
    refetch();
  };

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top"]}
      style={{ paddingBottom: insets.bottom + 20 }}
    >
      <View className="flex-1">
        <DashboardHeader />
        <PermissionBanner permissions={permissions} />

        {/* DEV: Logout - Remove after testing */}
        <Pressable onPress={logout} className="self-end mr-6 mb-2 bg-white/10 rounded-full px-3 py-1">
          <AppText variant="caption" className="text-white/60">Logout</AppText>
        </Pressable>

        {/* DEV: Cancel Session Button - Remove after testing */}
        {(settings?.isSessionActive || (settings && settings.scheduleStart > 0 && settings.scheduleEnd > Date.now())) && (
          <Pressable
            onPress={handleDevCancelSession}
            className="mx-6 mb-4 bg-red-500/20 border border-red-500/30 rounded-xl py-3 px-4"
          >
            <Text className="text-red-400 text-center font-semibold text-sm">
              [DEV] Cancel Session
            </Text>
          </Pressable>
        )}
        <StatsCard
          user={{
            streak: stats.streak,
            focusSaved: stats.focusSavedToday,
          }}
          realBlockedCount={settings?.blockedAppsCount ?? 0}
          blockedApps={data?.blockedApps ?? []}
          distractionsBlocked={stats.distractionsToday}
        />

        <PastSessionsList
          sessions={pastSessions}
          header={<PriorityQueue settings={settings} />}
        />
      </View>

      <FloatingActionButton onPress={handleCreateSession} />
    </SafeAreaView>
  );
}
