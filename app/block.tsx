import BlockScreen from "@/src/screens/Block/BlockScreen";
import { useLocalSearchParams } from "expo-router";

export default function BlockRoute() {
  const { package: blockedPackage } = useLocalSearchParams<{ package: string }>();
  return <BlockScreen blockedPackage={blockedPackage} />;
}
