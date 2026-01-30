import { View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { PastSessionsList } from "./components/PastSessionsList";

import { USER, PAST_SESSIONS } from "@/src/data/DashboardScreen";
import { DashboardHeader } from "./components/DashboardHeader";
import { StatsCard } from "./components/StatsCard";
import { PriorityQueue } from "./components/PriorityQueue";

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();

  /*
   * DASHBOARD STRUCTURE:
   * Root: Flex-1 View
   *  └─ FlashList (Vertical) - Handles scaling "Past Sessions"
   *      ├─ ListHeaderComponent:
   *      │   ├─ DashboardHeader
   *      │   ├─ StatsCard
   *      │   └─ PriorityQueue (Horizontal FlashList)
   *      └─ renderItem: Session Row
   */

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
          <StatsCard user={USER} />

          <PastSessionsList
            sessions={PAST_SESSIONS}
            header={<PriorityQueue />}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
