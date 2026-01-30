import { View, TouchableOpacity, Linking, Text } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { PastSessionsList } from "./components/PastSessionsList";

import { useFocusData } from "@/src/hooks/useFocusData";
import { USER, PAST_SESSIONS } from "@/src/data/DashboardScreen";
import { DashboardHeader } from "./components/DashboardHeader";
import { StatsCard } from "./components/StatsCard";
import { PriorityQueue } from "./components/PriorityQueue";

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useFocusData();
  const permissions = data?.permissions;
  const settings = data?.settings;

  const isPermissionGranted =
    permissions?.accessibility && permissions?.notifications;

  const openSettings = () => {
    Linking.sendIntent("android.settings.ACCESSIBILITY_SETTINGS");
  };

  return (
    <View className="flex-1 bg-black">
      {/* Background: Subtle Ambient Glow */}
      {/* <View className="absolute top-[5%] left-[10%] right-[10%] h-[400px] bg-blue-900/10 rounded-full blur-[100px]" /> */}

      <SafeAreaView
        className="flex-1"
        edges={["top"]}
        style={{ paddingBottom: insets.bottom + 20 }}
      >
        <View className="flex-1">
          <DashboardHeader />
          <StatsCard
            user={USER}
            realBlockedCount={settings?.blockedAppsCount || 0}
            blockedApps={data?.blockedApps || []}
          />

          <PastSessionsList
            sessions={[]}
            header={<PriorityQueue settings={settings} data={[]} />}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
