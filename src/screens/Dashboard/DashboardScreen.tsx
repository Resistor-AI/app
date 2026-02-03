import { View, TouchableOpacity, Linking, Text } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PastSessionsList } from "./components/PastSessionsList";
import { FloatingActionButton } from "@/src/components/atoms/FloatingActionButton";

import { useFocusData } from "@/src/hooks/useFocusData";
import { USER, PAST_SESSIONS } from "@/src/data/DashboardScreen";
import { DashboardHeader } from "./components/DashboardHeader";
import { StatsCard } from "./components/StatsCard";
import { PriorityQueue } from "./components/PriorityQueue";

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data, isLoading } = useFocusData();
  const permissions = data?.permissions;
  const settings = data?.settings;

  const isPermissionGranted =
    permissions?.accessibility && permissions?.notifications;

  const openSettings = () => {
    Linking.sendIntent("android.settings.ACCESSIBILITY_SETTINGS");
  };

  const handleCreateSession = () => {
    router.push("/(app)/(protected)/focus-setup");
  };

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top"]}
      style={{ paddingBottom: insets.bottom + 20 }}
    >
      <View className="flex-1">
        <DashboardHeader />
        <StatsCard
          user={{
            streak: 0,
            focusSaved: "0h 0m",
            screenTime: "0h 0m",
          }}
          realBlockedCount={settings?.blockedAppsCount ?? 0}
          blockedApps={data?.blockedApps ?? []}
          distractionsBlocked={0}
        />

        <PastSessionsList
          sessions={[]}
          header={<PriorityQueue settings={settings} />}
        />
      </View>

      <FloatingActionButton onPress={handleCreateSession} />
    </SafeAreaView>
  );
}
