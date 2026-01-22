import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProtectedIndex() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top }}>
      <View>
        <Text>Dashboard</Text>
        <Text>Welcome to Resistor</Text>
      </View>
    </View>
  );
}
