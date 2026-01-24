import { View } from "react-native";
import { AppText } from "@/src/components/atoms/text";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SquadScreen() {
  const { top } = useSafeAreaInsets();
  return (
    <View
      className="flex-1 bg-background px-6"
      style={{ paddingTop: top + 20 }}
    >
      <StatusBar style="light" />
      <AppText variant="h2">Squad 👥</AppText>
      <AppText color="secondary" className="mt-2">
        Accountability partners & Leaderboard.
      </AppText>
    </View>
  );
}
