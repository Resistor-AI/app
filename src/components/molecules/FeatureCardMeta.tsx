import { View } from "react-native";
import { AppText } from "@/src/components/atoms/text";

export function FeatureCardMeta({ items }: { items: string[] }) {
  if (!items.length) return null;

  return (
    <View style={{ flexDirection: "row", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
      {items.map((item, i) => (
        <View
          key={i}
          style={{
            backgroundColor: "rgba(0,0,0,0.04)",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          }}
        >
          <AppText style={{ fontSize: 13, color: "#555" }}>{item}</AppText>
        </View>
      ))}
    </View>
  );
}
