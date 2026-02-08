import { View } from "react-native";
import { BlurView } from "expo-blur";
import { ArrowRight } from "lucide-react-native";
import { AppText } from "@/src/components/atoms/text";
import { NextBlockCardProps } from "@/src/types/Focus/TimerRing";

export function NextBlockCard({ nextBlockName }: NextBlockCardProps) {
  return (
    <View className="items-center mt-5">
      <View
        className="overflow-hidden rounded-2xl"
        style={{ borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" }}
      >
        <BlurView intensity={25} tint="dark">
          <View
            className="flex-row items-center gap-3 px-4 py-3"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
          >
            <View
              className="w-8 h-8 rounded-full items-center justify-center"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
            >
              <ArrowRight size={14} color="rgba(255, 255, 255, 0.5)" />
            </View>
            <View>
              <AppText
                style={{
                  fontSize: 10,
                  fontWeight: "600",
                  color: "rgba(255, 255, 255, 0.4)",
                  letterSpacing: 1,
                  marginBottom: 2,
                }}
              >
                UP NEXT
              </AppText>
              <AppText
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: "rgba(255, 255, 255, 0.75)",
                }}
              >
                {nextBlockName}
              </AppText>
            </View>
          </View>
        </BlurView>
      </View>
    </View>
  );
}
