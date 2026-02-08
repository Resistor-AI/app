import { Text } from "react-native";
import { StatementDisplayProps } from "@/src/types/Block/components";
import { COLORS } from "@/src/constants/colors";

export function StatementDisplay({ targetText, typedText }: StatementDisplayProps) {
  const typedLength = typedText.length;

  return (
    <Text className="text-xl leading-8">
      {targetText.split("").map((char, i) => (
        <Text
          key={i}
          style={{
            color: i < typedLength ? COLORS.textPrimary : COLORS.textTertiary,
            fontWeight: i < typedLength ? "500" : "400",
          }}
        >
          {char}
        </Text>
      ))}
    </Text>
  );
}
