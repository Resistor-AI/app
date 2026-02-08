import { View } from "react-native";
import { BlurView } from "expo-blur";
import { RING_SIZE } from "./TimerRingConstants";

export function InnerGlassPanel() {
  return (
    <View
      className="absolute overflow-hidden"
      style={{
        width: RING_SIZE * 0.78,
        height: RING_SIZE * 0.78,
        borderRadius: RING_SIZE,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
      }}
    >
      <BlurView
        intensity={25}
        tint="dark"
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
      />
    </View>
  );
}
